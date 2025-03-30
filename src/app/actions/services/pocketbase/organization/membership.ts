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
import { AppUser } from '@/types/types_pocketbase'

/**
 * Membership management functions for organizations
 */

/**
 * Internal: Add user to organization without security checks
 * @param userId User ID
 * @param organizationId Organization ID
 */
export async function _addUserToOrganization(
	userId: string,
	organizationId: string
): Promise<AppUser> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Get the user
		const user = await pb.collection('users').getOne(userId, {
			expand: 'organizations',
		})

		// Get current organizations
		let currentOrgs = user.organizations || []
		if (typeof currentOrgs === 'string') {
			currentOrgs = [currentOrgs]
		}

		// Check if user is already in organization
		if (!currentOrgs.includes(organizationId)) {
			// Add organization to user's organizations list
			currentOrgs.push(organizationId)
		}

		// Update user with new organizations list
		return await pb.collection('users').update(userId, {
			organizations: currentOrgs,
		})
	} catch (error) {
		return handlePocketBaseError(
			error,
			'OrganizationService._addUserToOrganization'
		)
	}
}

/**
 * Internal: Remove user from organization without security checks
 * @param userId User ID
 * @param organizationId Organization ID
 */
export async function _removeUserFromOrganization(
	userId: string,
	organizationId: string
): Promise<AppUser> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Get the user
		const user = await pb.collection('users').getOne(userId, {
			expand: 'organizations',
		})

		// Get current organizations
		let currentOrgs = user.organizations || []
		if (typeof currentOrgs === 'string') {
			currentOrgs = [currentOrgs]
		}

		// Remove organization from user's organizations list
		const updatedOrgs = currentOrgs.filter(orgId => orgId !== organizationId)

		// Update user with new organizations list
		return await pb.collection('users').update(userId, {
			organizations: updatedOrgs,
		})
	} catch (error) {
		return handlePocketBaseError(
			error,
			'OrganizationService._removeUserFromOrganization'
		)
	}
}

/**
 * Add a user to an organization
 */
export async function addUserToOrganization(
	userId: string,
	organizationId: string,
	elevated = false
): Promise<AppUser> {
	try {
		if (!elevated) {
			// Security check - requires ADMIN permission for member management
			await validateOrganizationAccess(organizationId, PermissionLevel.ADMIN)
		}

		return await _addUserToOrganization(userId, organizationId)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(
			error,
			'OrganizationService.addUserToOrganization'
		)
	}
}

/**
 * Remove a user from an organization
 */
export async function removeUserFromOrganization(
	userId: string,
	organizationId: string,
	elevated = false
): Promise<AppUser> {
	try {
		if (!elevated) {
			// Security check - requires ADMIN permission for member management
			await validateOrganizationAccess(organizationId, PermissionLevel.ADMIN)
		}

		return await _removeUserFromOrganization(userId, organizationId)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(
			error,
			'OrganizationService.removeUserFromOrganization'
		)
	}
}

/**
 * Get all users in an organization
 */
export async function getOrganizationUsers(
	organizationId: string
): Promise<AppUser[]> {
	try {
		// Security check - validates user has access to this organization
		await validateOrganizationAccess(organizationId, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Query users with this organization in their organizations list
		const result = await pb.collection('users').getList(1, 100, {
			filter: `organizations ~ "${organizationId}"`,
		})

		return result.items
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(
			error,
			'OrganizationService.getOrganizationUsers'
		)
	}
}
