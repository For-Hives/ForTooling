'use server'

import { handlePocketBaseError } from '@/app/actions/services/pocketbase/baseService'
import {
	validateCurrentUser,
	SecurityError,
} from '@/app/actions/services/pocketbase/securityUtils'

import { getUserOrganizations } from './core'

/**
 * Organization-specific security functions
 */

/**
 * Check if current user is organization admin for a specific organization
 */
export async function isCurrentUserOrgAdmin(
	organizationId: string
): Promise<boolean> {
	try {
		// Get current user
		const user = await validateCurrentUser()

		// Check if user has admin role
		const isAdmin = user.isAdmin || user.role === 'admin'

		if (!isAdmin) {
			return false
		}

		// Verify they belong to this organization
		const userOrgs = await getUserOrganizations()
		const belongsToOrg = userOrgs.some(org => org.id === organizationId)

		return isAdmin && belongsToOrg
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return false
	}
}
