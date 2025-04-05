'use server'

import type {
	User,
	Organization as ClerkOrganization,
} from '@clerk/nextjs/server'

import { AppUser, Organization } from '@/models/pocketbase'

import {
	getAppUserService,
	AppUserCreateInput,
	createOrUpdateUserByClerkId,
} from '../pocketbase/app_user_service'
import { createOrUpdateOrganizationUserMapping } from '../pocketbase/organization_app_user_service'
import {
	getOrganizationService,
	OrganizationCreateInput,
	createOrUpdateOrganizationByClerkId,
} from '../pocketbase/organization_service'

/**
 * Type interface for Clerk Organization with additional fields
 */
interface EnhancedClerkOrganization extends ClerkOrganization {
	emailAddress?: string
	phoneNumber?: string
}

/**
 * Type for Clerk organization membership data
 */
export interface ClerkMembershipData {
	organization: {
		id: string
	}
	public_user_data?: {
		user_id: string
	}
	role?: string
}

/**
 * Synchronizes a Clerk user to PocketBase
 * @param clerkUser - The user data from Clerk webhook or API
 * @returns The created or updated user
 */
export async function syncUserToPocketBase(clerkUser: User): Promise<AppUser> {
	try {
		console.info('Syncing user with clerkId:', clerkUser.id)

		if (!clerkUser.id) {
			throw new Error('Clerk user ID is required for syncing')
		}

		// Get primary email
		const primaryEmail = clerkUser.emailAddresses.find(
			email => email.id === clerkUser.primaryEmailAddressId
		)

		if (!primaryEmail) {
			throw new Error('User must have a primary email address')
		}

		// Map Clerk data to our format
		const userData = {
			email: primaryEmail.emailAddress,
			emailVisibility: true,
			lastLogin: clerkUser.lastSignInAt
				? new Date(clerkUser.lastSignInAt).toISOString()
				: '',
			metadata: {
				createdAt: clerkUser.createdAt.toString(),
				externalAccounts:
					clerkUser.externalAccounts?.map(account => ({
						email: account.emailAddress || '',
						imageUrl: account.imageUrl || '',
						provider: account.provider,
						providerUserId: account.externalId,
					})) || [],
				hasCompletedOnboarding:
					clerkUser.publicMetadata?.hasCompletedOnboarding === true,
				lastActiveAt: clerkUser.lastActiveAt
					? clerkUser.lastActiveAt.toString()
					: '',
				onboardingCompletedAt: clerkUser.publicMetadata
					?.onboardingCompletedAt as string,
				public: {
					hasCompletedOnboarding:
						clerkUser.publicMetadata?.hasCompletedOnboarding === true,
					onboardingCompletedAt: clerkUser.publicMetadata
						?.onboardingCompletedAt as string,
				},
				updatedAt: clerkUser.updatedAt.toString(),
			},
			name:
				`${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
				clerkUser.username ||
				'Unknown',
			organizations: '',
		}

		// Use the utility function to create/update the user
		return await createOrUpdateUserByClerkId(
			clerkUser.id,
			userData as Omit<AppUserCreateInput, 'clerkId'>
		)
	} catch (error) {
		console.error('Error syncing user to PocketBase:', error)
		throw error
	}
}

/**
 * Synchronizes a Clerk organization to PocketBase
 * @param organization - The organization data from Clerk
 * @returns The created or updated organization
 */
export async function syncOrganizationToPocketBase(
	organization: EnhancedClerkOrganization
): Promise<Organization> {
	try {
		if (!organization.id) {
			throw new Error('Clerk organization ID is required for syncing')
		}

		console.info(
			`Attempting to sync organization with clerkId: ${organization.id}`
		)

		// Map Clerk data to our format
		const orgData = {
			address: (organization.publicMetadata?.address as string) || '',
			email: organization.emailAddress || '',
			name: organization.name || 'Unnamed Organization',
			phone: organization.phoneNumber || '',
			priceId: (organization.publicMetadata?.priceId as string) || '',
			settings: {
				clerkData: {
					createdAt: organization.createdAt,
					updatedAt: organization.updatedAt,
					...organization.publicMetadata,
				},
			},
			stripeCustomerId:
				(organization.publicMetadata?.stripeCustomerId as string) || '',
			subscriptionId:
				(organization.publicMetadata?.subscriptionId as string) || '',
			subscriptionStatus:
				(organization.publicMetadata?.subscriptionStatus as string) || '',
		}

		// Use the utility function to create/update the organization
		return await createOrUpdateOrganizationByClerkId(
			organization.id,
			orgData as Omit<OrganizationCreateInput, 'clerkId'>
		)
	} catch (error) {
		console.error('Error syncing organization to PocketBase:', error)
		throw error
	}
}

/**
 * Links a user to an organization based on Clerk membership data
 * @param membershipData - The membership data from Clerk
 * @returns The updated user or null if linking failed
 */
export async function linkUserToOrganizationFromClerk(
	membershipData: ClerkMembershipData
): Promise<AppUser | null> {
	try {
		const userId = membershipData.public_user_data?.user_id
		const orgId = membershipData.organization.id
		const role = membershipData.role?.replace('org:', '') || 'member'

		if (!userId || !orgId) {
			throw new Error('Missing required IDs in membership data')
		}

		console.info(
			`Linking user ${userId} to organization ${orgId} with role ${role}`
		)

		// Get the services
		const appUserService = getAppUserService()
		const organizationService = getOrganizationService()

		// Find the PocketBase records
		const user = await appUserService.findByClerkId(userId)
		const org = await organizationService.findByClerkId(orgId)

		if (!user || !org) {
			console.error('User or organization not found in PocketBase')
			return null
		}

		console.info(
			`Found user ${user.id} and organization ${org.id} in PocketBase`
		)

		// Create or update the relation in the junction table
		await createOrUpdateOrganizationUserMapping(user.id, org.id, role)

		// Return the user record
		return user
	} catch (error) {
		console.error('Error linking user to organization:', error)
		return null
	}
}
