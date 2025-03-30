import { verifyClerkWebhook } from '@/lib/webhookUtils'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Handles webhook events from Clerk related to users
 */
export async function POST(req: NextRequest) {
	// Verify webhook signature
	const isValid = await verifyClerkWebhook(
		req,
		process.env.CLERK_WEBHOOK_SECRET_USER
	)

	if (!isValid) {
		console.error('Invalid webhook signature for user event')
		return new NextResponse('Invalid signature', { status: 401 })
	}

	try {
		// Get the request body
		const body = await req.json()
		const { data, type } = body

		console.log(`Processing user webhook: ${type}`)

		// Handle different user events
		switch (type) {
			case 'user.created':
				await handleUserCreated(data)
				break
			case 'user.updated':
				await handleUserUpdated(data)
				break
			case 'user.deleted':
				await handleUserDeleted(data)
				break
			default:
				console.log(`Unhandled user event type: ${type}`)
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error processing user webhook:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

/**
 * Handles user creation event
 */
async function handleUserCreated(data: any) {
	const { id: clerkId } = data
	console.log(`User created: ${clerkId}`)

	// TODO: Create user in your database
}

/**
 * Handles user update event
 */
async function handleUserUpdated(data: any) {
	const { id: clerkId } = data
	console.log(`User updated: ${clerkId}`)

	// TODO: Update user in your database
}

/**
 * Handles user deletion event
 */
async function handleUserDeleted(data: any) {
	const { id: clerkId } = data
	console.log(`User deleted: ${clerkId}`)

	// TODO: Handle user deletion in your database
}
