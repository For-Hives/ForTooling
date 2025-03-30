import * as crypto from 'crypto'
import { NextRequest } from 'next/server'

/**
 * Validates a webhook signature from Clerk - simplified version
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

	// Get the raw body
	const payload = await req.text()
	const signaturePayload = `${svix_id}.${svix_timestamp}.${payload}`

	// Verify signatures
	const expectedSignatures = svix_signature.split(' ')
	const signatures = expectedSignatures.map(sig => {
		const [version, signature] = sig.split(',')
		return { signature, version }
	})

	// Check if any signature matches
	return signatures.some(({ signature }) => {
		try {
			const hmac = crypto.createHmac('sha256', secret)
			hmac.update(signaturePayload)
			const digest = hmac.digest('hex')
			return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
		} catch (error) {
			console.error('Error verifying signature:', error)
			return false
		}
	})
}
