import { verifyClerkWebhook } from '@/lib/webhookUtils'
import { log } from 'console'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Handles webhook events from Clerk related to organizations
 */
export async function POST(req: NextRequest) {
	// Verify webhook signature
	const isValid = await verifyClerkWebhook(
		req,
		process.env.CLERK_WEBHOOK_SECRET_ORGANIZATION
	)

	if (!isValid) {
		console.error('Invalid webhook signature for organization event')
		return new NextResponse('Invalid signature', { status: 401 })
	}

	try {
		// Get the request body
		const body = await req.json()
		const { data, type } = body

		console.log(`Processing organization webhook: ${type}`)

		// Handle different organization events
		switch (type) {
			case 'organization.created':
				await handleOrganizationCreated(data)
				break
			case 'organization.updated':
				await handleOrganizationUpdated(data)
				break
			case 'organization.deleted':
				await handleOrganizationDeleted(data)
				break
			default:
				console.log(`Unhandled organization event type: ${type}`)
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error processing organization webhook:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

/**
 * Handles organization creation event
 * @param data - Organization data from Clerk webhook
 */
async function handleOrganizationCreated(data: any) {
	const { id: clerkId, name } = data
	console.log(data)

	// TODO: Implement organization creation in your database
	// Example: Create organization in PocketBase with the Clerk ID
}

/**
 * Handles organization update event
 * @param data - Organization data from Clerk webhook
 */
async function handleOrganizationUpdated(data: any) {
	const { id: clerkId, image_url, logo_url, name, public_metadata, slug } = data

	console.log(`Organization updated: ${clerkId} (${name})`)

	// TODO: Implement organization update in your database
	// Example: Update organization details in PocketBase
}

/**
 * Handles organization deletion event
 * @param data - Organization data from Clerk webhook
 */
async function handleOrganizationDeleted(data: any) {
	const { id: clerkId } = data

	console.log(`Organization deleted: ${clerkId}`)

	// TODO: Implement organization deletion in your database
	// Example: Mark organization as deleted in PocketBase
}
