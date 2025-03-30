'use server'

import {
	getPocketBase,
	handlePocketBaseError,
} from '@/app/actions/services/pocketbase/baseService'
import { User } from '@/types/types_pocketbase'

/**
 * Internal methods for user management
 * These methods have no security checks and should only be called
 * from secured public API methods
 */

/**
 * Internal: Update user without security checks
 * @param id User ID
 * @param data User data
 */
export async function _updateUser(
	id: string,
	data: Partial<User>
): Promise<User> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		return await pb.collection('users').update(id, data)
	} catch (error) {
		return handlePocketBaseError(error, 'UserService._updateUser')
	}
}

/**
 * Internal: Create user without security checks
 * @param data User data
 */
export async function _createUser(data: Partial<User>): Promise<User> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		return await pb.collection('users').create(data)
	} catch (error) {
		return handlePocketBaseError(error, 'UserService._createUser')
	}
}

/**
 * Internal: Delete user without security checks
 * @param id User ID
 */
export async function _deleteUser(id: string): Promise<boolean> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		await pb.collection('users').delete(id)
		return true
	} catch (error) {
		handlePocketBaseError(error, 'UserService._deleteUser')
		return false
	}
}

/**
 * Get a user by Clerk ID
 * @param clerkId Clerk user ID
 * @returns User record or null if not found
 */
export async function getByClerkId(clerkId: string): Promise<User | null> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		const user = await pb
			.collection('users')
			.getFirstListItem(`clerkId="${clerkId}"`)
		return user
	} catch (error) {
		// If user not found, return null instead of throwing
		if (error instanceof Error && error.message.includes('404')) {
			return null
		}
		console.error('Error fetching user by clerk ID:', error)
		return null
	}
}
