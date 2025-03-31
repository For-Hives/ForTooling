import {
	handleWebhookCreated,
	handleWebhookDeleted,
	handleWebhookUpdated,
} from '@/app/actions/services/pocketbase/app-user/webhook-handlers'
import { verifyClerkWebhook } from '@/lib/webhookUtils'
import { NextRequest, NextResponse } from 'next/server'

// Define types for Clerk webhook payload
interface ClerkWebhookData {
	id: string
	[key: string]: unknown
}

interface ClerkWebhookEvent {
	type: string
	data: ClerkWebhookData
}

/**
 * Handles Clerk webhook requests for user-related events
 */
export async function POST(req: NextRequest) {
	console.info('Received Clerk webhook request')

	try {
		// Parse the request body
		const body = (await req.json()) as ClerkWebhookEvent

		// Get the Svix headers for verification
		const svixId = req.headers.get('svix-id')
		const svixTimestamp = req.headers.get('svix-timestamp')
		const svixSignature = req.headers.get('svix-signature')

		// Validate that we have all required headers
		if (!svixId || !svixTimestamp || !svixSignature) {
			console.error('Missing required Svix headers')
			return new NextResponse('Unauthorized: Missing verification headers', {
				status: 401,
			})
		}

		// Verify the webhook signature
		const isValid = await verifyClerkWebhook(
			req,
			process.env.CLERK_WEBHOOK_SECRET_USER
		)

		if (!isValid) {
			console.error('Invalid webhook signature for user event')
			return new NextResponse('Unauthorized: Invalid signature', {
				status: 401,
			})
		}

		console.info('Webhook verified successfully:', { type: body.type })

		// Process the webhook based on its type
		let result

		switch (body.type) {
			case 'user.created':
				console.info('Processing user.created event')
				result = await handleWebhookCreated(body.data)
				break

			case 'user.updated':
				console.info('Processing user.updated event')
				result = await handleWebhookUpdated(body.data)
				break

			case 'user.deleted':
				console.info('Processing user.deleted event')
				result = await handleWebhookDeleted(body.data)
				break

			default:
				console.info(`Ignoring unsupported webhook type: ${body.type}`)
				return NextResponse.json({
					message: `Webhook type ${body.type} is not supported`,
					success: false,
				})
		}

		return NextResponse.json(result)
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error'
		console.error('Error processing webhook:', error)

		return NextResponse.json(
			{
				error: 'Failed to process webhook',
				message: errorMessage,
				success: false,
			},
			{ status: 500 }
		)
	}
}
