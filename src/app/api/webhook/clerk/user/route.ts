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
		const clone = req.clone()
		const body = await clone.json()
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
