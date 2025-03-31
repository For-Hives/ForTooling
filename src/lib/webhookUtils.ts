import { NextRequest } from 'next/server'
import { Webhook } from 'svix'

/**
 * Validates a webhook signature from Clerk using the official Svix library
 */
export async function verifyClerkWebhook(
	req: NextRequest,
	secret: string | undefined
): Promise<{ success: boolean; payload?: any }> {
	if (!secret) {
		console.error('Missing Clerk webhook secret')
		return { success: false }
	}

	// Get the signature headers
	const svix_id = req.headers.get('svix-id')
	const svix_timestamp = req.headers.get('svix-timestamp')
	const svix_signature = req.headers.get('svix-signature')

	if (!svix_id || !svix_timestamp || !svix_signature) {
		console.error('Missing Svix headers')
		return { success: false }
	}

	// Get the raw body
	const payload = await req.text()

	try {
		// Create a new Webhook instance with the secret
		const wh = new Webhook(secret)

		// Verify the webhook payload
		const event = wh.verify(payload, {
			'svix-id': svix_id,
			'svix-signature': svix_signature,
			'svix-timestamp': svix_timestamp,
		})

		if (!event) {
			console.error('Invalid webhook signature')
			return { success: false }
		}

		// If we reach here, the verification succeeded
		return { payload: JSON.parse(payload), success: true }
	} catch (error) {
		console.error('Webhook verification error:', error)
		return { success: false }
	}
}
