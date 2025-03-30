'use server'

import {
	getPocketBase,
	handlePocketBaseError,
} from '@/app/actions/services/pocketbase/baseService'
import { Organization, User } from '@/types/types_pocketbase'

/**
 * Internal methods for organization management
 * These methods have no security checks and should only be called
 * from secured public API methods
 */

/**
 * Internal: Create organization without security checks
 * @param data Organization data
 */
export async function _createOrganization(
	data: Partial<Organization>
): Promise<Organization> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		return await pb.collection('organizations').create(data)
	} catch (error) {
		return handlePocketBaseError(
			error,
			'OrganizationService._createOrganization'
		)
	}
}

/**
 * Internal: Update organization without security checks
 * @param id Organization ID
 * @param data Updated organization data
 */
export async function _updateOrganization(
	id: string,
	data: Partial<Organization>
): Promise<Organization> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		return await pb.collection('organizations').update(id, data)
	} catch (error) {
		return handlePocketBaseError(
			error,
			'OrganizationService._updateOrganization'
		)
	}
}

/**
 * Internal: Delete organization without security checks
 * @param id Organization ID
 */
export async function _deleteOrganization(id: string): Promise<boolean> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		await pb.collection('organizations').delete(id)
		return true
	} catch (error) {
		handlePocketBaseError(error, 'OrganizationService._deleteOrganization')
		return false
	}
}

/**
 * Gets an organization by Clerk ID
 * @param {string} clerkId - Clerk organization ID
 * @returns {Promise<Organization | null>} Organization record or null if not found
 */
export async function getByClerkId(
	clerkId: string
): Promise<Organization | null> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		const organization = await pb
			.collection('organizations')
			.getFirstListItem(`clerkId=${clerkId}`)
		return organization as Organization
	} catch (error) {
		// If organization not found, return null instead of throwing
		if (error instanceof Error && error.message.includes('404')) {
			return null
		}
		console.error('Error fetching organization by clerk ID:', error)
		return null
	}
}
