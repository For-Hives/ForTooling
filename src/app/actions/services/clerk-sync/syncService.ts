import {
	getByClerkId,
	_createAppUser,
	_updateAppUser,
} from '@/app/actions/services/pocketbase/app-user/internal'
// src/app/actions/services/clerk-sync/syncService.ts
import { getPocketBase } from '@/app/actions/services/pocketbase/baseService'
import {
	getOrganizationByClerkId,
	_createOrganization,
	_updateOrganization,
} from '@/app/actions/services/pocketbase/organization/internal'
import {
	AppUser,
	Organization as PBOrganization,
} from '@/types/types_pocketbase'
import { clerkClient, User } from '@clerk/nextjs/server'

/**
 * Type definitions for Clerk user data
 */
type ClerkUserData = {
	id: string
	first_name?: string
	last_name?: string
	username?: string
	image_url?: string
	email_addresses?: Array<{
		email_address: string
		verification?: {
			status?: string
		}
	}>
	phone_numbers?: Array<{
		phone_number: string
	}>
	public_metadata?: {
		isAdmin?: boolean
		role?: string
		[key: string]: unknown
	}
	[key: string]: unknown
}

/**
 * Type definitions for Clerk organization data
 */
type ClerkOrganizationData = {
	id: string
	name?: string
	email_address?: string
	phone_number?: string
	public_metadata?: {
		address?: string
		settings?: Record<string, unknown>
		[key: string]: unknown
	}
	[key: string]: unknown
}

/**
 * Type definitions for Clerk membership data
 */
type ClerkMembershipData = {
	organization: {
		id: string
	}
	public_user_data?: {
		user_id: string
	}
	role?: string
	[key: string]: unknown
}

/**
 * Synchronizes Clerk user data to PocketBase
 * @param user The user data from Clerk webhook or API
 * @returns The created or updated user
 */
export async function syncUserToPocketBase(user: User): Promise<AppUser> {
	try {
		const { emailAddresses, firstName, id: clerkId, lastName } = user

		if (!clerkId) {
			throw new Error('Clerk user ID is required for syncing')
		}

		// Get primary email
		const primaryEmail = emailAddresses.find(
			email => email.id === user.primaryEmailAddressId
		)
		if (!primaryEmail) {
			throw new Error('User must have a primary email address')
		}

		// Try to find existing AppUser
		const existingUser = await getByClerkId(clerkId)

		// Prepare user data
		const userDataToSync: Partial<AppUser> = {
			clerkId,
			email: primaryEmail.emailAddress,
			emailVisibility: true, // Set default value
			isAdmin: false, // Set default value
			name:
				firstName && lastName
					? `${firstName} ${lastName}`
					: (user.username ?? 'Unknown'),
			verified: primaryEmail.verification?.status === 'verified',
			// Leave organizations as empty for now
		}

		// Update or create
		if (existingUser) {
			console.info(`Updating existing AppUser ${clerkId} in PocketBase`)
			return await _updateAppUser(existingUser.id, userDataToSync)
		} else {
			console.info(`Creating new AppUser ${clerkId} in PocketBase`)
			return await _createAppUser(userDataToSync)
		}
	} catch (error) {
		console.error('Error syncing user to PocketBase:', error)
		throw error
	}
}

/**
 * Synchronizes Clerk organization data to PocketBase
 * @param organization The organization data from Clerk webhook or API
 * @returns The created or updated organization
 */
export async function syncOrganizationToPocketBase(
	organization: ClerkOrganizationData
): Promise<PBOrganization> {
	try {
		const { id: clerkId, name } = organization

		if (!clerkId) {
			throw new Error('Clerk organization ID is required for syncing')
		}

		console.info(`Attempting to sync organization with clerkId: ${clerkId}`)

		// Try to find existing Organization
		const existingOrg = await getOrganizationByClerkId(clerkId)
		console.info('Existing org lookup result:', existingOrg)

		// Prepare organization data
		const orgDataToSync: Partial<PBOrganization> = {
			clerkId,
			name: name ?? 'Unnamed Organization',
			// Add default values for required fields based on schema
			settings: {}, // Empty JSON object for settings
		}

		// Update or create
		if (existingOrg) {
			console.info(`Updating existing Organization ${clerkId} in PocketBase`)
			return await _updateOrganization(existingOrg.id, orgDataToSync)
		} else {
			console.info(`Creating new Organization ${clerkId} in PocketBase`)
			return await _createOrganization(orgDataToSync)
		}
	} catch (error) {
		console.error('Error syncing organization to PocketBase:', error)
		throw error
	}
}

/**
 * Links a user to an organization in PocketBase based on Clerk membership data
 * @param membershipData The membership data from Clerk webhook
 * @returns Success status
 */
export async function linkUserToOrganization(
	membershipData: ClerkMembershipData
): Promise<boolean> {
	try {
		const userId = membershipData.public_user_data?.user_id
		const orgId = membershipData.organization.id
		const role = membershipData.role // e.g., 'admin', 'member'

		if (!userId || !orgId) {
			throw new Error('Missing required IDs in membership data')
		}

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Find the user in PocketBase by Clerk ID
		const pbUser = await pb
			.collection('AppUser')
			.getFirstListItem(`clerkId="${userId}"`)

		// Find the organization in PocketBase by Clerk ID
		const pbOrg = await pb
			.collection('Organization')
			.getFirstListItem(`clerkId=${orgId}`)

		// Update the user with the organization relation
		await pb.collection('AppUser').update(pbUser.id, {
			organizations: pbOrg.id,
		})

		// Update user if they're an admin in the organization
		if (role === 'admin') {
			await pb.collection('AppUser').update(pbUser.id, {
				isAdmin: true,
				role: 'admin',
			})
		}

		return true
	} catch (error) {
		console.error('Error linking user to organization:', error)
		throw error
	}
}

/**
 * Fetch user data from Clerk by ID
 * @param clerkId The Clerk user ID
 * @returns The user data from Clerk
 */
export async function getClerkUserById(
	clerkId: string
): Promise<ClerkUserData> {
	try {
		const clerkClientInstance = await clerkClient()
		const user = await clerkClientInstance.users.getUser(clerkId)
		return {
			id: user.id,
			image_url: user.imageUrl,
		}
	} catch (error) {
		console.error('Error fetching user from Clerk:', error)
		throw error
	}
}

/**
 * Fetch organization data from Clerk by ID
 * @param clerkId The Clerk organization ID
 * @returns The organization data from Clerk
 */
export async function getClerkOrganizationById(
	clerkId: string
): Promise<ClerkOrganizationData> {
	try {
		const clerkClientInstance = await clerkClient()
		const organization =
			await clerkClientInstance.organizations.getOrganization({
				organizationId: clerkId,
			})
		return {
			id: organization.id,
			name: organization.name,
		}
	} catch (error) {
		console.error('Error fetching organization from Clerk:', error)
		throw error
	}
}
