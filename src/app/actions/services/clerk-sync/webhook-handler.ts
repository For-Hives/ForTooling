import * as userService from '@/app/actions/services/pocketbase/app-user/webhook-handlers'
import * as organizationService from '@/app/actions/services/pocketbase/organization/webhook-handlers'
import { WebhookProcessingResult } from '@/types/webhooks'
/**
 * Central handler for processing Clerk webhook events
 * Routes to appropriate service methods based on event type
 */
import { WebhookEvent } from '@clerk/nextjs/server'

/**
 * Process a Clerk webhook event
 * @param {WebhookEvent} event - The webhook event from Clerk
 * @returns {Promise<WebhookProcessingResult>} Result of processing
 */
export async function processWebhookEvent(
	event: WebhookEvent
): Promise<WebhookProcessingResult> {
	console.info(`Processing webhook event: ${event.type}`)

	try {
		// Temporarily elevate permissions for webhook processing
		const elevated = true

		// Handle organization events
		if (event.type === 'organization.created') {
			return await organizationService.handleWebhookCreated(
				event.data,
				elevated
			)
		} else if (event.type === 'organization.updated') {
			return await organizationService.handleWebhookUpdated(
				event.data,
				elevated
			)
		} else if (event.type === 'organization.deleted') {
			return await organizationService.handleWebhookDeleted(
				event.data,
				elevated
			)
		}

		// Handle membership events
		else if (event.type === 'organizationMembership.created') {
			return await organizationService.handleMembershipWebhookCreated(
				event.data,
				elevated
			)
		} else if (event.type === 'organizationMembership.updated') {
			return await organizationService.handleMembershipWebhookUpdated(
				event.data,
				elevated
			)
		} else if (event.type === 'organizationMembership.deleted') {
			return await organizationService.handleMembershipWebhookDeleted(
				event.data,
				elevated
			)
		}

		// Handle user events
		else if (event.type === 'user.created') {
			return await userService.handleWebhookCreated(event.data, elevated)
		} else if (event.type === 'user.updated') {
			return await userService.handleWebhookUpdated(event.data, elevated)
		} else if (event.type === 'user.deleted') {
			return await userService.handleWebhookDeleted(event.data, elevated)
		}

		// Unknown event type
		else {
			return {
				message: `Unhandled webhook event type: ${event.type}`,
				success: false,
			}
		}
	} catch (error) {
		console.error(`Error processing webhook ${event.type}:`, error)
		return {
			message: `Error processing webhook: ${error instanceof Error ? error.message : 'Unknown error'}`,
			success: false,
		}
	}
}
