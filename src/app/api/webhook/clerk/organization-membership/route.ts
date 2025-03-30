import { verifyClerkWebhook } from '@/lib/webhookUtils'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Handles webhook events from Clerk related to organization memberships
 */
export async function POST(req: NextRequest) {
	// Verify webhook signature
	const isValid = await verifyClerkWebhook(
		req,
		process.env.CLERK_WEBHOOK_SECRET_ORGANIZATION
	)

	if (!isValid) {
		console.error('Invalid webhook signature for organization membership event')
		return new NextResponse('Invalid signature', { status: 401 })
	}

	try {
		// Get the request body
		const body = await req.json()
		const { data, type } = body

		console.log(`Processing organization membership webhook: ${type}`)

		// Handle different organization membership events
		switch (type) {
			case 'organizationMembership.created':
				await handleMembershipCreated(data)
				break
			case 'organizationMembership.updated':
				await handleMembershipUpdated(data)
				break
			case 'organizationMembership.deleted':
				await handleMembershipDeleted(data)
				break
			default:
				console.log(`Unhandled organization membership event type: ${type}`)
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error processing organization membership webhook:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

/**
 * Handles organization membership creation event
 */
async function handleMembershipCreated(data: any) {
	const { id: membershipId, organization, public_user_data, role } = data

	console.log(
		`Membership created: User ${public_user_data.user_id} joined organization ${organization.id} as ${role}`
	)

	// TODO: Store the organization membership in your database
}

/**
 * Handles organization membership update event
 */
async function handleMembershipUpdated(data: any) {
	const { id: membershipId, organization, public_user_data, role } = data

	console.log(
		`Membership updated: User ${public_user_data.user_id} in organization ${organization.id}, role: ${role}`
	)

	// TODO: Update the organization membership in your database
}

/**
 * Handles organization membership deletion event
 */
async function handleMembershipDeleted(data: any) {
	const { id: membershipId, organization, public_user_data } = data

	console.log(
		`Membership deleted: User ${public_user_data.user_id} removed from organization ${organization.id}`
	)

	// TODO: Remove or mark as deleted the organization membership in your database
}
