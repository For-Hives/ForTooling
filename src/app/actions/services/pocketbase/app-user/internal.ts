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

		console.log('Creating new AppUser with data:', data)

		// Make sure clerkId is included
		if (!data.clerkId) {
			throw new Error('clerkId is required when creating a new AppUser')
		}

		const newUser = await pb.collection('AppUser').create(data)
		console.log('New AppUser created:', newUser)

		return newUser
	} catch (error) {
		console.error('Error creating app user:', error)
		throw error
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
		console.error('Error deleting app user:', error)
		throw error
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

		console.log(`Searching for AppUser with clerkId: ${clerkId}`)

		// Try to find the user
		try {
			const user = await pb
				.collection('AppUser')
				.getFirstListItem(`clerkId="${clerkId}"`)

			console.log('User found:', user)
			return user
		} catch (error) {
			// Check if this is a "not found" error
			if (
				error instanceof Error &&
				(error.message.includes('404') || error.message.includes('not found'))
			) {
				console.log(`No user found with clerkId: ${clerkId}`)
				return null
			}
			// Otherwise rethrow the error
			throw error
		}
	} catch (error) {
		console.error('Error fetching app user by clerk ID:', error)
		return null
	}
}
