'use server'

import {
	getPocketBase,
	handlePocketBaseError,
} from '@/app/actions/services/pocketbase/baseService'
import {
	validateCurrentUser,
	validateOrganizationAccess,
	validateResourceAccess,
	createOrganizationFilter,
	ResourceType,
	PermissionLevel,
	SecurityError,
} from '@/app/actions/services/pocketbase/securityUtils'
import { ListOptions, ListResult, User } from '@/types/types_pocketbase'

/**
 * Get a single user by ID with security validation
 */
export async function getUser(id: string): Promise<User> {
	try {
		// Security check - validates user has access to this resource
		await validateResourceAccess(ResourceType.USER, id, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		return await pb.collection('users').getOne(id)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error // Re-throw security errors
		}
		return handlePocketBaseError(error, 'UserService.getUser')
	}
}

/**
 * Get current authenticated user profile
 */
export async function getCurrentUser(): Promise<User> {
	try {
		// This function automatically validates the current user
		return await validateCurrentUser()
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'UserService.getCurrentUser')
	}
}

/**
 * Get a user by Clerk ID - typically used during authentication
 */
export async function getUserByClerkId(clerkId: string): Promise<User> {
	// This is primarily used during authentication flows where
	// standard security checks aren't possible yet.
	// However, requests should still come from server-side code only.
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('users').getFirstListItem(`clerkId="${clerkId}"`)
	} catch (error) {
		return handlePocketBaseError(error, 'UserService.getUserByClerkId')
	}
}

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

		// Apply organization filter with the correct field name
		// Since users can belong to multiple organizations, we need to check expand.organizationId
		return await pb.collection('users').getFullList({
			filter: `organizationId.organizationId="${organizationId}"`,
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
 * Create a new user with security checks
 * This is typically controlled access for admins only
 */
export async function createUser(
	organizationId: string,
	data: Pick<
		Partial<User>,
		| 'name'
		| 'email'
		| 'emailVisibility'
		| 'verified'
		| 'avatar'
		| 'phone'
		| 'role'
		| 'isAdmin'
		| 'canLogin'
		| 'clerkId'
	>
): Promise<User> {
	try {
		// Security check - requires ADMIN permission to create users
		await validateOrganizationAccess(organizationId, PermissionLevel.ADMIN)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Ensure organization ID is set correctly with the proper field name
		return await pb.collection('users').create({
			...data,
			organizationId, // Force the correct organization ID
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'UserService.createUser')
	}
}

/**
 * Update a user with security checks
 */
export async function updateUser(
	id: string,
	data: Pick<
		Partial<User>,
		| 'name'
		| 'email'
		| 'emailVisibility'
		| 'verified'
		| 'avatar'
		| 'phone'
		| 'role'
		| 'isAdmin'
		| 'canLogin'
		| 'lastLogin'
		| 'clerkId'
	>
): Promise<User> {
	try {
		// Get current authenticated user
		const currentUser = await validateCurrentUser()

		// Different permission checks based on who is being updated
		if (id !== currentUser.id) {
			// Updating someone else requires ADMIN permission
			await validateResourceAccess(ResourceType.USER, id, PermissionLevel.ADMIN)
		} else {
			// Users can update their own basic info
			// But for role changes, they'd still need admin rights
			if (data.role || data.isAdmin !== undefined) {
				// If trying to change role or admin status, require admin permission
				// Get the user's organization ID - handling possible multiple organizations
				const userOrgs = currentUser.expand?.organizationId

				if (!userOrgs || !Array.isArray(userOrgs) || userOrgs.length === 0) {
					throw new SecurityError('User does not belong to any organization')
				}

				// Use the first organization for permission check
				const primaryOrgId = userOrgs[0].id
				await validateOrganizationAccess(primaryOrgId, PermissionLevel.ADMIN)
			}
		}

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Security: never allow changing certain fields
		const sanitizedData = { ...data }
		// Don't allow org changes or clerk ID changes - use proper type assertion
		delete (sanitizedData as Record<string, unknown>).organizationId
		if (sanitizedData['clerkId']) {
			delete sanitizedData.clerkId
		}

		return await pb.collection('users').update(id, sanitizedData)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'UserService.updateUser')
	}
}

/**
 * Delete a user with admin permission check
 */
export async function deleteUser(id: string): Promise<boolean> {
	try {
		// Security check - requires ADMIN permission for user deletion
		await validateResourceAccess(ResourceType.USER, id, PermissionLevel.ADMIN)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		await pb.collection('users').delete(id)
		return true
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'UserService.deleteUser')
	}
}

/**
 * Update user's last login time
 * This is typically called during authentication flows
 */
export async function updateUserLastLogin(id: string): Promise<User> {
	try {
		// Since this is called during authentication,
		// we'll just verify the user exists rather than permissions
		const user = await validateCurrentUser(id)

		if (!user) {
			throw new SecurityError('User not found')
		}

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		return await pb.collection('users').update(id, {
			lastLogin: new Date().toISOString(),
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'UserService.updateUserLastLogin')
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

		// Fixed field name in the filter
		const result = await pb.collection('users').getList(1, 1, {
			filter: `organizationId.organizationId=${organizationId}`,
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

		// Fixed field name in the filter and handle multi-organization relationship
		return await pb.collection('users').getFullList({
			filter: pb.filter(
				'organizationId.organizationId = {:orgId} && (name ~ {:query} || email ~ {:query})',
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
