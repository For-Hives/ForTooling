// src/app/actions/services/clerk-sync/syncService.ts
import { getPocketBase } from '@/app/actions/services/pocketbase/baseService'
import { User, Organization } from '@/types/types_pocketbase'
import { clerkClient } from '@clerk/nextjs/server'

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
 * @param userData The user data from Clerk webhook or API
 * @returns The created or updated user
 */
export async function syncUserToPocketBase(
	userData: ClerkUserData
): Promise<User> {
	try {
		const clerkId = userData.id
		if (!clerkId) {
			throw new Error('Missing Clerk ID in user data')
		}

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Try to find the existing user first
		let pbUser: User | null = null
		try {
			pbUser = await pb
				.collection('users')
				.getFirstListItem(`clerkId="${clerkId}"`)
		} catch (error) {
			// User doesn't exist yet, we'll create a new one
			pbUser = null
			console.error('Error syncing user to PocketBase:', error)
		}

		// Prepare the user data
		const userDataToSync = {
			avatar: userData.image_url || null,
			canLogin: true,
			clerkId: clerkId,
			email: userData.email_addresses?.[0]?.email_address || '',
			emailVisibility: true,
			isAdmin: userData.public_metadata?.isAdmin || false,
			lastLogin: new Date().toISOString(),
			name:
				`${userData.first_name || ''} ${userData.last_name || ''}`.trim() ||
				userData.username ||
				'User',
			phone: userData.phone_numbers?.[0]?.phone_number || null,
			role: userData.public_metadata?.role || 'user',
			verified:
				userData.email_addresses?.[0]?.verification?.status === 'verified' ||
				false,
		}

		// Update or create the user
		if (pbUser) {
			console.info(`Updating existing user ${clerkId} in PocketBase`)
			return await pb.collection('users').update(pbUser.id, userDataToSync)
		} else {
			console.info(`Creating new user ${clerkId} in PocketBase`)
			return await pb.collection('users').create(userDataToSync)
		}
	} catch (error) {
		console.error('Error syncing user to PocketBase:', error)
		throw error
	}
}

/**
 * Synchronizes Clerk organization data to PocketBase
 * @param orgData The organization data from Clerk webhook or API
 * @returns The created or updated organization
 */
export async function syncOrganizationToPocketBase(
	orgData: ClerkOrganizationData
): Promise<Organization> {
	try {
		const clerkId = orgData.id
		if (!clerkId) {
			throw new Error('Missing Clerk ID in organization data')
		}

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Try to find the existing organization first
		let pbOrg: Organization | null = null
		try {
			pbOrg = await pb
				.collection('organizations')
				.getFirstListItem(`clerkId="${clerkId}"`)
		} catch (error) {
			// Organization doesn't exist yet, we'll create a new one
			pbOrg = null
			console.error('Error syncing organization to PocketBase:', error)
		}

		// Prepare the organization data
		const orgDataToSync = {
			address: orgData.public_metadata?.address || null,
			clerkId: clerkId,
			email: orgData.email_address || null,
			name: orgData.name || 'Organization',
			phone: orgData.phone_number || null,
			settings: orgData.public_metadata?.settings || {},
		}

		// Update or create the organization
		if (pbOrg) {
			console.info(`Updating existing organization ${clerkId} in PocketBase`)
			return await pb
				.collection('organizations')
				.update(pbOrg.id, orgDataToSync)
		} else {
			console.info(`Creating new organization ${clerkId} in PocketBase`)
			return await pb.collection('organizations').create(orgDataToSync)
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
			.collection('users')
			.getFirstListItem(`clerkId=${userId}`)

		// Find the organization in PocketBase by Clerk ID
		const pbOrg = await pb
			.collection('organizations')
			.getFirstListItem(`clerkId=${orgId}`)

		// Check if the relation already exists
		const existingRelations = await pb
			.collection('user_organizations')
			.getList(1, 1, {
				filter: `user="${pbUser.id}" && organization="${pbOrg.id}"`,
			})

		// If the relation doesn't exist, create it
		if (existingRelations.totalItems === 0) {
			await pb.collection('user_organizations').create({
				organization: pbOrg.id,
				role: role || 'member',
				user: pbUser.id,
			})
		} else {
			// Update the existing relation if needed
			await pb
				.collection('user_organizations')
				.update(existingRelations.items[0].id, {
					role: role || 'member',
				})
		}

		// Update user if they're an admin in the organization
		if (role === 'admin') {
			await pb.collection('users').update(pbUser.id, {
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
			// email_addresses: user.emailAddresses.map(email => ({
			// 	email_address: email.emailAddress,
			// 	verification: email.verification,
			// })),
			// first_name: user.firstName,
			id: user.id,
			image_url: user.imageUrl,
			// last_name: user.lastName,
			// username: user.username,
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
			// email_address: organization.email_address,
			id: organization.id,
			name: organization.name,
			// phone_number: organization.phone_number,
		}
	} catch (error) {
		console.error('Error fetching organization from Clerk:', error)
		throw error
	}
}
