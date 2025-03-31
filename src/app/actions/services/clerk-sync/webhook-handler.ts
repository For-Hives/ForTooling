'use server'

import {
	syncUserToPocketBase,
	syncOrganizationToPocketBase,
	linkUserToOrganizationFromClerk,
	ClerkMembershipData,
} from '@/app/actions/services/clerk-sync/syncService'
import { WebhookEvent, clerkClient, User } from '@clerk/nextjs/server'

/**
 * Result of processing a webhook event
 */
interface WebhookProcessingResult {
	message: string
	success: boolean
	data?: any
	error?: string
}

/**
 * Process a Clerk webhook event
 * @param {WebhookEvent} event - The webhook event from Clerk
 * @returns {Promise<WebhookProcessingResult>} Result of processing
 */
export async function processWebhookEvent(
	event: WebhookEvent
): Promise<WebhookProcessingResult> {
	console.info(`Processing webhook event: ${event.type}`)

	// Validate event data
	if (!event || !event.data || !event.type) {
		console.error('Invalid webhook event received')
		return {
			error: 'INVALID_EVENT_FORMAT',
			message: 'Invalid webhook event format',
			success: false,
		}
	}

	try {
		// Handle organization events
		if (
			event.type === 'organization.created' ||
			event.type === 'organization.updated'
		) {
			// Retrieve complete organization data from Clerk
			const clerkAPI = await clerkClient()
			const organizationId = event.data.id as string

			if (!organizationId) {
				return {
					error: 'MISSING_ORGANIZATION_ID',
					message: 'Missing organization ID in webhook data',
					success: false,
				}
			}

			const completeOrg = await clerkAPI.organizations.getOrganization({
				organizationId,
			})

			const organization = await syncOrganizationToPocketBase(completeOrg)
			return {
				data: { organizationId: organization.id },
				message: `Organization ${organization.name} (${organization.id}) synchronized successfully`,
				success: true,
			}
		} else if (event.type === 'organization.deleted') {
			// We don't actually delete organizations
			// This is a design choice to preserve history
			return {
				data: { organizationId: event.data.id as string },
				message: `Organization deletion registered but not processed (data preserved)`,
				success: true,
			}
		}

		// Handle membership events
		else if (
			event.type === 'organizationMembership.created' ||
			event.type === 'organizationMembership.updated'
		) {
			// Convert membership data to our expected format
			const membershipData: ClerkMembershipData = {
				organization: { id: event.data.organization?.id },
				public_user_data: {
					user_id: event.data.public_user_data?.user_id,
				},
				role: event.data.role,
			}

			// Validate required fields
			if (
				!membershipData.organization?.id ||
				!membershipData.public_user_data?.user_id
			) {
				return {
					error: 'MISSING_MEMBERSHIP_DATA',
					message: 'Missing required membership data',
					success: false,
				}
			}

			const user = await linkUserToOrganizationFromClerk(membershipData)
			if (user) {
				return {
					data: {
						organizationId: membershipData.organization.id,
						userId: user.id,
					},
					message: `User ${user.name} linked to organization successfully`,
					success: true,
				}
			} else {
				return {
					error: 'LINK_FAILED',
					message: `Failed to link user to organization`,
					success: false,
				}
			}
		} else if (event.type === 'organizationMembership.deleted') {
			// We don't actually delete organization memberships
			// This is a design choice to preserve history
			return {
				data: {
					organizationId: event.data.organization?.id,
					userId: event.data.public_user_data?.user_id,
				},
				message: `Membership deletion registered but not processed (link preserved)`,
				success: true,
			}
		}

		// Handle user events
		else if (event.type === 'user.created' || event.type === 'user.updated') {
			try {
				// Validate user ID
				const userId = event.data.id as string
				if (!userId) {
					return {
						error: 'MISSING_USER_ID',
						message: 'Missing user ID in webhook data',
						success: false,
					}
				}

				// Retrieve complete user data from Clerk
				const clerkAPI = await clerkClient()
				const completeUser = await clerkAPI.users.getUser(userId)

				const user = await syncUserToPocketBase(completeUser)
				return {
					data: { userId: user.id },
					message: `User ${user.name} (${user.id}) synchronized successfully`,
					success: true,
				}
			} catch (error) {
				console.warn(
					'Failed to fetch user from Clerk API, using webhook data:',
					error
				)

				// If we can't get the user from the API, try to use the webhook data directly
				// This can happen due to replication delay after user creation
				if (event.data && typeof event.data === 'object') {
					try {
						// Validate required email data
						const emailAddresses = Array.isArray(event.data.email_addresses)
							? event.data.email_addresses
							: []

						const primaryEmailId = event.data.primary_email_address_id as string

						if (!primaryEmailId || emailAddresses.length === 0) {
							return {
								error: 'MISSING_EMAIL_DATA',
								message: 'Missing required email data in webhook',
								success: false,
							}
						}

						// Construct a minimal user object from webhook data
						const webhookUser = {
							createdAt: (event.data.created_at || Date.now()) as number,
							emailAddresses: emailAddresses.map(email => ({
								emailAddress: email.email_address,
								id: email.id,
								verification: email.verification,
							})),
							externalAccounts: [] as Array<{
								provider: string
								externalId: string
								emailAddress?: string
								imageUrl?: string
							}>,
							firstName: (event.data.first_name || '') as string,
							id: event.data.id as string,
							imageUrl: (event.data.image_url || '') as string,
							lastName: (event.data.last_name || '') as string,
							lastSignInAt: (event.data.last_sign_in_at || null) as
								| number
								| null,
							primaryEmailAddressId: primaryEmailId,
							publicMetadata: (event.data.public_metadata || {}) as Record<
								string,
								unknown
							>,
							updatedAt: (event.data.updated_at || Date.now()) as number,
							username: (event.data.username || null) as string | null,
						}

						const user = await syncUserToPocketBase(
							webhookUser as unknown as User
						)
						return {
							data: { userId: user.id },
							message: `User ${user.name} (${user.id}) synchronized successfully using webhook data`,
							success: true,
						}
					} catch (webhookError) {
						console.error(
							'Error processing user from webhook data:',
							webhookError
						)
						return {
							error: 'WEBHOOK_DATA_PROCESSING_ERROR',
							message: `Failed to sync user from webhook data: ${webhookError instanceof Error ? webhookError.message : 'Unknown error'}`,
							success: false,
						}
					}
				}

				return {
					error: 'USER_SYNC_ERROR',
					message: `Failed to sync user: ${error instanceof Error ? error.message : 'Unknown error'}`,
					success: false,
				}
			}
		} else if (event.type === 'user.deleted') {
			// We don't actually delete users
			// This is a design choice to preserve history
			return {
				data: { userId: event.data.id as string },
				message: `User deletion registered but not processed (data preserved)`,
				success: true,
			}
		}

		// Unknown event type
		else {
			return {
				error: 'UNKNOWN_EVENT_TYPE',
				message: `Unhandled webhook event type: ${event.type}`,
				success: false,
			}
		}
	} catch (error) {
		console.error(`Error processing webhook ${event.type}:`, error)
		return {
			error: 'WEBHOOK_PROCESSING_ERROR',
			message: `Error processing webhook: ${error instanceof Error ? error.message : 'Unknown error'}`,
			success: false,
		}
	}
}
