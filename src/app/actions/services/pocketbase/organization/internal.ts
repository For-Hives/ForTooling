'use server'

import {
	getPocketBase,
	handlePocketBaseError,
} from '@/app/actions/services/pocketbase/baseService'
import { Organization } from '@/types/types_pocketbase'

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

		console.log('Creating new Organization with data:', data)

		// Make sure clerkId is included
		if (!data.clerkId) {
			throw new Error('clerkId is required when creating a new Organization')
		}

		const newOrg = await pb.collection('Organization').create(data)
		console.log('New Organization created:', newOrg)

		return newOrg
	} catch (error) {
		console.error('Error creating organization:', error)
		throw error
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

		console.log(`Updating Organization ${id} with data:`, data)

		const updatedOrg = await pb.collection('Organization').update(id, data)
		console.log('Organization updated:', updatedOrg)

		return updatedOrg
	} catch (error) {
		console.error('Error updating organization:', error)
		throw error
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
export async function getOrganizationByClerkId(
	clerkId: string
): Promise<Organization | null> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		console.log(`Searching for Organization with clerkId: ${clerkId}`)

		try {
			const org = await pb
				.collection('Organization')
				.getFirstListItem(`clerkId="${clerkId}"`)

			console.log('Organization found:', org)
			return org
		} catch (error) {
			// Check if this is a "not found" error
			if (
				error instanceof Error &&
				(error.message.includes('404') || error.message.includes('not found'))
			) {
				console.log(`No organization found with clerkId: ${clerkId}`)
				return null
			}
			// Otherwise rethrow the error
			throw error
		}
	} catch (error) {
		console.error('Error fetching organization by clerk ID:', error)
		return null
	}
}
