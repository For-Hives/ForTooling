'use server'

import {
	getPocketBase,
	handlePocketBaseError,
} from '@/app/actions/services/pocketbase/baseService'
import {
	validateCurrentUser,
	validateOrganizationAccess,
	validateResourceAccess,
	SecurityError,
	ResourceType,
	PermissionLevel,
} from '@/app/actions/services/pocketbase/securityUtils'
import {
	_updateUser,
	_createUser,
	_deleteUser,
} from '@/app/actions/services/pocketbase/user/internal'
import { User } from '@/types/types_pocketbase'

/**
 * Core user operations with security validations
 */

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
	>,
	elevated = false
): Promise<User> {
	try {
		if (!elevated) {
			// Security check - requires ADMIN permission to create users
			await validateOrganizationAccess(organizationId, PermissionLevel.ADMIN)
		}

		// Ensure organization ID is set correctly with the proper field name
		return await _createUser({
			...data,
			organizations: [organizationId], // Force the correct organization ID using the relation field
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
	>,
	elevated = false
): Promise<User> {
	try {
		if (!elevated) {
			// Get current authenticated user
			const currentUser = await validateCurrentUser()

			// Different permission checks based on who is being updated
			if (id !== currentUser.id) {
				// Updating someone else requires ADMIN permission
				await validateResourceAccess(
					ResourceType.USER,
					id,
					PermissionLevel.ADMIN
				)
			} else {
				// Users can update their own basic info
				// But for role changes, they'd still need admin rights
				if (data.role || data.isAdmin !== undefined) {
					// If trying to change role or admin status, require admin permission
					// Get the user's organization ID - handling possible multiple organizations
					const userOrgs = currentUser.expand?.organizations

					if (!userOrgs || !Array.isArray(userOrgs) || userOrgs.length === 0) {
						throw new SecurityError('User does not belong to any organization')
					}

					// Use the first organization for permission check
					const primaryOrgId = userOrgs[0].id
					await validateOrganizationAccess(primaryOrgId, PermissionLevel.ADMIN)
				}
			}
		}

		// Security: never allow changing certain fields
		const sanitizedData = { ...data }
		// Don't allow org changes directly - use proper organization management functions
		delete (sanitizedData as Record<string, unknown>).organizations

		if (!elevated) {
			// Only elevated calls (webhooks) can change the clerkId
			delete sanitizedData.clerkId
		}

		return await _updateUser(id, sanitizedData)
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
export async function deleteUser(
	id: string,
	elevated = false
): Promise<boolean> {
	try {
		if (!elevated) {
			// Security check - requires ADMIN permission for user deletion
			await validateResourceAccess(ResourceType.USER, id, PermissionLevel.ADMIN)
		}

		return await _deleteUser(id)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'UserService.deleteUser')
	}
}
