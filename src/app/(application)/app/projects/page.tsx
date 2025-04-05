import { getDataUserAndOrg } from '@/app/actions/services/getDataUserAndOrg'
import { getOrganizationProjects } from '@/app/actions/services/pocketbase/projectService'
import { ProjectsTable } from '@/components/app/projects/projects-table'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'

// Projects title component
function ProjectsHeader() {
	return (
		<div className='mb-8'>
			<h1 className='text-3xl font-bold tracking-tight'>Mes projets</h1>
			<p className='text-muted-foreground mt-2 text-sm'>
				Gérer vos projets, vos chantiers, et afficher leurs détails.
				<br />
				Les éléments ici correspondents à des endroits, des bâtiments, des
				étages, des salles, ils pourront être assignés à des équipements plus
				tard.
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
	// Fetch the projects data
	const { pbOrg, pbUser } = await getDataUserAndOrg()

	if (!pbOrg || !pbUser) {
		return <div>Aucune organisation ou utilisateur trouvé</div>
	}

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
		<div className='w-full py-6'>
			<ProjectsHeader />
			<Suspense fallback={<ProjectsTableSkeleton />}>
				<ProjectsContent />
			</Suspense>
		</div>
	)
}
