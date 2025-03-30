'use server'

import {
	getPocketBase,
	handlePocketBaseError,
} from '@/app/actions/services/pocketbase/baseService'
import {
	validateOrganizationAccess,
	PermissionLevel,
	SecurityError,
} from '@/app/actions/services/pocketbase/securityUtils'
import { ListOptions, ListResult, AppUser } from '@/types/types_pocketbase'

/**
 * Search and listing functions for AppUsers
 */

/**
 * Get AppUsers list with pagination and security checks
 */
export async function getAppUsersList(
	organizationId: string,
	options: ListOptions = {}
): Promise<ListResult<AppUser>> {
	try {
		// Security check - needs at least READ permission
		await validateOrganizationAccess(organizationId, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		const {
			filter: additionalFilter,
			page = 1,
			perPage = 30,
			...rest
		} = options

		// Apply organization filter to ensure data isolation
		const filter = `organizations ~ "${organizationId}"${additionalFilter ? ` && (${additionalFilter})` : ''}`

		return await pb.collection('app_users').getList(page, perPage, {
			...rest,
			filter,
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'AppUserService.getAppUsersList')
	}
}

/**
 * Get all AppUsers for an organization with security checks
 */
export async function getAppUsersByOrganization(
	organizationId: string
): Promise<AppUser[]> {
	try {
		// Security check
		await validateOrganizationAccess(organizationId, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Query users with this organization in their organizations relation
		return await pb.collection('app_users').getFullList({
			filter: `organizations ~ "${organizationId}"`,
			sort: 'name',
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(
			error,
			'AppUserService.getAppUsersByOrganization'
		)
	}
}

/**
 * Get the count of AppUsers in an organization
 */
export async function getAppUserCount(organizationId: string): Promise<number> {
	try {
		// Security check
		await validateOrganizationAccess(organizationId, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Query users with this organization in their organizations relation
		const result = await pb.collection('app_users').getList(1, 1, {
			filter: `organizations ~ "${organizationId}"`,
			skipTotal: false,
		})

		return result.totalItems
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'AppUserService.getAppUserCount')
	}
}

/**
 * Search for AppUsers in the organization
 */
export async function searchAppUsers(
	organizationId: string,
	query: string
): Promise<AppUser[]> {
	try {
		// Security check
		await validateOrganizationAccess(organizationId, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Query users with search conditions
		return await pb.collection('app_users').getFullList({
			filter: pb.filter(
				'organizations ~ {:orgId} && (name ~ {:query} || email ~ {:query})',
				{
					orgId: organizationId,
					query,
				}
			),
			sort: 'name',
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'AppUserService.searchAppUsers')
	}
}
