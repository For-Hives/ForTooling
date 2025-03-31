'use server'

import {
	syncUserToPocketBase,
	syncOrganizationToPocketBase,
	linkUserToOrganizationFromClerk,
	ClerkMembershipData,
} from '@/app/actions/services/clerk-sync/syncService'
import { WebhookEvent, clerkClient } from '@clerk/nextjs/server'

/**
 * Result of processing a webhook event
 */
interface WebhookProcessingResult {
	message: string
	success: boolean
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

	try {
		// Handle organization events
		if (
			event.type === 'organization.created' ||
			event.type === 'organization.updated'
		) {
			// Récupérer l'organisation complète depuis Clerk
			const clerkAPI = await clerkClient()
			const organizationId = event.data.id as string
			const completeOrg = await clerkAPI.organizations.getOrganization({
				organizationId,
			})

			const organization = await syncOrganizationToPocketBase(completeOrg)
			return {
				message: `Organization ${organization.name} (${organization.id}) synchronized successfully`,
				success: true,
			}
		} else if (event.type === 'organization.deleted') {
			// Pour l'instant, nous ne supprimons pas réellement les organisations
			// C'est un choix de conception pour garder l'historique
			return {
				message: `Organization deletion registered but not processed (data preserved)`,
				success: true,
			}
		}

		// Handle membership events
		else if (
			event.type === 'organizationMembership.created' ||
			event.type === 'organizationMembership.updated'
		) {
			// Convertir les données de membership dans notre format attendu
			const membershipData: ClerkMembershipData = {
				organization: { id: event.data.organization.id },
				public_user_data: {
					user_id: event.data.public_user_data?.user_id,
				},
				role: event.data.role,
			}

			const user = await linkUserToOrganizationFromClerk(membershipData)
			if (user) {
				return {
					message: `User ${user.name} linked to organization successfully`,
					success: true,
				}
			} else {
				return {
					message: `Failed to link user to organization`,
					success: false,
				}
			}
		} else if (event.type === 'organizationMembership.deleted') {
			// Pour l'instant, nous ne supprimons pas les liens utilisateur-organisation
			// C'est un choix de conception pour conserver l'historique
			return {
				message: `Membership deletion registered but not processed (link preserved)`,
				success: true,
			}
		}

		// Handle user events
		else if (event.type === 'user.created' || event.type === 'user.updated') {
			// Récupérer l'utilisateur complet depuis Clerk
			const clerkAPI = await clerkClient()
			const userId = event.data.id as string
			const completeUser = await clerkAPI.users.getUser(userId)

			const user = await syncUserToPocketBase(completeUser)
			return {
				message: `User ${user.name} (${user.id}) synchronized successfully`,
				success: true,
			}
		} else if (event.type === 'user.deleted') {
			// Pour l'instant, nous ne supprimons pas réellement les utilisateurs
			// C'est un choix de conception pour garder l'historique
			return {
				message: `User deletion registered but not processed (data preserved)`,
				success: true,
			}
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
