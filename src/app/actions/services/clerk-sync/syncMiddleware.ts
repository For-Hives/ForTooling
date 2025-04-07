'use server'

import { AppUser, Organization } from '@/models/pocketbase'
import { clerkClient, OrganizationMembership } from '@clerk/nextjs/server'

import {
	findUserByClerkId,
	getAppUserService,
} from '../pocketbase/app_user_service'
import {
	createOrUpdateOrganizationUserMapping,
	getOrganizationAppUserService,
} from '../pocketbase/organization_app_user_service'
import { findOrganizationByClerkId } from '../pocketbase/organization_service'
import {
	syncOrganizationToPocketBase,
	syncUserToPocketBase,
} from './syncService'

/**
 * Ensures a user is synchronized between Clerk and PocketBase
 * @param clerkUserId - The Clerk user ID
 * @returns The PocketBase user
 */
export async function ensureUserSync(clerkUserId: string): Promise<AppUser> {
	// Check if user already exists in PocketBase
	const existingUser = await findUserByClerkId(clerkUserId)
	if (existingUser) {
		return existingUser
	}

	// User not found, sync from Clerk
	const clerk = await clerkClient()
	const clerkUser = await clerk.users.getUser(clerkUserId)

	return syncUserToPocketBase(clerkUser)
}

/**
 * Ensures an organization is synchronized between Clerk and PocketBase
 * @param clerkOrgId - The Clerk organization ID
 * @returns The PocketBase organization
 */
export async function ensureOrgSync(clerkOrgId: string): Promise<Organization> {
	// Check if organization already exists in PocketBase
	const existingOrg = await findOrganizationByClerkId(clerkOrgId)
	if (existingOrg) {
		return existingOrg
	}

	const clerk = await clerkClient()
	const clerkOrg = await clerk.organizations.getOrganization({
		organizationId: clerkOrgId,
	})

	return syncOrganizationToPocketBase(clerkOrg)
}

/**
 * Ensures a user and organization are synchronized and linked
 * @param clerkUserId - The Clerk user ID
 * @param clerkOrgId - The Clerk organization ID
 * @returns The PocketBase user and organization
 */
export async function ensureUserAndOrgSync(
	clerkUserId: string,
	clerkOrgId: string
): Promise<{ user: AppUser; org: Organization }> {
	try {
		// First ensure both user and org exist in PocketBase
		const [user, org] = await Promise.all([
			ensureUserSync(clerkUserId),
			ensureOrgSync(clerkOrgId),
		])

		if (!user || !org) {
			console.error(
				`Failed to sync user ${clerkUserId} or organization ${clerkOrgId}`
			)
			throw new Error('User or organization sync failed')
		}

		// Get the user's role in the organization from Clerk
		const clerk = await clerkClient()

		// Get all memberships for the organization
		const memberships = await clerk.organizations.getOrganizationMembershipList(
			{
				organizationId: clerkOrgId,
			}
		)

		// Validate that the user is actually a member of this organization
		const membership = memberships.data.find(
			m => m.publicUserData?.userId === clerkUserId
		)

		if (!membership) {
			console.warn(
				`User ${clerkUserId} is not a member of organization ${clerkOrgId} in Clerk`
			)
			// Get organization app user service
			const orgAppUserService = getOrganizationAppUserService()

			// Check if there's an incorrect mapping in PocketBase
			const existingMapping =
				await orgAppUserService.findByAppUserAndOrganization(user.id, org.id)

			// If an incorrect mapping exists, remove it for security
			if (existingMapping) {
				console.warn(
					`Removing unauthorized mapping for user ${user.id} in org ${org.id}`
				)
				await orgAppUserService.deleteMapping(user.id, org.id)
			}

			throw new Error(
				`User ${clerkUserId} is not authorized to access organization ${clerkOrgId}`
			)
		}

		// Default to 'member' if no specific role is found
		const role = membership.role?.replace('org:', '') || 'member'

		// Create or update the mapping in the junction table
		await createOrUpdateOrganizationUserMapping(user.id, org.id, role)

		// Verify all other memberships to ensure consistency between Clerk and PocketBase
		await verifyAllOrganizationMemberships(clerkOrgId, org.id, memberships.data)

		return { org, user }
	} catch (error) {
		console.error(
			`Error ensuring user-org sync: ${error instanceof Error ? error.message : 'Unknown error'}`
		)
		throw error
	}
}

/**
 * Verifies that all memberships match between Clerk and PocketBase
 * @param clerkOrgId - The Clerk organization ID
 * @param pbOrgId - The PocketBase organization ID
 * @param clerkMemberships - The list of memberships from Clerk
 */
async function verifyAllOrganizationMemberships(
	clerkOrgId: string,
	pbOrgId: string,
	clerkMemberships: OrganizationMembership[]
): Promise<void> {
	try {
		// Get the organization-app-user service
		const orgAppUserService = getOrganizationAppUserService()

		// Get all mappings for this organization in PocketBase
		const pbMappings = await orgAppUserService.findByOrganizationId(pbOrgId)

		// Get the app user service to look up users by clerk ID
		const appUserService = getAppUserService()

		// For each PocketBase mapping, verify it exists in Clerk
		for (const pbMapping of pbMappings) {
			// Get the app user from PocketBase
			const appUser = await appUserService.getById(pbMapping.appUser)

			if (!appUser || !appUser.clerkId) {
				console.warn(
					`User ${pbMapping.appUser} has no clerkId, skipping verification`
				)
				continue
			}

			// Check if this user is a member in Clerk
			const clerkMembership = clerkMemberships.find(
				m => m.publicUserData?.userId === appUser.clerkId
			)

			// If no membership exists in Clerk but exists in PocketBase, remove it
			if (!clerkMembership) {
				console.warn(
					`User ${appUser.clerkId} is not a member of org ${clerkOrgId} in Clerk, removing from PocketBase`
				)
				await orgAppUserService.deleteMapping(pbMapping.appUser, pbOrgId)
				continue
			}

			// If the roles don't match, update the PocketBase role
			const clerkRole = clerkMembership.role?.replace('org:', '') || 'member'
			if (pbMapping.role !== clerkRole) {
				await orgAppUserService.createOrUpdate(
					pbMapping.appUser,
					pbOrgId,
					clerkRole
				)
			}
		}

		// For each Clerk membership, ensure it exists in PocketBase
		for (const clerkMembership of clerkMemberships) {
			const clerkUserId = clerkMembership.publicUserData?.userId
			if (!clerkUserId) {
				console.warn('Clerk membership has no userId, skipping')
				continue
			}

			// Find the user in PocketBase
			const pbUser = await appUserService.findByClerkId(clerkUserId)
			if (!pbUser) {
				continue
			}

			// Check if mapping exists
			const pbMapping = await orgAppUserService.findByAppUserAndOrganization(
				pbUser.id,
				pbOrgId
			)

			// If no mapping exists in PocketBase but exists in Clerk, create it
			if (!pbMapping) {
				const role = clerkMembership.role?.replace('org:', '') || 'member'
				await orgAppUserService.createOrUpdate(pbUser.id, pbOrgId, role)
			}
		}
	} catch (error) {
		console.error('Error verifying organization memberships:', error)
		// Don't throw, just log the error to prevent breaking the main sync flow
	}
}
