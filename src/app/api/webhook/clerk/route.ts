import {
	syncUserToPocketBase,
	syncOrganizationToPocketBase,
	linkUserToOrganization,
} from '@/app/actions/services/clerk-sync/syncService'
import { WebhookEvent } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
// src/app/api/webhook/clerk/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'

/**
 * Webhook handler for Clerk events.
 * This endpoint receives and processes events from Clerk to keep PocketBase data in sync.
 *
 * @param req The incoming request containing the webhook payload
 * @returns Response indicating success or error
 */
export async function POST(req: NextRequest) {
	// Verify the webhook signature to ensure it's from Clerk
	const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

	if (!WEBHOOK_SECRET) {
		console.error('Missing CLERK_WEBHOOK_SECRET')
		return new NextResponse('Webhook secret not configured', { status: 500 })
	}

	// Get the signature and timestamp from the Svix headers
	const headerPayload = await headers()
	const svixId = headerPayload.get('svix-id')
	const svixTimestamp = headerPayload.get('svix-timestamp')
	const svixSignature = headerPayload.get('svix-signature')

	// If there are missing Svix headers, reject the request
	if (!svixId || !svixTimestamp || !svixSignature) {
		return new NextResponse('Missing Svix headers', { status: 400 })
	}

	try {
		// Get the raw request body
		const payload = await req.text()

		// Create a new Svix instance with our webhook secret
		const webhook = new Webhook(WEBHOOK_SECRET)

		// Verify the signature
		const evt = webhook.verify(payload, {
			'svix-id': svixId,
			'svix-signature': svixSignature,
			'svix-timestamp': svixTimestamp,
		}) as WebhookEvent

		// Get the ID of the webhook for idempotency
		const eventId = evt.data.id || svixId

		// Check if this event was already processed (implement this function)
		if (await hasProcessedEvent(eventId)) {
			return NextResponse.json(
				{ message: 'Event already processed' },
				{ status: 200 }
			)
		}

		// Handle different event types
		const eventType = evt.type

		if (eventType === 'user.created') {
			await syncUserToPocketBase(evt.data)
		} else if (eventType === 'user.updated') {
			await syncUserToPocketBase(evt.data)
		} else if (eventType === 'organization.created') {
			await syncOrganizationToPocketBase(evt.data)
		} else if (eventType === 'organization.updated') {
			await syncOrganizationToPocketBase(evt.data)
		} else if (eventType === 'organizationMembership.created') {
			await linkUserToOrganization(evt.data)
		}
		// Add additional event handlers as needed

		// Mark the event as processed
		await markEventAsProcessed(eventId)

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error processing webhook:', error)
		return new NextResponse('Webhook verification failed', { status: 400 })
	}
}

/**
 * Check if an event has already been processed to ensure idempotency
 * @param eventId The unique ID of the event
 * @returns Boolean indicating if the event was already processed
 */
async function hasProcessedEvent(eventId: string): Promise<boolean> {
	try {
		// Implementation could use PocketBase to store processed events
		// For now, we'll return false to process all events
		// TODO: Implement proper event tracking

		return false
	} catch (error) {
		console.error('Error checking processed event:', error)
		return false
	}
}

/**
 * Mark an event as processed to avoid duplicate processing
 * @param eventId The unique ID of the event to mark as processed
 */
async function markEventAsProcessed(eventId: string): Promise<void> {
	try {
		// Implementation would store the event ID with a timestamp
		// TODO: Implement proper event tracking

		console.log(`Event ${eventId} processed successfully`)
	} catch (error) {
		console.error('Error marking event as processed:', error)
	}
}
