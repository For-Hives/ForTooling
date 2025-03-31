import {
	runFullReconciliation,
	reconcileSpecificUser,
	reconcileSpecificOrganization,
} from '@/app/actions/services/clerk-sync/reconciliation'
import { auth } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Admin endpoint to trigger data reconciliation
 * This endpoint is protected and requires either:
 * 1. Admin authentication
 * 2. A valid API key for automated tasks
 */
export async function POST(req: NextRequest) {
	// Security checks - either admin authentication or API key
	const isAuthenticated = await checkAuthentication(req)

	if (!isAuthenticated) {
		return new NextResponse('Unauthorized', { status: 401 })
	}

	try {
		const body = await req.json()
		const { organizationId, type, userId } = body

		// Run the appropriate reconciliation based on request type
		if (type === 'full') {
			const result = await runFullReconciliation()
			return NextResponse.json(result)
		} else if (type === 'user' && userId) {
			const result = await reconcileSpecificUser(userId)
			return NextResponse.json(result)
		} else if (type === 'organization' && organizationId) {
			const result = await reconcileSpecificOrganization(organizationId)
			return NextResponse.json(result)
		} else {
			return NextResponse.json(
				{
					error: 'Invalid reconciliation type or missing parameters',
					status: 'error',
				},
				{ status: 400 }
			)
		}
	} catch (error) {
		console.error('Reconciliation API error:', error)
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : 'Unknown error',
				status: 'error',
			},
			{ status: 500 }
		)
	}
}

/**
 * Checks if the request is authenticated
 * Accepts either an admin user or a valid API key
 *
 * @param req The incoming request
 * @returns Whether the request is authenticated
 */
async function checkAuthentication(): Promise<boolean> {
	// Option 1: Check admin user
	const { orgRole, userId } = await auth()

	if (userId && orgRole === 'admin') {
		return true
	}

	// Option 2: Check API key for automated tasks
	const headerPayload = await headers()
	const apiKey = headerPayload.get('x-api-key')

	if (apiKey && apiKey === process.env.INTERNAL_API_KEY) {
		return true
	}

	return false
}
