'use server'

import {
	getPocketBase,
	handlePocketBaseError,
} from '@/app/actions/services/pocketbase/baseService'
import {
	validateOrganizationAccess,
	createOrganizationFilter,
	PermissionLevel,
	SecurityError,
} from '@/app/actions/services/pocketbase/securityUtils'
import { ListOptions, ListResult, User } from '@/types/types_pocketbase'

/**
 * Search and listing functions for users
 */

/**
 * Get users list with pagination and security checks
 */
export async function getUsersList(
	organizationId: string,
	options: ListOptions = {}
): Promise<ListResult<User>> {
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
		const filter = createOrganizationFilter(organizationId, additionalFilter)

		return await pb.collection('users').getList(page, perPage, {
			...rest,
			filter,
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'UserService.getUsersList')
	}
}

/**
 * Get all users for an organization with security checks
 */
export async function getUsersByOrganization(
	organizationId: string
): Promise<User[]> {
	try {
		// Security check
		await validateOrganizationAccess(organizationId, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Query users with this organization in their organizations relation
		return await pb.collection('users').getFullList({
			filter: `organizations ~ "${organizationId}"`,
			sort: 'name',
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'UserService.getUsersByOrganization')
	}
}

/**
 * Get the count of users in an organization
 */
export async function getUserCount(organizationId: string): Promise<number> {
	try {
		// Security check
		await validateOrganizationAccess(organizationId, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Query users with this organization in their organizations relation
		const result = await pb.collection('users').getList(1, 1, {
			filter: `organizations ~ "${organizationId}"`,
			skipTotal: false,
		})

		return result.totalItems
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'UserService.getUserCount')
	}
}

/**
 * Search for users in the organization
 */
export async function searchUsers(
	organizationId: string,
	query: string
): Promise<User[]> {
	try {
		// Security check
		await validateOrganizationAccess(organizationId, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Query users with search conditions
		return await pb.collection('users').getFullList({
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
		return handlePocketBaseError(error, 'UserService.searchUsers')
	}
}
