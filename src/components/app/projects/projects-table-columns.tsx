'use client'

// Import the Project interface
import { Project } from '@/app/actions/services/pocketbase/api_client/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ColumnDef } from '@tanstack/react-table'
import { format, isValid } from 'date-fns'
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react'

/**
 * Determines if a project is active based on its dates
 */
function isProjectActive(project: Project): boolean {
	const now = new Date()
	const startDate = project.startDate ? new Date(project.startDate) : null
	const endDate = project.endDate ? new Date(project.endDate) : null

	if (!startDate) return false
	if (startDate > now) return false
	if (endDate && endDate < now) return false

	return true
}

/**
 * Format a date string to a readable format using date-fns
 */
function formatDate(dateString: string | null | undefined): string {
	if (!dateString) return 'Non renseigné'

	try {
		// format in french
		const date = new Date(dateString)
		return isValid(date) ? format(date, 'd MMMM yyyy') : 'Date invalide'
	} catch {
		return 'Date invalide'
	}
}

export const projectColumns: ColumnDef<Project>[] = [
	// Project status column (derived from dates)
	{
		cell: ({ row }) => {
			const active = isProjectActive(row.original)
			return (
				<div className='ml-2'>
					<Badge
						className={
							active
								? 'bg-green-500/20 text-green-700 hover:bg-green-500/20'
								: 'bg-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/20'
						}
					>
						{active ? 'Actif' : 'Inactif'}
					</Badge>
				</div>
			)
		},
		header: () => (
			<div className='ml-2 flex items-center justify-start'>
				<p>Statut</p>
			</div>
		),
		id: 'status',
		sortDescFirst: true,
	},
	// Project name column
	{
		accessorKey: 'name',
		cell: ({ row }) => (
			<div className='font-medium'>{row.getValue('name')}</div>
		),
		header: 'Nom du projet',
		sortDescFirst: true,
	},
	// Project address column
	{
		accessorKey: 'address',
		cell: ({ row }) => {
			const address = row.getValue('address') as string
			return address ? (
				<div>{address}</div>
			) : (
				<div className='text-muted-foreground'>Pas d&apos;adresse</div>
			)
		},
		header: 'Adresse',
	},
	// Start date column
	{
		accessorKey: 'startDate',
		cell: ({ row }) => {
			const startDate = row.getValue('startDate') as string
			return (
				<div className={!startDate ? 'text-muted-foreground' : ''}>
					{formatDate(startDate)}
				</div>
			)
		},
		header: 'Date de début',
	},
	// End date column
	{
		accessorKey: 'endDate',
		cell: ({ row }) => {
			const endDate = row.getValue('endDate') as string
			return (
				<div className={!endDate ? 'text-muted-foreground' : ''}>
					{formatDate(endDate)}
				</div>
			)
		},
		header: 'Date de fin',
	},
	// Actions column
	{
		cell: () => {
			return (
				<div className='flex items-center justify-end'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' className='h-8 w-8 p-0'>
								<span className='sr-only'>Ouvrir le menu</span>
								<EllipsisVerticalIcon className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuGroup>
								<DropdownMenuItem>
									<PencilIcon className='mr-2 h-4 w-4' />
									<span>Edit Project</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<span>View Assignments</span>
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem className='text-destructive focus:text-destructive'>
								<TrashIcon className='mr-2 h-4 w-4' />
								<span>Delete Project</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			)
		},
		header: ({ table }) => (
			<div className='mr-3 flex items-center justify-end'>
				<p>Actions</p>
			</div>
		),
		id: 'actions',
	},
]
