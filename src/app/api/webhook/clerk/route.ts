import { processWebhookEvent } from '@/app/actions/services/clerk-sync/webhook-handler'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'

/**
 * Webhook handler for Clerk events
 * Verifies the webhook signature and processes events
 */
export async function POST(req: Request) {
	const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

	if (!WEBHOOK_SECRET) {
		console.error('Missing CLERK_WEBHOOK_SECRET')
		return new NextResponse('Webhook secret missing', { status: 500 })
	}

	// Get the signature and timestamp from the headers
	const headerPayload = headers()
	const svix_id = headerPayload.get('svix-id')
	const svix_timestamp = headerPayload.get('svix-timestamp')
	const svix_signature = headerPayload.get('svix-signature')

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new NextResponse('Error: Missing svix headers', { status: 400 })
	}

	// Get the body
	const payload = await req.json()
	const body = JSON.stringify(payload)

	// Create a new Svix instance with your secret
	const webhook = new Webhook(WEBHOOK_SECRET)

	try {
		// Verify the payload with the headers
		const event = webhook.verify(body, {
			'svix-id': svix_id,
			'svix-signature': svix_signature,
			'svix-timestamp': svix_timestamp,
		})

		console.log(`Webhook received: ${event.type}`)

		// Process the event using our centralized handler
		const result = await processWebhookEvent(event)

		return NextResponse.json(result)
	} catch (err) {
		console.error('Error verifying webhook:', err)
		return new NextResponse('Error verifying webhook', { status: 400 })
	}
}
