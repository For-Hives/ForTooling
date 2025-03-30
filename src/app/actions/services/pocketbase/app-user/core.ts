'use server'

import {
	_updateAppUser,
	_createAppUser,
	_deleteAppUser,
} from '@/app/actions/services/pocketbase/app-user/internal'
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
import { AppUser } from '@/types/types_pocketbase'

/**
 * Core AppUser operations with security validations
 */

/**
 * Get a single AppUser by ID with security validation
 */
export async function getAppUser(id: string): Promise<AppUser> {
	try {
		// Security check - validates user has access to this resource
		await validateResourceAccess(ResourceType.USER, id, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		return await pb.collection('app_users').getOne(id)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error // Re-throw security errors
		}
		return handlePocketBaseError(error, 'AppUserService.getAppUser')
	}
}

/**
 * Get current authenticated AppUser profile
 */
export async function getCurrentAppUser(): Promise<AppUser> {
	try {
		// This function needs to be adjusted to work with Clerk auth
		// and the custom app_users collection
		const currentUser = await validateCurrentUser()

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Find the app_user record with the matching clerk ID
		return await pb
			.collection('AppUser')
			.getFirstListItem(`clerkId="${currentUser.clerkId}"`)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'AppUserService.getCurrentAppUser')
	}
}

/**
 * Get an AppUser by Clerk ID - typically used during authentication
 */
export async function getAppUserByClerkId(clerkId: string): Promise<AppUser> {
	// This is primarily used during authentication flows where
	// standard security checks aren't possible yet.
	// However, requests should still come from server-side code only.
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb
			.collection('AppUser')
			.getFirstListItem(`clerkId="${clerkId}"`)
	} catch (error) {
		return handlePocketBaseError(error, 'AppUserService.getAppUserByClerkId')
	}
}

/**
 * Create a new AppUser with security checks
 * This is typically controlled access for admins only
 */
export async function createAppUser(
	organizationId: string,
	data: Partial<AppUser>,
	elevated = false
): Promise<AppUser> {
	try {
		if (!elevated) {
			// Security check - requires ADMIN permission to create users
			await validateOrganizationAccess(organizationId, PermissionLevel.ADMIN)
		}

		// Ensure organization ID is set correctly with the proper field name
		return await _createAppUser({
			...data,
			organizations: organizationId ? [organizationId] : [], // Force the correct organization ID using the relation field
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'AppUserService.createAppUser')
	}
}

/**
 * Update an AppUser with security checks
 */
export async function updateAppUser(
	id: string,
	data: Partial<AppUser>,
	elevated = false
): Promise<AppUser> {
	try {
		if (!elevated) {
			// Get current authenticated user
			const currentUser = await validateCurrentUser()
			const currentAppUser = await getAppUserByClerkId(currentUser.clerkId)

			// Different permission checks based on who is being updated
			if (id !== currentAppUser.id) {
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
					const userOrgs = currentAppUser.expand?.organizations

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

		return await _updateAppUser(id, sanitizedData)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'AppUserService.updateAppUser')
	}
}

/**
 * Delete an AppUser with admin permission check
 */
export async function deleteAppUser(
	id: string,
	elevated = false
): Promise<boolean> {
	try {
		if (!elevated) {
			// Security check - requires ADMIN permission for user deletion
			await validateResourceAccess(ResourceType.USER, id, PermissionLevel.ADMIN)
		}

		return await _deleteAppUser(id)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'AppUserService.deleteAppUser')
	}
}
