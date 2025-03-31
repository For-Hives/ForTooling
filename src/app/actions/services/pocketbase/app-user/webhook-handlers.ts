'use server'

import {
	createAppUser,
	updateAppUser,
	deleteAppUser,
} from '@/app/actions/services/pocketbase/app-user/core'
import { getByClerkId } from '@/app/actions/services/pocketbase/app-user/internal'
import { ClerkUserWebhookData, WebhookProcessingResult } from '@/types/webhooks'

/**
 * Handles a webhook event for user creation
 * @param {ClerkUserWebhookData} data - User data from Clerk
 * @param {boolean} elevated - Whether operation has elevated permissions
 * @returns {Promise<WebhookProcessingResult>} Processing result
 */
export async function handleWebhookCreated(
	data: ClerkUserWebhookData,
	elevated = true
): Promise<WebhookProcessingResult> {
	try {
		// Check if already exists
		const existing = await getByClerkId(data.id)
		if (existing) {
			return {
				message: `AppUser ${data.id} already exists`,
				success: true,
			}
		}

		// Get primary email if available
		let email = ''
		if (data.email_addresses && data.email_addresses.length > 0) {
			email = data.email_addresses[0].email_address
		}

		// Create new AppUser - normally we'd include an organization ID, but
		// for webhook-created users, we'll wait for the organization membership event
		await createAppUser(
			'', // Leave empty for now, will be set when user joins an organization
			{
				clerkId: data.id,
				email,
				name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
				role: 'member',
				verified: true,
				// No password fields needed with custom collection
			},
			elevated
		)

		return {
			message: `Created AppUser ${data.id}`,
			success: true,
		}
	} catch (error) {
		console.error('Failed to process user creation webhook:', error)
		return {
			message: `Failed to process user creation: ${error instanceof Error ? error.message : 'Unknown error'}`,
			success: false,
		}
	}
}

/**
 * Handles a webhook event for user update
 * @param {ClerkUserWebhookData} data - User data from Clerk
 * @param {boolean} elevated - Whether operation has elevated permissions
 * @returns {Promise<WebhookProcessingResult>} Processing result
 */
export async function handleWebhookUpdated(
	data: ClerkUserWebhookData,
	elevated = true
): Promise<WebhookProcessingResult> {
	try {
		console.info('Processing user update webhook for clerkId:', data.id)

		// Find existing user
		const existing = await getByClerkId(data.id)

		if (!existing) {
			console.info(
				`AppUser with clerkId ${data.id} not found, creating new user`
			)
			// If user doesn't exist, create it instead of updating
			return await handleWebhookCreated(data, elevated)
		}

		// Continue with the update logic...
		console.info(`Updating existing AppUser: ${existing.id}`)

		// Get primary email if available
		let email = existing.email // Default to existing
		if (data.email_addresses && data.email_addresses.length > 0) {
			email = data.email_addresses[0].email_address
		}

		// Update user
		await updateAppUser(
			existing.id,
			{
				email,
				name:
					`${data.first_name || ''} ${data.last_name || ''}`.trim() ||
					existing.name,
			},
			elevated
		)

		return {
			message: `Updated AppUser ${data.id}`,
			success: true,
		}
	} catch (error) {
		console.error('Failed to process user update webhook:', error)
		return {
			message: `Failed to process user update: ${error instanceof Error ? error.message : 'Unknown error'}`,
			success: false,
		}
	}
}

/**
 * Handles the user.deleted webhook event from Clerk
 * @param data The webhook data from Clerk
 * @param elevated Whether to use elevated permissions
 * @returns Result of the operation
 */
export async function handleWebhookDeleted(
	data: ClerkUserWebhookData,
	elevated = true
): Promise<WebhookProcessingResult> {
	try {
		const clerkId = data.id
		console.info(`Processing user deletion webhook for clerkId: ${clerkId}`)

		// Find existing user
		const existing = await getByClerkId(clerkId)

		// If user doesn't exist in PocketBase, just log and return success
		if (!existing) {
			console.info(
				`AppUser with clerkId ${clerkId} not found in PocketBase. Nothing to delete.`
			)
			return {
				message: `No user found with clerkId ${clerkId}. No action needed.`,
				success: true,
			}
		}

		console.info(
			`Found AppUser with id ${existing.id} and clerkId ${clerkId}. Deleting...`
		)

		// Delete the user from PocketBase
		await deleteAppUser(existing.id, elevated)

		console.info(
			`Successfully deleted AppUser with id ${existing.id} and clerkId ${clerkId}`
		)

		return {
			message: `Successfully deleted user with clerkId ${clerkId}`,
			success: true,
		}
	} catch (error) {
		console.error('Failed to process user deletion webhook:', error)
		return {
			message: `Failed to process user deletion: ${error instanceof Error ? error.message : 'Unknown error'}`,
			success: false,
		}
	}
}
