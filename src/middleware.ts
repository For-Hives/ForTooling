// src/middleware.ts
import { ensureUserAndOrgSync } from '@/app/actions/services/clerk-sync/syncMiddleware'
import {
	clerkClient,
	clerkMiddleware,
	createRouteMatcher,
} from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/app(.*)'])

const isPublicRoute = createRouteMatcher([
	'/',
	'/pricing(.*)',
	'/legals(.*)',
	'/marketing-components(.*)',
	'/sign-in(.*)',
	'/sign-up(.*)',
	'/api(.*)',
	'/invitation(.*)',
	'/onboarding(.*)',
	'/create-organization(.*)',
	'/waitlist(.*)',
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

// Exclude webhook routes from sync middleware to prevent circular dependencies
const isWebhookRoute = createRouteMatcher(['/api/webhook/(.*)'])

export default clerkMiddleware(async (auth, req) => {
	// For webhook routes, bypass sync to prevent loops
	if (isWebhookRoute(req)) {
		return
	}

	// Always allow public routes without additional checks
	if (isPublicRoute(req)) {
		return
	}

	try {
		// Get auth data
		const authAwaited = await auth()
		console.log('authAwaited', authAwaited)
		// Handle protected routes - redirect to sign-in if not authenticated
		if (isProtectedRoute(req) && !authAwaited.userId) {
			return NextResponse.redirect(new URL('/sign-in', req.url))
		}

		// Handle admin routes - redirect to home if not admin
		if (isAdminRoute(req) && authAwaited.orgRole !== 'admin') {
			return NextResponse.redirect(new URL('/', req.url))
		}

		// Redirect to onboarding if no org is selected
		if (isProtectedRoute(req) && !authAwaited.orgId) {
			return NextResponse.redirect(new URL('/onboarding', req.url))
		}

		// Only proceed with sync if we have both userId and orgId
		if (isProtectedRoute(req) && authAwaited.userId && authAwaited.orgId) {
			try {
				console.log('Ensuring user and org sync')
				console.log(authAwaited.userId, authAwaited.orgId)
				await ensureUserAndOrgSync(authAwaited.userId, authAwaited.orgId)
			} catch (syncError) {
				console.error('Sync error in middleware:', syncError)
				// Continue with the request even if sync fails
			}

			// Check onboarding status
			try {
				const clerkClientInstance = await clerkClient()
				const userMetadata = await clerkClientInstance.users.getUser(
					authAwaited.userId
				)

				if (!userMetadata?.publicMetadata?.hasCompletedOnboarding) {
					return NextResponse.redirect(new URL('/onboarding', req.url))
				}
			} catch (metadataError) {
				console.error('Error checking user metadata:', metadataError)
				// Allow the request to continue if metadata check fails
			}

			// Protect the route if all checks pass
			await auth.protect()
		}
	} catch (error) {
		console.error('Critical middleware error:', error)
		// For critical errors, redirect to sign-in as a safe fallback
		return NextResponse.redirect(new URL('/sign-in', req.url))
	}
})

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
}
