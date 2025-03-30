'use server'

import {
	getPocketBase,
	handlePocketBaseError,
} from '@/app/actions/services/pocketbase/baseService'
import {
	validateCurrentUser,
	SecurityError,
} from '@/app/actions/services/pocketbase/securityUtils'
import { User } from '@/types/types_pocketbase'

/**
 * Authentication-related functions for users
 */

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
