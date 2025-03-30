import * as appUserService from '@/app/actions/services/pocketbase/app-user'
import { verifyClerkWebhook } from '@/lib/webhookUtils'
import { NextRequest, NextResponse } from 'next/server'
/**
 * Handles webhook events from Clerk related to users
 */
export async function POST(req: NextRequest) {
	console.log('Received Clerk webhook request')

	// Log the entire request for debugging
	console.log('req', req)

	const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

	// Verify the webhook signature
	const isValid = await verifyClerkWebhook(req, webhookSecret)
	console.log('isValid', isValid)

	if (!isValid) {
		console.error('Invalid webhook signature for user event')
		return new NextResponse('Unauthorized', { status: 401 })
	}

	try {
		// Get the webhook body
		const body = await req.json()
		console.log('Webhook body:', JSON.stringify(body, null, 2))

		// Process based on event type
		const { data, type } = body

		if (type.startsWith('user.')) {
			if (type === 'user.created') {
				const result = await appUserService.handleWebhookCreated(data, true)
				return NextResponse.json(result)
			} else if (type === 'user.updated') {
				const result = await appUserService.handleWebhookUpdated(data, true)
				return NextResponse.json(result)
			} else if (type === 'user.deleted') {
				const result = await appUserService.handleWebhookDeleted(data, true)
				return NextResponse.json(result)
			}
		}

		return NextResponse.json({
			message: `Unhandled event type: ${type}`,
			success: false,
		})
	} catch (error) {
		console.error('Error processing webhook:', error)
		return NextResponse.json(
			{ message: 'Error processing webhook', success: false },
			{ status: 500 }
		)
	}
}

/**
 * Handles user creation event
 */
async function handleUserCreated(data: any) {
	const {
		email_addresses,
		first_name,
		id: clerkId,
		last_name,
		profile_image_url,
		public_metadata,
	} = data

	// Find primary email
	const primaryEmail = email_addresses.find(
		(email: any) => email.id === data.primary_email_address_id
	)?.email_address

	console.log(`User created: ${clerkId} (${primaryEmail})`)

	try {
		await userService.createUser({
			clerkId,
			email: primaryEmail,
			firstName: first_name || '',
			lastName: last_name || '',
			profileImageUrl: profile_image_url,
			publicMetadata: public_metadata || {},
		})

		console.log(`Successfully created user in PocketBase: ${clerkId}`)
	} catch (error) {
		console.error(`Failed to create user in PocketBase: ${clerkId}`, error)
		throw error
	}
}

/**
 * Handles user update event
 */
async function handleUserUpdated(data: any) {
	const {
		email_addresses,
		first_name,
		id: clerkId,
		last_name,
		profile_image_url,
		public_metadata,
	} = data

	// Find primary email
	const primaryEmail = email_addresses.find(
		(email: any) => email.id === data.primary_email_address_id
	)?.email_address

	console.log(`User updated: ${clerkId} (${primaryEmail})`)

	try {
		const user = await userService.findByClerkId(clerkId)

		if (!user) {
			console.error(`User not found in PocketBase for clerkId: ${clerkId}`)
			return
		}

		await userService.updateUser(user.id, {
			email: primaryEmail,
			firstName: first_name || '',
			lastName: last_name || '',
			profileImageUrl: profile_image_url,
			publicMetadata: public_metadata || {},
		})

		console.log(`Successfully updated user in PocketBase: ${clerkId}`)
	} catch (error) {
		console.error(`Failed to update user in PocketBase: ${clerkId}`, error)
		throw error
	}
}

/**
 * Handles user deletion event
 */
async function handleUserDeleted(data: any) {
	const { id: clerkId } = data

	console.log(`User deleted: ${clerkId}`)

	try {
		const user = await userService.findByClerkId(clerkId)

		if (!user) {
			console.log(`User not found in PocketBase for clerkId: ${clerkId}`)
			return
		}

		await userService.softDeleteUser(user.id)

		console.log(`Successfully marked user as deleted in PocketBase: ${clerkId}`)
	} catch (error) {
		console.error(
			`Failed to mark user as deleted in PocketBase: ${clerkId}`,
			error
		)
		throw error
	}
}
