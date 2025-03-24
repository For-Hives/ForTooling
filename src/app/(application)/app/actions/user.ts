'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

/**
 * Marks the user's onboarding as complete by setting metadata
 */
export async function markOnboardingComplete(): Promise<boolean> {
	const { userId } = await auth()

	if (!userId) {
		throw new Error('Authentication required')
	}

	try {
		const clerkClientInstance = await clerkClient()
		await clerkClientInstance.users.updateUserMetadata(userId, {
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
