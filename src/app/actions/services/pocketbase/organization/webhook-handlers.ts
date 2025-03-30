'use server'

import {
	createOrganization,
	updateOrganization,
	deleteOrganization,
} from '@/app/actions/services/pocketbase/organization/core'
import { getByClerkId } from '@/app/actions/services/pocketbase/organization/internal'
import {
	addUserToOrganization,
	removeUserFromOrganization,
} from '@/app/actions/services/pocketbase/organization/membership'
import {
	ClerkOrganizationWebhookData,
	ClerkMembershipWebhookData,
	WebhookProcessingResult,
} from '@/types/webhooks'

/**
 * Webhook handlers for organization events from Clerk
 */

/**
 * Handles a webhook event for organization creation
 * @param {ClerkOrganizationWebhookData} data - Organization data from Clerk
 * @param {boolean} elevated - Whether operation has elevated permissions
 * @returns {Promise<WebhookProcessingResult>} Processing result
 */
export async function handleWebhookCreated(
	data: ClerkOrganizationWebhookData,
	elevated = true
): Promise<WebhookProcessingResult> {
	try {
		// Check if already exists
		const existing = await getByClerkId(data.id)
		if (existing) {
			return {
				message: `Organization ${data.id} already exists`,
				success: true,
			}
		}

		// Create new organization
		await createOrganization(
			{
				clerkId: data.id,
				name: data.name,
				settings: {
					imageUrl: data.image_url || null,
					logoUrl: data.logo_url || null,
					slug: data.slug || null,
				},
			},
			elevated
		)

		return {
			message: `Created organization ${data.id}`,
			success: true,
		}
	} catch (error) {
		console.error('Failed to process organization creation webhook:', error)
		return {
			message: `Failed to process organization creation: ${error instanceof Error ? error.message : 'Unknown error'}`,
			success: false,
		}
	}
}

/**
 * Handles a webhook event for organization update
 * @param {ClerkOrganizationWebhookData} data - Organization data from Clerk
 * @param {boolean} elevated - Whether operation has elevated permissions
 * @returns {Promise<WebhookProcessingResult>} Processing result
 */
export async function handleWebhookUpdated(
	data: ClerkOrganizationWebhookData,
	elevated = true
): Promise<WebhookProcessingResult> {
	try {
		// Find existing organization
		const existing = await getByClerkId(data.id)
		if (!existing) {
			return {
				message: `Organization ${data.id} not found`,
				success: false,
			}
		}

		// Update organization
		await updateOrganization(
			existing.id,
			{
				name: data.name,
				settings: {
					...existing.settings,
					imageUrl: data.image_url || existing.settings?.imageUrl || null,
					logoUrl: data.logo_url || existing.settings?.logoUrl || null,
					slug: data.slug || existing.settings?.slug || null,
				},
			},
			elevated
		)

		return {
			message: `Updated organization ${data.id}`,
			success: true,
		}
	} catch (error) {
		console.error('Failed to process organization update webhook:', error)
		return {
			message: `Failed to process organization update: ${error instanceof Error ? error.message : 'Unknown error'}`,
			success: false,
		}
	}
}

/**
 * Handles a webhook event for organization deletion
 * @param {ClerkOrganizationWebhookData} data - Organization deletion data from Clerk
 * @param {boolean} elevated - Whether operation has elevated permissions
 * @returns {Promise<WebhookProcessingResult>} Processing result
 */
export async function handleWebhookDeleted(
	data: ClerkOrganizationWebhookData,
	elevated = true
): Promise<WebhookProcessingResult> {
	try {
		// Find existing organization
		const existing = await getByClerkId(data.id)
		if (!existing) {
			return {
				message: `Organization ${data.id} already deleted or not found`,
				success: true,
			}
		}

		// Delete organization
		await deleteOrganization(existing.id, elevated)

		return {
			message: `Deleted organization ${data.id}`,
			success: true,
		}
	} catch (error) {
		console.error('Failed to process organization deletion webhook:', error)
		return {
			message: `Failed to process organization deletion: ${error instanceof Error ? error.message : 'Unknown error'}`,
			success: false,
		}
	}
}

