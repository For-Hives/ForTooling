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
		console.log('Processing user update webhook for clerkId:', data.id)

		// Find existing user
		const existing = await getByClerkId(data.id)

		if (!existing) {
			console.log(
				`AppUser with clerkId ${data.id} not found, creating new user`
			)
			// If user doesn't exist, create it instead of updating
			return await handleWebhookCreated(data, elevated)
		}

		// Continue with the update logic...
		console.log(`Updating existing AppUser: ${existing.id}`)

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
 * Handles a webhook event for user deletion
 * @param {ClerkUserWebhookData} data - User deletion data from Clerk
 * @param {boolean} elevated - Whether operation has elevated permissions
 * @returns {Promise<WebhookProcessingResult>} Processing result
 */
export async function handleWebhookDeleted(
	data: ClerkUserWebhookData,
	elevated = true
): Promise<WebhookProcessingResult> {
	try {
		// Find existing user
		const existing = await getByClerkId(data.id)
		if (!existing) {
			return {
				message: `AppUser ${data.id} already deleted or not found`,
				success: true,
			}
		}

		// Delete user
		await deleteAppUser(existing.id, elevated)

		return {
			message: `Deleted AppUser ${data.id}`,
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
