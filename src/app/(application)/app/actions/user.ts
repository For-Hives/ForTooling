'use server'

import { auth } from '@clerk/nextjs'
import { clerkClient } from '@clerk/nextjs/server'

/**
 * Marks the user's onboarding as complete by setting metadata
 */
export async function markOnboardingComplete(): Promise<boolean> {
	const { userId } = auth()

	if (!userId) {
		throw new Error('Authentication required')
	}

	try {
		await clerkClient.users.updateUserMetadata(userId, {
			publicMetadata: {
				hasCompletedOnboarding: true,
			},
		})

		return true
	} catch (error) {
		console.error('Error updating user metadata:', error)
		throw new Error('Failed to complete onboarding')
	}
}
