import {
	syncUserToPocketBase,
	syncOrganizationToPocketBase,
	linkUserToOrganization,
} from '@/app/actions/services/clerk-sync/syncService'
import { auth, clerkClient } from '@clerk/nextjs/server'

/**
 * Type for metadata to replace any
 */
type ClerkMetadata = Record<string, unknown>

/**
 * Imports an organization after it's created during onboarding
 * This function should be called after organization creation in Clerk
 *
 * @param clerkOrgId The Clerk organization ID to import
 * @returns The imported organization data
 */
export async function importOrganizationAfterCreation(clerkOrgId: string) {
	'use server'

	try {
		const { userId } = await auth()

		if (!userId) {
			throw new Error('User not authenticated')
		}

		// Get the organization data from Clerk
		const clerkClientInstance = await clerkClient()
		const clerkOrg = await clerkClientInstance.organizations.getOrganization({
			organizationId: clerkOrgId,
		})

		// Sync the organization to PocketBase
		const organization = await syncOrganizationToPocketBase(clerkOrg)

		// Get the user from Clerk
		const clerkUser = await clerkClientInstance.users.getUser(userId)

		// Sync the user to PocketBase
		const user = await syncUserToPocketBase(clerkUser)

		// Create the membership data for the link
		const membershipData = {
			organization: { id: clerkOrgId },
			public_user_data: { user_id: userId },
			role: 'admin', // During onboarding, the creator is always an admin
		}

		// Link the user to the organization
		await linkUserToOrganization(membershipData)

		return {
			organization,
			status: 'success',
			user,
		}
	} catch (error) {
		console.error('Error importing organization after creation:', error)
		throw error
	}
}

/**
 * Updates user metadata in Clerk and syncs to PocketBase
 * Useful for onboarding completion
 *
 * @param metadata The metadata to set for the user
 * @returns Success status
 */
export async function updateUserMetadataAndSync(metadata: ClerkMetadata) {
	'use server'

	try {
		const { userId } = await auth()

		if (!userId) {
			throw new Error('User not authenticated')
		}

		// Update the metadata in Clerk
		const clerkClientInstance = await clerkClient()
		await clerkClientInstance.users.updateUserMetadata(userId, {
			publicMetadata: metadata,
		})

		// Get the updated user
		const clerkUser = await clerkClientInstance.users.getUser(userId)

		// Sync the updated user to PocketBase
		await syncUserToPocketBase(clerkUser)

		return { status: 'success' }
	} catch (error) {
		console.error('Error updating user metadata and syncing:', error)
		throw error
	}
}

/**
 * Updates organization metadata in Clerk and syncs to PocketBase
 *
 * @param orgId The Clerk organization ID
 * @param metadata The metadata to set for the organization
 * @returns Success status
 */
export async function updateOrgMetadataAndSync(
	orgId: string,
	metadata: ClerkMetadata
) {
	'use server'

	try {
		const { userId } = await auth()

		if (!userId) {
			throw new Error('User not authenticated')
		}

		// Update the metadata in Clerk
		const clerkClientInstance = await clerkClient()
		await clerkClientInstance.organizations.updateOrganizationMetadata(orgId, {
			publicMetadata: metadata,
		})

		// Get the updated organization
		const clerkOrg = await clerkClientInstance.organizations.getOrganization({
			organizationId: orgId,
		})

		// Sync the updated organization to PocketBase
		await syncOrganizationToPocketBase(clerkOrg)

		return { status: 'success' }
	} catch (error) {
		console.error('Error updating organization metadata and syncing:', error)
		throw error
	}
}
