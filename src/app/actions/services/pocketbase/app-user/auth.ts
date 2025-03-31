'use server'

import { getAppUserByClerkId } from '@/app/actions/services/pocketbase/app-user/core'
import {
	getPocketBase,
	handlePocketBaseError,
} from '@/app/actions/services/pocketbase/baseService'
import { SecurityError } from '@/app/actions/services/securyUtilsTools'
import { AppUser } from '@/types/types_pocketbase'

/**
 * Authentication-related functions for AppUsers
 */

/**
 * Update AppUser's last login time
 * This is typically called during authentication flows
 */
export async function updateAppUserLastLogin(
	clerkId: string
): Promise<AppUser> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Find user by clerkId
		const appUser = await getAppUserByClerkId(clerkId)
		if (!appUser) {
			throw new SecurityError('AppUser not found')
		}

		// Update lastLogin timestamp
		return await pb.collection('AppUser').update(appUser.id, {
			lastLogin: new Date().toISOString(),
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'AppUserService.updateAppUserLastLogin')
	}
}
