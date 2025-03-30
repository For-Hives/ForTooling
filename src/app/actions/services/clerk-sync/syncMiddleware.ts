import { secureCache } from '@/app/actions/services/clerk-sync/cacheService'
import {
	syncUserToPocketBase,
	syncOrganizationToPocketBase,
	linkUserToOrganization,
} from '@/app/actions/services/clerk-sync/syncService'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

/**
 * Type for any data accepted by server actions
 */
type ActionData = Record<string, unknown>

/**
 * Middleware function to ensure user and organization data is synced
 * Acts as a fallback in case webhooks fail
 *
 * @param request The incoming request
 * @returns The modified response
 */
export async function syncMiddleware(request: Request) {
	// Only run this middleware for authenticated routes
	const { orgId, userId } = await auth()

	if (!userId) {
		// User is not authenticated, skip this middleware
		return NextResponse.next()
	}

	try {
		const cacheKey = `sync:${userId}:${orgId || 'none'}`

		// Check if we've recently synced this user to avoid excessive checks
		// This is critical for performance in high-traffic scenarios
		const cachedSync = secureCache.get(cacheKey, userId)

		if (!cachedSync) {
			// If no cached result, perform the sync
			await ensureUserAndOrgSync(userId, orgId)

			// Cache the result to avoid frequent syncs
			// TTL of 5 minutes is a good balance between security and performance
			secureCache.set(
				cacheKey,
				{ synced: true, timestamp: Date.now() },
				userId,
				5 * 60 * 1000
			)
		}
	} catch (error) {
		// Log error but don't block the request
		// This ensures the app remains functional even if sync fails
		console.error('Sync middleware error:', error)
	}

	// Continue with the request
	return NextResponse.next()
}

/**
 * Ensures user and organization data is synchronized between Clerk and PocketBase
 *
 * @param clerkUserId The Clerk user ID
 * @param clerkOrgId The Clerk organization ID (optional)
 * @returns Object containing the synchronized user and organization
 */
export async function ensureUserAndOrgSync(
	clerkUserId: string,
	clerkOrgId?: string | null
) {
	// 1. First, try to get fresh data from Clerk
	const clerkClientInstance = await clerkClient()
	const clerkUser = await clerkClientInstance.users.getUser(clerkUserId)

	// 2. Sync the user to PocketBase
	await syncUserToPocketBase(clerkUser)

	// 3. If an organization ID is provided, sync that too
	if (clerkOrgId) {
		const clerkOrg = await clerkClientInstance.organizations.getOrganization({
			organizationId: clerkOrgId,
		})
		await syncOrganizationToPocketBase(clerkOrg)

		// 4. Ensure the user-organization relationship exists
		// This uses data available in the membership EndpointSecretOut
		const memberships =
			await clerkClientInstance.organizations.getOrganizationMembershipList({
				organizationId: clerkOrgId,
			})

		const membership = memberships.data.find(
			m => m.publicUserData?.userId === clerkUserId
		)

		if (membership) {
			// Prepare membership data in the format expected by linkUserToOrganization
			const membershipData = {
				organization: { id: clerkOrgId },
				public_user_data: { user_id: clerkUserId },
				role: membership.role,
			}

			await linkUserToOrganization(membershipData)
		}
	}

	// Return the operation result
	return {
		status: 'success',
		syncedAt: new Date().toISOString(),
	}
}

// For server action use, we create a higher-order function
/**
 * Higher-order function that wraps server actions to ensure sync before execution
 *
 * @param handler The server action handler function
 * @returns The wrapped handler with sync check
 */
export function withSync<T>(handler: (data: ActionData) => Promise<T>) {
	return async function syncProtectedAction(data: ActionData): Promise<T> {
		'use server'

		// Get auth context
		const { orgId, userId } = await auth()

		if (userId) {
			// Ensure data is synced before proceeding
			await ensureUserAndOrgSync(userId, orgId)
		}

		// Execute the original handler
		return handler(data)
	}
}
