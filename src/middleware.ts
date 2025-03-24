import {
	clerkClient,
	clerkMiddleware,
	createRouteMatcher,
} from '@clerk/nextjs/server'
const isProtectedRoute = createRouteMatcher(['/app(.*)'])

const isPublicRoute = createRouteMatcher([
	'/',
	'/sign-in(.*)',
	'/sign-up(.*)',
	'/api(.*)',
	'/invitation(.*)',
	'/onboarding(.*)',
	'/create-organization(.*)',
	'/waitlist(.*)',
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
	if (isPublicRoute(req)) {
		return
	}

	const authAwaited = await auth()
	if (!authAwaited.userId) {
		return Response.redirect(new URL('/sign-in', req.url))
	}

	if (isAdminRoute(req)) {
		const userData = authAwaited.orgRole
		if (userData !== 'admin') {
			return Response.redirect(new URL('/', req.url))
		}
	}

	if (!authAwaited.orgId) {
		return Response.redirect(new URL('/onboarding', req.url))
	}

	const clerkClientInstance = await clerkClient()
	const userMetadata = await clerkClientInstance.users.getUser(
		authAwaited.userId
	)

	console.log(userMetadata)
	if (
		isProtectedRoute(req) &&
		!userMetadata?.publicMetadata?.hasCompletedOnboarding
	) {
		return Response.redirect(new URL('/onboarding', req.url))
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
