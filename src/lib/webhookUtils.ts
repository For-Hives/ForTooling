import * as crypto from 'crypto'
import { NextRequest } from 'next/server'

/**
 * Validates a webhook signature from Clerk
 */
export async function verifyClerkWebhook(
	req: NextRequest,
	secret: string | undefined
): Promise<boolean> {
	if (!secret) {
		console.error('Missing Clerk webhook secret')
		return false
	}

	// Get the signature headers
	const svix_id = req.headers.get('svix-id')
	const svix_timestamp = req.headers.get('svix-timestamp')
	const svix_signature = req.headers.get('svix-signature')

	if (!svix_id || !svix_timestamp || !svix_signature) {
		console.error('Missing Svix headers')
		return false
	}

	// Log the headers for debugging
	console.log('Webhook Headers:', {
		svix_id,
		svix_signature,
		svix_timestamp,
	})

	// Get the raw body
	const payload = await req.text()
	const signaturePayload = `${svix_id}.${svix_timestamp}.${payload}`

	// Clerk signatures are in the format "v1,signature1 v1,signature2"
	const signatures = svix_signature.split(' ')

	for (const sig of signatures) {
		// Format is "version,signature"
		const [version, signature] = sig.split(',')

		if (!signature || !version) {
			continue
		}

		try {
			// Create HMAC with the secret
			const hmac = crypto.createHmac('sha256', secret)
			hmac.update(signaturePayload)
			const digest = hmac.digest('base64')

			console.log('Verification attempt:', {
				computedSignature: digest,
				expectedSignature: signature,
				version,
			})

			// Simple string comparison
			if (signature === digest) {
				return true
			}
		} catch (error) {
			console.error('Error in signature verification:', error)
		}
	}

	console.error('No matching signatures found')
	return false
}