/**
 * Handles membership creation from webhook
 * @param {ClerkMembershipWebhookData} data - Membership data from Clerk
 * @param {boolean} elevated - Whether operation has elevated permissions
 * @returns {Promise<WebhookProcessingResult>} Processing result
 */
export async function handleMembershipWebhookCreated(
	data: ClerkMembershipWebhookData,
	elevated = true
): Promise<WebhookProcessingResult> {
	try {
		// Get organization and user
		const organization = await getByClerkId(data.organization.id)
		if (!organization) {
			return {
				message: `Organization with Clerk ID ${data.organization.id} not found`,
				success: false,
			}
		}

		const user = await userService.getByClerkId(data.public_user_data.user_id)
		if (!user) {
			return {
				message: `User with Clerk ID ${data.public_user_data.user_id} not found`,
				success: false,
			}
		}

		// Add user to organization
		await addUserToOrganization(user.id, organization.id, elevated)

		// Update user role if needed
		if (data.role === 'admin') {
			await userService.updateUser(
				user.id,
				{
					role: 'admin',
				},
				elevated
			)
		}

		return {
			message: `Added user ${user.id} to organization ${organization.id}`,
			success: true,
		}
	} catch (error) {
		console.error('Failed to process membership creation webhook:', error)
		return {
			message: `Failed to process membership creation: ${error instanceof Error ? error.message : 'Unknown error'}`,
			success: false,
		}
	}
}

/**
 * Handles membership update from webhook
 * @param {ClerkMembershipWebhookData} data - Membership data from Clerk
 * @param {boolean} elevated - Whether operation has elevated permissions
 * @returns {Promise<WebhookProcessingResult>} Processing result
 */
export async function handleMembershipWebhookUpdated(
	data: ClerkMembershipWebhookData,
	elevated = true
): Promise<WebhookProcessingResult> {
	try {
		// Get organization and user
		const organization = await getByClerkId(data.organization.id)
		if (!organization) {
			return {
				message: `Organization with Clerk ID ${data.organization.id} not found`,
				success: false,
			}
		}

		const user = await userService.getByClerkId(data.public_user_data.user_id)
		if (!user) {
			return {
				message: `User with Clerk ID ${data.public_user_data.user_id} not found`,
				success: false,
			}
		}

		// Update user role if needed
		if (data.role === 'admin') {
			await userService.updateUser(
				user.id,
				{
					role: 'admin',
				},
				elevated
			)
		} else if (data.role === 'basic_member') {
			await userService.updateUser(
				user.id,
				{
					role: 'member',
				},
				elevated
			)
		}

		return {
			message: `Updated user ${user.id} role in organization ${organization.id}`,
			success: true,
		}
	} catch (error) {
		console.error('Failed to process membership update webhook:', error)
		return {
			message: `Failed to process membership update: ${error instanceof Error ? error.message : 'Unknown error'}`,
			success: false,
		}
	}
}

/**
 * Handles membership deletion from webhook
 * @param {ClerkMembershipWebhookData} data - Membership data from Clerk
 * @param {boolean} elevated - Whether operation has elevated permissions
 * @returns {Promise<WebhookProcessingResult>} Processing result
 */
export async function handleMembershipWebhookDeleted(
	data: ClerkMembershipWebhookData,
	elevated = true
): Promise<WebhookProcessingResult> {
	try {
		// Get organization and user
		const organization = await getByClerkId(data.organization.id)
		if (!organization) {
			return {
				message: `Organization with Clerk ID ${data.organization.id} not found`,
				success: true,
			}
		}

		const user = await userService.getByClerkId(data.public_user_data.user_id)
		if (!user) {
			return {
				message: `User with Clerk ID ${data.public_user_data.user_id} not found`,
				success: true,
			}
		}

		// Remove user from organization
		await removeUserFromOrganization(user.id, organization.id, elevated)

		return {
			message: `Removed user ${user.id} from organization ${organization.id}`,
			success: true,
		}
	} catch (error) {
		console.error('Failed to process membership deletion webhook:', error)
		return {
			message: `Failed to process membership deletion: ${error instanceof Error ? error.message : 'Unknown error'}`,
			success: false,
		}
	}
}
