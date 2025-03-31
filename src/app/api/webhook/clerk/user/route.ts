import { processWebhookEvent } from '@/app/actions/services/clerk-sync/webhook-handler'
import { verifyClerkWebhook } from '@/lib/webhookUtils'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Handles Clerk webhook requests for user-related events
 */
export async function POST(req: NextRequest) {
	console.info('Received Clerk user webhook request')

	try {
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

		// Verify the webhook signature and get the parsed body
		const verificationResult = await verifyClerkWebhook(
			req,
			process.env.CLERK_WEBHOOK_SECRET_USER
		)

		if (!verificationResult.success || !verificationResult.payload) {
			console.error('Invalid webhook signature for user event')
			return new NextResponse('Unauthorized: Invalid signature', {
				status: 401,
			})
		}

		// Use the parsed payload from the verification
		const body = verificationResult.payload as WebhookEvent
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
