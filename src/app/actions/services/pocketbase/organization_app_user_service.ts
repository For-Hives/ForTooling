import { BaseService } from '@/app/actions/services/pocketbase/api_client'
import {
	Collections,
	OrganizationAppUser,
	OrganizationAppUserCreateInput,
	OrganizationAppUserUpdateInput,
	organizationAppUserCreateSchema,
	organizationAppUserSchema,
	organizationAppUserUpdateSchema,
} from '@/models/pocketbase'

// Re-export types for convenience
export type {
	OrganizationAppUser,
	OrganizationAppUserCreateInput,
	OrganizationAppUserUpdateInput,
}

/**
 * Service for OrganizationAppUser-related operations
 */
export class OrganizationAppUserService extends BaseService<
	OrganizationAppUser,
	OrganizationAppUserCreateInput,
	OrganizationAppUserUpdateInput
> {
	constructor() {
		super(
			Collections.ORGANIZATION_APP_USERS,
			// @ts-expect-error - Types are compatible but TypeScript cannot verify it [ :) ]
			organizationAppUserSchema,
			organizationAppUserCreateSchema,
			organizationAppUserUpdateSchema
		)
	}

	/**
	 * Find organization-user mappings by user ID
	 *
	 * @param appUserId - The AppUser ID
	 * @returns The organization-user mappings or empty array if not found
	 */
	async findByAppUserId(appUserId: string): Promise<OrganizationAppUser[]> {
		try {
			const result = await this.getList({
				filter: `appUser = "${appUserId}"`,
			})

			return result.items
		} catch (error) {
			console.error(
				'Error finding organization-user mappings by appUserId:',
				error
			)
			return []
		}
	}

	/**
	 * Find organization-user mappings by organization ID
	 *
	 * @param organizationId - The Organization ID
	 * @returns The organization-user mappings or empty array if not found
	 */
	async findByOrganizationId(
		organizationId: string
	): Promise<OrganizationAppUser[]> {
		try {
			const result = await this.getList({
				filter: `organization = "${organizationId}"`,
			})

			return result.items
		} catch (error) {
			console.error(
				'Error finding organization-user mappings by organizationId:',
				error
			)
			return []
		}
	}

	/**
	 * Find a specific organization-user mapping
	 *
	 * @param appUserId - The AppUser ID
	 * @param organizationId - The Organization ID
	 * @returns The organization-user mapping or null if not found
	 */
	async findByAppUserAndOrganization(
		appUserId: string,
		organizationId: string
	): Promise<OrganizationAppUser | null> {
		try {
			const result = await this.getList({
				filter: `appUser = "${appUserId}" && organization = "${organizationId}"`,
			})

			return result.items.length > 0 ? result.items[0] : null
		} catch (error) {
			console.error('Error finding organization-user mapping:', error)
			return null
		}
	}

	/**
	 * Check if a specific organization-user mapping exists
	 *
	 * @param appUserId - The AppUser ID
	 * @param organizationId - The Organization ID
	 * @returns True if the mapping exists
	 */
	async exists(appUserId: string, organizationId: string): Promise<boolean> {
		try {
			const count = await this.getCount(
				`appUser = "${appUserId}" && organization = "${organizationId}"`
			)
			return count > 0
		} catch (error) {
			console.error(
				'Error checking if organization-user mapping exists:',
				error
			)
			return false
		}
	}

	/**
	 * Create or update an organization-user mapping
	 *
	 * @param appUserId - The AppUser ID
	 * @param organizationId - The Organization ID
	 * @param role - The user's role in the organization
	 * @returns The created or updated mapping
	 */
	async createOrUpdate(
		appUserId: string,
		organizationId: string,
		role: string = 'member'
	): Promise<OrganizationAppUser> {
		try {
			const existing = await this.findByAppUserAndOrganization(
				appUserId,
				organizationId
			)

			if (existing) {
				console.info(
					`Updating existing organization mapping for user ${appUserId} in org ${organizationId}`
				)
				return this.update(existing.id, { role }, { validateOutput: false })
			}

			console.info(
				`Creating new organization mapping for user ${appUserId} in org ${organizationId}`
			)
			return this.create(
				{
					appUser: appUserId,
					organization: organizationId,
					role,
				},
				{ validateOutput: false }
			)
		} catch (error) {
			// If we get a "record already exists" error, try to find it and update it
			if (
				error instanceof Error &&
				error.message.includes('unique constraint')
			) {
				console.warn(
					`Unique constraint error for user ${appUserId} in org ${organizationId}. Retrying...`
				)
				// Wait a moment for eventual consistency
				await new Promise(resolve => setTimeout(resolve, 500))

				// Try to find the existing record again
				const retryExisting = await this.findByAppUserAndOrganization(
					appUserId,
					organizationId
				)

				if (retryExisting) {
					console.info(
						`Found existing mapping on retry for user ${appUserId} in org ${organizationId}`
					)
					return this.update(
						retryExisting.id,
						{ role },
						{ validateOutput: false }
					)
				}
			}

			console.error('Error creating/updating organization-user mapping:', error)
			throw error
		}
	}

	/**
	 * Delete an organization-user mapping
	 *
	 * @param appUserId - The AppUser ID
	 * @param organizationId - The Organization ID
	 * @returns True if the mapping was deleted
	 */
	async deleteMapping(
		appUserId: string,
		organizationId: string
	): Promise<boolean> {
		try {
			const mapping = await this.findByAppUserAndOrganization(
				appUserId,
				organizationId
			)

			if (mapping) {
				await this.delete(mapping.id)
				return true
			}

			return false
		} catch (error) {
			console.error('Error deleting organization-user mapping:', error)
			return false
		}
	}

	/**
	 * Get all user roles for an organization
	 *
	 * @param organizationId - The Organization ID
	 * @returns A map of user IDs to roles
	 */
	async getUserRolesForOrganization(
		organizationId: string
	): Promise<Map<string, string>> {
		const mappings = await this.findByOrganizationId(organizationId)
		const userRoles = new Map<string, string>()

		for (const mapping of mappings) {
			userRoles.set(mapping.appUser, mapping.role)
		}

		return userRoles
	}

	/**
	 * Get all organization roles for a user
	 *
	 * @param appUserId - The AppUser ID
	 * @returns A map of organization IDs to roles
	 */
	async getOrganizationRolesForUser(
		appUserId: string
	): Promise<Map<string, string>> {
		const mappings = await this.findByAppUserId(appUserId)
		const orgRoles = new Map<string, string>()

		for (const mapping of mappings) {
			orgRoles.set(mapping.organization, mapping.role)
		}

		return orgRoles
	}
}

