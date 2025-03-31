import { BaseService } from '@/app/actions/services/pocketbase/api_client'
import {
	Collections,
	Organization,
	OrganizationCreateInput,
	OrganizationUpdateInput,
	organizationCreateSchema,
	organizationSchema,
	organizationUpdateSchema,
} from '@/models/pocketbase'

// Re-export types for convenience
export type { Organization, OrganizationCreateInput, OrganizationUpdateInput }

/**
 * Service for Organization-related operations
 */
export class OrganizationService extends BaseService<
	Organization,
	OrganizationCreateInput,
	OrganizationUpdateInput
> {
	constructor() {
		super(
			Collections.ORGANIZATIONS,
			// @ts-expect-error - Types are compatible but TypeScript cannot verify it [ :) ]
			organizationSchema,
			organizationCreateSchema,
			organizationUpdateSchema
		)
	}

	/**
	 * Find an organization by Clerk ID
	 *
	 * @param clerkId - The Clerk organization ID
	 * @returns The organization or null if not found
	 */
	async findByClerkId(clerkId: string): Promise<Organization | null> {
		try {
			const result = await this.getList({
				filter: `clerkId = "${clerkId}"`,
			})

			return result.items.length > 0 ? result.items[0] : null
		} catch (error) {
			console.error('Error finding organization by clerkId:', error)
			return null
		}
	}

	/**
	 * Check if an organization with the given Clerk ID exists
	 *
	 * @param clerkId - The Clerk organization ID
	 * @returns True if the organization exists
	 */
	async existsByClerkId(clerkId: string): Promise<boolean> {
		try {
			const count = await this.getCount(`clerkId = "${clerkId}"`)
			return count > 0
		} catch (error) {
			console.error('Error checking if organization exists by clerkId:', error)
			return false
		}
	}

	/**
	 * Create or update an organization by Clerk ID
	 *
	 * @param clerkId - The Clerk organization ID
	 * @param data - The organization data
	 * @returns The created or updated organization
	 */
	async createOrUpdateByClerkId(
		clerkId: string,
		data: Omit<OrganizationCreateInput, 'clerkId'>
	): Promise<Organization> {
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
}

// Singleton instance
let organizationServiceInstance: OrganizationService | null = null

/**
 * Get the OrganizationService instance
 *
 * @returns The OrganizationService instance
 */
export function getOrganizationService(): OrganizationService {
	if (!organizationServiceInstance) {
		organizationServiceInstance = new OrganizationService()
	}
	return organizationServiceInstance
}

/**
 * Find an organization by Clerk ID
 *
 * @param clerkId - The Clerk organization ID
 * @returns The organization or null if not found
 */
export async function findOrganizationByClerkId(
	clerkId: string
): Promise<Organization | null> {
	return getOrganizationService().findByClerkId(clerkId)
}

/**
 * Create or update an organization by Clerk ID
 *
 * @param clerkId - The Clerk organization ID
 * @param data - The organization data
 * @returns The created or updated organization
 */
export async function createOrUpdateOrganizationByClerkId(
	clerkId: string,
	data: Omit<OrganizationCreateInput, 'clerkId'>
): Promise<Organization> {
	return getOrganizationService().createOrUpdateByClerkId(clerkId, data)
}
