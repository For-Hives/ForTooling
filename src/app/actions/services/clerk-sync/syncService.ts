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
		const {
			createdAt,
			emailAddresses,
			firstName,
			id: clerkId,
			imageUrl,
			lastName,
			lastSignInAt,
			phoneNumbers,
			primaryPhoneNumberId,
			publicMetadata,
			updatedAt,
		} = user

		console.log('clerkId', clerkId)
		console.log('user', user)
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

		// Get primary phone if available
		const primaryPhone = phoneNumbers.find(
			phone => phone.id === primaryPhoneNumberId
		)

		// Try to find existing AppUser
		const existingUser = await getByClerkId(clerkId)

		// Prepare user data with all available fields
		const userDataToSync: Partial<AppUser> = {
			clerkId,
			email: primaryEmail.emailAddress,
			emailVisibility: true,
			// Set admin status from metadata if available
			isAdmin: publicMetadata?.isAdmin === true,
			// Convert clerk's lastSignInAt to a format PocketBase understands
			lastLogin: lastSignInAt ? new Date(lastSignInAt).toISOString() : '',
			name:
				firstName && lastName
					? `${firstName} ${lastName}`
					: (user.username ?? 'Unknown'),
			phone: primaryPhone?.phoneNumber || '',
			// Set role from metadata if available
			role: typeof publicMetadata?.role === 'string' ? publicMetadata.role : '',
			verified: primaryEmail.verification?.status === 'verified',
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
		const {
			created_at,
			email_address,
			id: clerkId,
			name,
			phone_number,
			public_metadata,
			updated_at,
		} = organization

		if (!clerkId) {
			throw new Error('Clerk organization ID is required for syncing')
		}

		console.info(`Attempting to sync organization with clerkId: ${clerkId}`)

		// Try to find existing Organization
		const existingOrg = await getOrganizationByClerkId(clerkId)
		console.info('Existing org lookup result:', existingOrg)

		// Prepare organization data with all available fields
		const orgDataToSync: Partial<PBOrganization> = {
			address: public_metadata?.address ?? '',
			clerkId,
			email: email_address ?? '',
			name: name ?? 'Unnamed Organization',
			phone: phone_number ?? '',
			priceId: public_metadata?.priceId ?? '',
			// Sync settings from metadata if available
			settings: public_metadata?.settings ?? {},
			// Sync stripe data if available in metadata
			stripeCustomerId: public_metadata?.stripeCustomerId ?? '',
			subscriptionId: public_metadata?.subscriptionId ?? '',
			subscriptionStatus: public_metadata?.subscriptionStatus ?? '',
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
		const role = membershipData.role // e.g., 'org:admin', 'org:member'

		// Extract just the role part (remove 'org:' prefix if present)
		const normalizedRole = role?.replace('org:', '') ?? 'member'

		if (!userId || !orgId) {
			throw new Error('Missing required IDs in membership data')
		}

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		console.info(
			`Linking user ${userId} to organization ${orgId} with role ${normalizedRole}`
		)

		// Find the user in PocketBase by Clerk ID
		const pbUser = await pb
			.collection('AppUser')
			.getFirstListItem(`clerkId="${userId}"`)

		// Find the organization in PocketBase by Clerk ID
		const pbOrg = await pb
			.collection('Organization')
			.getFirstListItem(`clerkId="${orgId}"`)

		console.info(
			`Found user ${pbUser.id} and organization ${pbOrg.id} in PocketBase`
		)

		// Update the user with the organization relation
		await pb.collection('AppUser').update(pbUser.id, {
			organizations: pbOrg.id,
		})
		console.info(`Updated user ${pbUser.id} with organization ${pbOrg.id}`)

		// Update user role based on organization membership
		if (normalizedRole === 'admin') {
			await pb.collection('AppUser').update(pbUser.id, {
				isAdmin: true,
				role: 'admin',
			})
			console.info(`Updated user ${pbUser.id} to admin role`)
		} else {
			// Update the role even if not admin
			await pb.collection('AppUser').update(pbUser.id, {
				role: normalizedRole,
			})
			console.info(`Updated user ${pbUser.id} to ${normalizedRole} role`)
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

/**
 * Synchronizes user profile image from Clerk to PocketBase
 * @param userId The PocketBase user ID
 * @param imageUrl The Clerk image URL
 * @returns Success status
 */
export async function syncUserProfileImage(
	userId: string,
	imageUrl: string
): Promise<boolean> {
	if (!imageUrl) return false

	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Fetch the image data
		const response = await fetch(imageUrl)
		if (!response.ok) {
			throw new Error(`Failed to fetch image: ${response.statusText}`)
		}

		// Convert to blob
		const imageBlob = await response.blob()

		// Create a file object from the blob
		const formData = new FormData()
		formData.append('image', imageBlob, 'profile.jpg')
		formData.append('title', 'Profile Photo')
		formData.append('alt', 'User profile photo')

		// Create the image record in PocketBase
		const imageRecord = await pb.collection('Images').create(formData)

		// Update the user with the image relation
		await pb.collection('AppUser').update(userId, {
			avatar: imageRecord.id,
		})

		return true
	} catch (error) {
		console.error('Error syncing user profile image:', error)
		return false
	}
}
