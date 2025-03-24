'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

/**
 * Marks the user's onboarding as complete by setting metadata
 * This allows the application to know that the user has completed the onboarding process
 * and shouldn't be redirected to the onboarding page again
 */
export async function markOnboardingComplete(): Promise<boolean> {
	const { userId } = await auth()

	if (!userId) {
		throw new Error('Authentication required')
	}

	try {
		// Update the user's public metadata
		// hasCompletedOnboarding=true indicates the user has finished onboarding
		// onboardingCompletedAt stores the date when onboarding was completed
		const clerkClientInstance = await clerkClient()
		await clerkClientInstance.users.updateUserMetadata(userId, {
			publicMetadata: {
				hasCompletedOnboarding: true,
				onboardingCompletedAt: new Date().toISOString(),
			},
		})

		return true
	} catch (error) {
		console.error('Error updating user metadata:', error)
		throw new Error('Failed to complete onboarding')
	}
}
