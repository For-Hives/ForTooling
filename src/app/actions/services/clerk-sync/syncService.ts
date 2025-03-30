// src/app/actions/services/clerk-sync/syncService.ts
import { getPocketBase } from '@/app/actions/services/pocketbase/baseService'
import { User, Organization } from '@/types/types_pocketbase'
import { clerkClient } from '@clerk/nextjs'

/**
 * Synchronizes Clerk user data to PocketBase
 * @param userData The user data from Clerk webhook or API
 * @returns The created or updated user
 */
export async function syncUserToPocketBase(userData: any): Promise<User> {
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
			console.log(`Updating existing user ${clerkId} in PocketBase`)
			return await pb.collection('users').update(pbUser.id, userDataToSync)
		} else {
			console.log(`Creating new user ${clerkId} in PocketBase`)
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
	orgData: any
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
			console.log(`Updating existing organization ${clerkId} in PocketBase`)
			return await pb
				.collection('organizations')
				.update(pbOrg.id, orgDataToSync)
		} else {
			console.log(`Creating new organization ${clerkId} in PocketBase`)
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
	membershipData: any
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
			.getFirstListItem(`clerkId="${userId}"`)

		// Find the organization in PocketBase by Clerk ID
		const pbOrg = await pb
			.collection('organizations')
			.getFirstListItem(`clerkId="${orgId}"`)

		// Check if the relation already exists
		const existingRelations = await pb
			.collection('user_organizations')
			.getList(1, 1, {
				filter: `user=`${pbUser.id}` && organization=`${pbOrg.id}``,
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
export async function getClerkUserById(clerkId: string): Promise<any> {
	try {
		const clerkClientInstance = await clerkClient()
		return await clerkClientInstance.users.getUser(clerkId)
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
export async function getClerkOrganizationById(clerkId: string): Promise<any> {
	try {
		const clerkClientInstance = await clerkClient()
		return await clerkClientInstance.organizations.getOrganization(clerkId)
	} catch (error) {
		console.error('Error fetching organization from Clerk:', error)
		throw error
	}
}
