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

	if (isPublicRoute(req)) {
		return
	}

	const authAwaited = await auth()

	if (isProtectedRoute(req)) {
		if (!authAwaited.userId) {
			return NextResponse.redirect(new URL('/sign-in', req.url))
		}
	}

	if (isAdminRoute(req)) {
		const userData = authAwaited.orgRole
		if (userData !== 'admin') {
			return NextResponse.redirect(new URL('/', req.url))
		}
	}

	if (!authAwaited.orgId) {
		return NextResponse.redirect(new URL('/onboarding', req.url))
	}

	// Synchronize user and organization data
	try {
		// Only perform sync for protected routes and non-webhook routes
		if (isProtectedRoute(req) && !isWebhookRoute(req)) {
			await ensureUserAndOrgSync(authAwaited.userId, authAwaited.orgId)
		}
	} catch (error) {
		console.error('Sync error in middleware:', error)
		// Continue with the request even if sync fails
		// This prevents the application from being unusable if sync fails
	}

	const clerkClientInstance = await clerkClient()
	const userMetadata = await clerkClientInstance.users.getUser(
		authAwaited.userId
	)

	if (
		isProtectedRoute(req) &&
		!userMetadata?.publicMetadata?.hasCompletedOnboarding
	) {
		return NextResponse.redirect(new URL('/onboarding', req.url))
	}

	if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
}
