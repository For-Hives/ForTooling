'use server'

import { BaseService } from '@/app/actions/services/pocketbase/api_client'
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
			const result = await this.getList({
				filter: `clerkId = "${clerkId}"`,
			})

			return result.items.length > 0 ? result.items[0] : null
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
		const existing = await this.findByClerkId(clerkId)

		if (existing) {
			return this.update(existing.id, {
				...data,
				clerkId,
			})
		}

		return this.create({
			...data,
			clerkId,
		})
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
