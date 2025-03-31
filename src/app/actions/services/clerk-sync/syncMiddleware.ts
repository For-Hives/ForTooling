'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import {
	syncUserToPocketBase,
	syncOrganizationToPocketBase,
	linkUserToOrganizationFromClerk,
	ClerkMembershipData,
} from './syncService'

/**
 * Type for any data accepted by server actions
 */
type ActionData = Record<string, unknown>

/**
 * Middleware function to ensure user and organization data is synced
 * Acts as a fallback in case webhooks fail
 *
 * @returns The modified response
 */
export async function syncMiddleware() {
	// Only run this middleware for authenticated routes
	const { orgId, userId } = await auth()

	if (!userId) {
		// User is not authenticated, skip this middleware
		return NextResponse.next()
	}

	try {
		// Perform the sync without using cache
		await ensureUserAndOrgSync(userId, orgId)
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
	const clerkAPI = await clerkClient()
	const clerkUser = await clerkAPI.users.getUser(clerkUserId)

	// 2. Sync the user to PocketBase
	await syncUserToPocketBase(clerkUser)

	// 3. If an organization ID is provided, sync that too
	if (clerkOrgId) {
		const clerkOrg = await clerkAPI.organizations.getOrganization({
			organizationId: clerkOrgId,
		})

		await syncOrganizationToPocketBase(clerkOrg)

		// 4. Ensure the user-organization relationship exists
		const memberships =
			await clerkAPI.organizations.getOrganizationMembershipList({
				organizationId: clerkOrgId,
			})

		// Trouver le membership pour cet utilisateur
		const membership = memberships.data.find(
			m => m.publicUserData?.userId === clerkUserId
		)

		if (membership) {
			// Prepare membership data in the format expected by linkUserToOrganization
			const membershipData: ClerkMembershipData = {
				organization: { id: clerkOrgId },
				public_user_data: { user_id: clerkUserId },
				role: membership.role,
			}

			await linkUserToOrganizationFromClerk(membershipData)
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
