import { processWebhookEvent } from '@/app/actions/services/clerk-sync/webhook-handler'
import { verifyClerkWebhook } from '@/lib/webhookUtils'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Handles webhook events from Clerk related to organization memberships
 */
export async function POST(req: NextRequest) {
	console.info('Received Clerk organization membership webhook request')

	try {
		// Parse the request body
		const body = (await req.json()) as WebhookEvent

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
			process.env.CLERK_WEBHOOK_SECRET_ORGANIZATION
		)

		if (!isValid) {
			console.error(
				'Invalid webhook signature for organization membership event'
			)
			return new NextResponse('Unauthorized: Invalid signature', {
				status: 401,
			})
		}

		console.info('Webhook verified successfully:', { type: body.type })

		// Process the webhook using our central handler
		const result = await processWebhookEvent(body)
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
