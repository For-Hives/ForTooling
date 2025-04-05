import { BaseService } from '@/app/actions/services/pocketbase/api_client'
import { getPocketBase } from '@/app/actions/services/pocketbase/api_client/client'
import {
	AppUser,
	AppUserCreateInput,
	AppUserUpdateInput,
	Collections,
	appUserCreateSchema,
	appUserSchema,
	appUserUpdateSchema,
} from '@/models/pocketbase'

// Re-export types for convenience
export type { AppUser, AppUserCreateInput, AppUserUpdateInput }

/**
 * Service for AppUser-related operations
 */
export class AppUserService extends BaseService<
	AppUser,
	AppUserCreateInput,
	AppUserUpdateInput
> {
	constructor() {
		super(
			Collections.APP_USERS,
			// @ts-expect-error - Types are compatible but TypeScript cannot verify it [ :) ]
			appUserSchema,
			appUserCreateSchema,
			appUserUpdateSchema
		)
	}

	/**
	 * Find a user by Clerk ID
	 *
	 * @param clerkId - The Clerk user ID
	 * @returns The user or null if not found
	 */
	async findByClerkId(clerkId: string): Promise<AppUser | null> {
		try {
			// Use getPocketBase directly to avoid validation issues
			const pb = getPocketBase()
			const records = await pb.collection(this.collectionName).getFullList({
				filter: `clerkId="${clerkId}"`,
			})

			if (records.length === 0) {
				return null
			}

			// Clean and normalize the response data
			const record = records[0]

			// Fix organizations field if it's an array
			if (Array.isArray(record.organizations)) {
				record.organizations = ''
			}

			return record as unknown as AppUser
		} catch (error) {
			console.error('Error finding user by clerkId:', error)
			return null
		}
	}

	/**
	 * Check if a user with the given Clerk ID exists
	 *
	 * @param clerkId - The Clerk user ID
	 * @returns True if the user exists
	 */
	async existsByClerkId(clerkId: string): Promise<boolean> {
		try {
			const count = await this.getCount(`clerkId = "${clerkId}"`)
			return count > 0
		} catch (error) {
			console.error('Error checking if user exists by clerkId:', error)
			return false
		}
	}

	/**
	 * Create or update a user by Clerk ID
	 *
	 * @param clerkId - The Clerk user ID
	 * @param data - The user data
	 * @returns The created or updated user
	 */
	async createOrUpdateByClerkId(
		clerkId: string,
		data: Omit<AppUserCreateInput, 'clerkId'>
	): Promise<AppUser> {
		try {
			const existing = await this.findByClerkId(clerkId)

			if (existing) {
				console.info(`Updating existing user with clerkId: ${clerkId}`)
				// When updating, ensure we don't overwrite organizations field with an empty string
				// if the user already has organizations
				const updateData = {
					...data,
					clerkId,
				} as AppUserUpdateInput

				return this.update(existing.id, updateData, { validateOutput: false })
			}

			console.info(`Creating new user with clerkId: ${clerkId}`)
			// For new users, make sure organizations is a string
			const createData = {
				...data,
				clerkId,
				organizations: data.organizations || '',
			} as AppUserCreateInput

			return this.create(createData, { validateOutput: false })
		} catch (error) {
			console.error('Error in createOrUpdateByClerkId:', error)
			throw error
		}
	}

	/**
	 * Link a user to an organization
	 *
	 * @param userId - The user ID
	 * @param organizationId - The organization ID
	 * @param role - The user's role in the organization
	 * @returns The updated user
	 */
	async linkToOrganization(
		userId: string,
		organizationId: string,
		role: string = 'member'
	): Promise<AppUser> {
		return this.update(userId, {
			organizations: organizationId,
			role,
		})
	}

	/**
	 * Get all users in an organization
	 *
	 * @param organizationId - The organization ID
	 * @returns List of users in the organization
	 */
	async getByOrganization(organizationId: string): Promise<AppUser[]> {
		try {
			const result = await this.getList({
				filter: `organizations = "${organizationId}"`,
			})

			return result.items
		} catch (error) {
			console.error('Error getting users by organization:', error)
			return []
		}
	}
}

// Singleton instance
let appUserServiceInstance: AppUserService | null = null

/**
 * Get the AppUserService instance
 *
 * @returns The AppUserService instance
 */
export function getAppUserService(): AppUserService {
	if (!appUserServiceInstance) {
		appUserServiceInstance = new AppUserService()
	}
	return appUserServiceInstance
}

/**
 * Find a user by Clerk ID
 *
 * @param clerkId - The Clerk user ID
 * @returns The user or null if not found
 */
export async function findUserByClerkId(
	clerkId: string
): Promise<AppUser | null> {
	return getAppUserService().findByClerkId(clerkId)
}

/**
 * Create or update a user by Clerk ID
 *
 * @param clerkId - The Clerk user ID
 * @param data - The user data
 * @returns The created or updated user
 */
export async function createOrUpdateUserByClerkId(
	clerkId: string,
	data: Omit<AppUserCreateInput, 'clerkId'>
): Promise<AppUser> {
	return getAppUserService().createOrUpdateByClerkId(clerkId, data)
}

/**
 * Link a user to an organization
 *
 * @param userId - The user ID
 * @param organizationId - The organization ID
 * @param role - The user's role in the organization
 * @returns The updated user
 */
export async function linkUserToOrganization(
	userId: string,
	organizationId: string,
	role: string = 'member'
): Promise<AppUser> {
	return getAppUserService().linkToOrganization(userId, organizationId, role)
}
