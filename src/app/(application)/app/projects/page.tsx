import { createOrUpdateUserByClerkId } from '@/app/actions/services/pocketbase/app_user_service'
import { createOrUpdateOrganizationUserMapping } from '@/app/actions/services/pocketbase/organization_app_user_service'
import {
	createOrUpdateOrganizationByClerkId,
	findOrganizationByClerkId,
} from '@/app/actions/services/pocketbase/organization_service'
import { getOrganizationProjects } from '@/app/actions/services/pocketbase/projectService'
import { ProjectsTable } from '@/components/app/projects/projects-table'
import { Skeleton } from '@/components/ui/skeleton'
import { auth, currentUser } from '@clerk/nextjs/server'
import { Suspense } from 'react'

// Extended type for Clerk user with organizationMemberships
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

// Projects title component
function ProjectsHeader() {
	return (
		<div className='mb-8'>
			<h1 className='text-3xl font-bold tracking-tight'>Projects</h1>
			<p className='text-muted-foreground mt-2 text-sm'>
				Manage your organization&apos;s projects and view their details.
			</p>
		</div>
	)
}

// Loading state for the projects table
function ProjectsTableSkeleton() {
	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<Skeleton className='h-10 w-64' />
				<Skeleton className='h-10 w-24' />
			</div>
			<Skeleton className='h-[400px] w-full' />
			<div className='flex items-center justify-between'>
				<Skeleton className='h-10 w-44' />
				<Skeleton className='h-10 w-48' />
			</div>
		</div>
	)
}

// Projects content component that fetches and displays projects
async function ProjectsContent() {
	// Get the current organization ID and user from Clerk
	const { orgId } = await auth()
	const clerkUser = await currentUser()

	if (!orgId || !clerkUser) {
		throw new Error('No active organization or user found')
	}

	// Cast to our extended type, but with safety checks
	const user = clerkUser as unknown as Partial<ClerkUserWithOrg>

	// Ensure the user record exists in PocketBase
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
	await createOrUpdateOrganizationUserMapping(pbUser.id, pbOrg.id, 'member')

	// Fetch the projects data
	const projects = await getOrganizationProjects(pbOrg.id)

	return (
		<div>
			<ProjectsTable data={projects} />
		</div>
	)
}

// Main Projects page component
export default function ProjectsPage() {
	return (
		<div className='container py-6'>
			<ProjectsHeader />
			<Suspense fallback={<ProjectsTableSkeleton />}>
				<ProjectsContent />
			</Suspense>
		</div>
	)
}
