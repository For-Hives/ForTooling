import { createOrUpdateUserByClerkId } from '@/app/actions/services/pocketbase/app_user_service'
import { createOrUpdateOrganizationUserMapping } from '@/app/actions/services/pocketbase/organization_app_user_service'
import {
	createOrUpdateOrganizationByClerkId,
	findOrganizationByClerkId,
} from '@/app/actions/services/pocketbase/organization_service'
import { auth, currentUser } from '@clerk/nextjs/server'

interface ClerkUserWithOrg {
	id: string
	firstName: string | null
	lastName: string | null
	emailAddresses: Array<{ emailAddress: string }>
	organizationMemberships: Array<{
		role: string
		organization: {
			id: string
			name: string
		}
	}>
}

export async function getDataUserAndOrg() {
	// Get the current organization ID and user from Clerk
	const { orgId } = await auth()
	const clerkUser = await currentUser()

	if (!orgId || !clerkUser) {
		throw new Error('No active organization or user found')
	}

	// Cast to our extended type, but with safety checks (we know it's a ClerkUserWithOrg, but, sometime, clerk returns a different type)
	const user = clerkUser as unknown as Partial<ClerkUserWithOrg>

	// Ensure the user record exists in PocketBase, normally, this should not happen, but, sometimes, it does...
	// the middleware should prevent this, but, sometimes, it does not... :)
	const pbUser = await createOrUpdateUserByClerkId(user.id!, {
		email: user.emailAddresses?.[0]?.emailAddress || '',
		metadata: {
			createdAt: new Date().toISOString(),
			lastActiveAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
	})

	// Get or create the organization record in PocketBase
	let pbOrg = await findOrganizationByClerkId(orgId)
	if (!pbOrg) {
		// Create the organization in PocketBase with a default name
		// since we might not have access to memberships
		pbOrg = await createOrUpdateOrganizationByClerkId(orgId, {
			name: 'My Organization',
		})
	}

	// Ensure the user is properly linked to the organization with a default role
	// since we might not have access to the actual role
	if (pbOrg) {
		await createOrUpdateOrganizationUserMapping(pbUser.id, pbOrg.id, 'member')
	}

	return { pbOrg, pbUser }
}
