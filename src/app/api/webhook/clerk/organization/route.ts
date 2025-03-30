import { createOrganization } from '@/app/actions/services/pocketbase/organizationService'
import { verifyClerkWebhook } from '@/lib/webhookUtils'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Handles webhook events from Clerk related to organizations
 */
export async function POST(req: NextRequest) {
	// Verify webhook signature
	const isValid = await verifyClerkWebhook(
		req,
		process.env.CLERK_WEBHOOK_SECRET_ORGANIZATION
	)

	if (!isValid) {
		console.error('Invalid webhook signature for organization event')
		return new NextResponse('Invalid signature', { status: 401 })
	}

	try {
		// Get the request body (clone request since body was consumed by verification)
		const clone = req.clone()
		const body = await clone.json()
		const { data, type } = body

		console.log(`Processing organization webhook: ${type}`)

		// Handle different organization events
		switch (type) {
			case 'organization.created':
				await handleOrganizationCreated(data)
				break
			case 'organization.updated':
				await handleOrganizationUpdated(data)
				break
			case 'organization.deleted':
				await handleOrganizationDeleted(data)
				break
			default:
				console.log(`Unhandled organization event type: ${type}`)
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error processing organization webhook:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

/**
 * Handles organization creation event
 */
async function handleOrganizationCreated(data: any) {
	const { id: clerkId, logo_url, name, public_metadata, slug } = data

	console.log(`Organization created: ${clerkId} (${name})`)

	try {
		await createOrganization({
			clerkId,
			logoUrl: logo_url,
			name,
			publicMetadata: public_metadata || {},
			slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
		})

		console.log(`Successfully created organization in PocketBase: ${clerkId}`)
	} catch (error) {
		console.error(
			`Failed to create organization in PocketBase: ${clerkId}`,
			error
		)
		throw error
	}
}

/**
 * Handles organization update event
 */
async function handleOrganizationUpdated(data: any) {
	const { id: clerkId, image_url, logo_url, name, public_metadata, slug } = data

	console.log(`Organization updated: ${clerkId} (${name})`)

	try {
		const organization = await organizationService.findByClerkId(clerkId)

		if (!organization) {
			console.error(
				`Organization not found in PocketBase for clerkId: ${clerkId}`
			)
			return
		}

		await organizationService.updateOrganization(organization.id, {
			imageUrl: image_url,
			logoUrl: logo_url,
			name,
			publicMetadata: public_metadata || {},
			slug,
		})

		console.log(`Successfully updated organization in PocketBase: ${clerkId}`)
	} catch (error) {
		console.error(
			`Failed to update organization in PocketBase: ${clerkId}`,
			error
		)
		throw error
	}
}

/**
 * Handles organization deletion event
 */
async function handleOrganizationDeleted(data: any) {
	const { id: clerkId } = data

	console.log(`Organization deleted: ${clerkId}`)

	try {
		const organization = await organizationService.findByClerkId(clerkId)

		if (!organization) {
			console.log(
				`Organization not found in PocketBase for clerkId: ${clerkId}`
			)
			return
		}

		await organizationService.softDeleteOrganization(organization.id)

		console.log(
			`Successfully marked organization as deleted in PocketBase: ${clerkId}`
		)
	} catch (error) {
		console.error(
			`Failed to mark organization as deleted in PocketBase: ${clerkId}`,
			error
		)
		throw error
	}
}
