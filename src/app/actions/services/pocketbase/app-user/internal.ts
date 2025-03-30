'use server'

import {
	getPocketBase,
	handlePocketBaseError,
} from '@/app/actions/services/pocketbase/baseService'
import { AppUser } from '@/types/types_pocketbase'

/**
 * Internal methods for AppUser management
 * These methods have no security checks and should only be called
 * from secured public API methods
 */

/**
 * Internal: Update AppUser without security checks
 * @param id AppUser ID
 * @param data AppUser data
 */
export async function _updateAppUser(
	id: string,
	data: Partial<AppUser>
): Promise<AppUser> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		return await pb.collection('AppUser').update(id, data)
	} catch (error) {
		return handlePocketBaseError(error, 'AppUserService._updateAppUser')
	}
}

/**
 * Internal: Create AppUser without security checks
 * @param data AppUser data
 */
export async function _createAppUser(data: Partial<AppUser>): Promise<AppUser> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		return await pb.collection('AppUser').create(data)
	} catch (error) {
		return handlePocketBaseError(error, 'AppUserService._createAppUser')
	}
}

/**
 * Internal: Delete AppUser without security checks
 * @param id AppUser ID
 */
export async function _deleteAppUser(id: string): Promise<boolean> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		await pb.collection('AppUser').delete(id)
		return true
	} catch (error) {
		handlePocketBaseError(error, 'AppUserService._deleteAppUser')
		return false
	}
}

/**
 * Get an AppUser by Clerk ID
 * @param clerkId Clerk user ID
 * @returns AppUser record or null if not found
 */
export async function getByClerkId(clerkId: string): Promise<AppUser | null> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		const user = await pb
			.collection('AppUser')
			.getFirstListItem(`clerkId="${clerkId}"`)
		return user
	} catch (error) {
		// If user not found, return null instead of throwing
		if (error instanceof Error && error.message.includes('404')) {
			return null
		}
		console.error('Error fetching app user by clerk ID:', error)
		return null
	}
}