// Singleton instance
let organizationAppUserServiceInstance: OrganizationAppUserService | null = null

/**
 * Get the OrganizationAppUserService instance
 *
 * @returns The OrganizationAppUserService instance
 */
export function getOrganizationAppUserService(): OrganizationAppUserService {
	if (!organizationAppUserServiceInstance) {
		organizationAppUserServiceInstance = new OrganizationAppUserService()
	}
	return organizationAppUserServiceInstance
}

/**
 * Create or update an organization-user mapping
 *
 * @param appUserId - The AppUser ID
 * @param organizationId - The Organization ID
 * @param role - The user's role in the organization
 * @returns The created or updated mapping
 */
export async function createOrUpdateOrganizationUserMapping(
	appUserId: string,
	organizationId: string,
	role: string = 'member'
): Promise<OrganizationAppUser> {
	return getOrganizationAppUserService().createOrUpdate(
		appUserId,
		organizationId,
		role
	)
}

/**
 * Get all user roles for an organization
 *
 * @param organizationId - The Organization ID
 * @returns A map of user IDs to roles
 */
export async function getUserRolesForOrganization(
	organizationId: string
): Promise<Map<string, string>> {
	return getOrganizationAppUserService().getUserRolesForOrganization(
		organizationId
	)
}

/**
 * Get all organization roles for a user
 *
 * @param appUserId - The AppUser ID
 * @returns A map of organization IDs to roles
 */
export async function getOrganizationRolesForUser(
	appUserId: string
): Promise<Map<string, string>> {
	return getOrganizationAppUserService().getOrganizationRolesForUser(appUserId)
}
