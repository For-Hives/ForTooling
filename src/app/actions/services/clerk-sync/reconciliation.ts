// src/app/actions/services/clerk-sync/reconciliation.ts
import { clerkClient } from '@clerk/nextjs/server'

import {
	syncUserToPocketBase,
	syncOrganizationToPocketBase,
	linkUserToOrganization,
} from './syncService'

/**
 * Full reconciliation between Clerk and PocketBase
 * This script should be run periodically to ensure data consistency
 * Could be triggered by a cron job or scheduled task
 */
export async function runFullReconciliation() {
	console.log(
		'Starting full Clerk-PocketBase reconciliation:',
		new Date().toISOString()
	)

	try {
		const startTime = Date.now()

		// Get all users and organizations from Clerk
		const clerkClientInstance = await clerkClient()
		const clerkUsers = await clerkClientInstance.users.getUserList()
		const clerkOrganizations =
			await clerkClientInstance.organizations.getOrganizationList()

		console.log(
			`Found ${clerkUsers.length} users and ${clerkOrganizations.length} organizations in Clerk`
		)

		// Sync all organizations first
		console.log('Syncing organizations...')
		const orgResults = await Promise.allSettled(
			clerkOrganizations.map(org => syncOrganizationToPocketBase(org))
		)

		const successfulOrgs = orgResults.filter(
			result => result.status === 'fulfilled'
		).length
		console.log(
			`Successfully synced ${successfulOrgs}/${clerkOrganizations.length} organizations`
		)

		// Sync all users
		console.log('Syncing users...')
		const userResults = await Promise.allSettled(
			clerkUsers.map(user => syncUserToPocketBase(user))
		)

		const successfulUsers = userResults.filter(
			result => result.status === 'fulfilled'
		).length
		console.log(
			`Successfully synced ${successfulUsers}/${clerkUsers.length} users`
		)

		// Sync organization memberships
		console.log('Syncing organization memberships...')
		let membershipCount = 0

		for (const org of clerkOrganizations) {
			try {
				const memberships =
					await clerkClientInstance.organizations.getOrganizationMembershipList(
						{
							organizationId: org.id,
						}
					)

				for (const membership of memberships) {
					try {
						const membershipData = {
							organization: { id: org.id },
							public_user_data: { user_id: membership.publicUserData.userId },
							role: membership.role,
						}

						await linkUserToOrganization(membershipData)
						membershipCount++
					} catch (error) {
						console.error(
							`Error syncing membership for user ${membership.publicUserData.userId} in org ${org.id}:`,
							error
						)
					}
				}
			} catch (error) {
				console.error(
					`Error fetching memberships for organization ${org.id}:`,
					error
				)
			}
		}

		console.log(
			`Successfully synced ${membershipCount} organization memberships`
		)

		// Done
		const totalTime = (Date.now() - startTime) / 1000
		console.log(`Reconciliation completed in ${totalTime.toFixed(2)} seconds`)

		return {
			memberships: membershipCount,
			organizations: {
				failed: clerkOrganizations.length - successfulOrgs,
				total: clerkOrganizations.length,
			},
			status: 'success',
			timeTaken: totalTime,
			users: {
				failed: clerkUsers.length - successfulUsers,
				total: clerkUsers.length,
			},
		}
	} catch (error) {
		console.error('Reconciliation failed:', error)
		throw error
	}
}

/**
 * Reconcile a specific user by checking and updating their data
 * Useful for targeted fixes or individual user troubleshooting
 *
 * @param clerkUserId The Clerk user ID to reconcile
 * @returns The reconciliation result
 */
export async function reconcileSpecificUser(clerkUserId: string) {
	try {
		console.log(`Starting reconciliation for user ${clerkUserId}`)

		// Get user data from Clerk
		const clerkClientInstance = await clerkClient()
		const clerkUser = await clerkClientInstance.users.getUser(clerkUserId)

		// Sync user to PocketBase
		await syncUserToPocketBase(clerkUser)

		// Find all organizations this user belongs to
		const memberships =
			await clerkClientInstance.users.getOrganizationMembershipList({
				userId: clerkUserId,
			})

		// Sync each organization and membership
		for (const membership of memberships) {
			const orgId = membership.organization.id

			// Sync the organization
			const clerkOrg =
				await clerkClientInstance.organizations.getOrganization(orgId)
			await syncOrganizationToPocketBase(clerkOrg)

			// Sync the membership
			const membershipData = {
				organization: { id: orgId },
				public_user_data: { user_id: clerkUserId },
				role: membership.role,
			}

			await linkUserToOrganization(membershipData)
		}

		return {
			memberships: memberships.length,
			status: 'success',
			userId: clerkUserId,
		}
	} catch (error) {
		console.error(`Error reconciling user ${clerkUserId}:`, error)
		throw error
	}
}

/**
 * Reconcile a specific organization and all its members
 *
 * @param clerkOrgId The Clerk organization ID to reconcile
 * @returns The reconciliation result
 */
export async function reconcileSpecificOrganization(clerkOrgId: string) {
	try {
		console.log(`Starting reconciliation for organization ${clerkOrgId}`)

		// Get organization data from Clerk
		const clerkClientInstance = await clerkClient()
		const clerkOrg =
			await clerkClientInstance.organizations.getOrganization(clerkOrgId)

		// Sync organization to PocketBase
		await syncOrganizationToPocketBase(clerkOrg)

		// Find all members of this organization
		const memberships =
			await clerkClientInstance.organizations.getOrganizationMembershipList({
				organizationId: clerkOrgId,
			})

		// Sync each user and membership
		for (const membership of memberships) {
			const userId = membership.publicUserData.userId

			// Sync the user
			const clerkUser = await clerkClientInstance.users.getUser(userId)
			await syncUserToPocketBase(clerkUser)

			// Sync the membership
			const membershipData = {
				organization: { id: clerkOrgId },
				public_user_data: { user_id: userId },
				role: membership.role,
			}

			await linkUserToOrganization(membershipData)
		}

		return {
			members: memberships.length,
			organizationId: clerkOrgId,
			status: 'success',
		}
	} catch (error) {
		console.error(`Error reconciling organization ${clerkOrgId}:`, error)
		throw error
	}
}
