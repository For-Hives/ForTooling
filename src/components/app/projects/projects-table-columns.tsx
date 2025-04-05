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
import { ColumnDef, Row } from '@tanstack/react-table'
import { format, isValid } from 'date-fns'
import {
	ChevronDown,
	ChevronUp,
	EllipsisVerticalIcon,
	PencilIcon,
	TrashIcon,
} from 'lucide-react'

/**
 * Determines if a project is active based on its dates
 */
export function isProjectActive(project: Project): boolean {
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

// Custom sorting function for status column
const sortStatusFn = (rowA: Row<Project>, rowB: Row<Project>) => {
	const statusA = isProjectActive(rowA.original) ? 1 : 0
	const statusB = isProjectActive(rowB.original) ? 1 : 0
	return statusA - statusB
}

// Custom sorting function for dates
const sortDateFn = (
	rowA: Row<Project>,
	rowB: Row<Project>,
	columnId: string
) => {
	const dateA = rowA.getValue(columnId)
		? new Date(rowA.getValue(columnId))
		: null
	const dateB = rowB.getValue(columnId)
		? new Date(rowB.getValue(columnId))
		: null

	// Handle null values - push them to the end
	if (!dateA && !dateB) return 0
	if (!dateA) return 1
	if (!dateB) return -1

	// Regular date comparison
	return dateA.getTime() - dateB.getTime()
}

// Add custom filter function for the status column
export const filterStatus = (row: Row<Project>, id: string, value: boolean) => {
	const isActive = isProjectActive(row.original)
	return value === isActive
}

// Add custom filter function for date range
export const filterDateRange = (
	row: Row<Project>,
	id: string,
	value: [string, string]
) => {
	// Parse the date strings to Date objects
	const [start, end] = value
	const startDate = new Date(start)
	const endDate = new Date(end)

	// Get the row's date value
	const rowDate = row.getValue(id) ? new Date(row.getValue(id)) : null

	// If no date in the row, it doesn't match
	if (!rowDate) return false

	// Check if date falls within range
	return rowDate >= startDate && rowDate <= endDate
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
		enableHiding: true,
		filterFn: filterStatus,
		header: ({ column }) => (
			<div className='ml-2 flex items-center justify-start'>
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='p-0 hover:bg-transparent'
				>
					<span>Statut</span>
					{column.getIsSorted() === 'asc' ? (
						<ChevronUp className='ml-1 h-4 w-4' />
					) : column.getIsSorted() === 'desc' ? (
						<ChevronDown className='ml-1 h-4 w-4' />
					) : null}
				</Button>
			</div>
		),
		id: 'status',
		sortDescFirst: true,
		sortingFn: sortStatusFn,
	},
	// Project name column
	{
		accessorKey: 'name',
		cell: ({ row }) => (
			<div className='font-medium'>{row.getValue('name')}</div>
		),
		enableHiding: true,
		header: ({ column }) => (
			<Button
				variant='ghost'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				className='p-0 hover:bg-transparent'
			>
				Nom du projet
				{column.getIsSorted() === 'asc' ? (
					<ChevronUp className='ml-1 h-4 w-4' />
				) : column.getIsSorted() === 'desc' ? (
					<ChevronDown className='ml-1 h-4 w-4' />
				) : null}
			</Button>
		),
		sortDescFirst: false,
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
		enableHiding: true,
		header: ({ column }) => (
			<Button
				variant='ghost'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				className='p-0 hover:bg-transparent'
			>
				Adresse
				{column.getIsSorted() === 'asc' ? (
					<ChevronUp className='ml-1 h-4 w-4' />
				) : column.getIsSorted() === 'desc' ? (
					<ChevronDown className='ml-1 h-4 w-4' />
				) : null}
			</Button>
		),
		sortDescFirst: false,
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
		enableHiding: true,
		filterFn: filterDateRange,
		header: ({ column }) => (
			<Button
				variant='ghost'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				className='p-0 hover:bg-transparent'
			>
				Date de début
				{column.getIsSorted() === 'asc' ? (
					<ChevronUp className='ml-1 h-4 w-4' />
				) : column.getIsSorted() === 'desc' ? (
					<ChevronDown className='ml-1 h-4 w-4' />
				) : null}
			</Button>
		),
		sortingFn: (rowA, rowB, columnId) => sortDateFn(rowA, rowB, columnId),
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
		enableHiding: true,
		header: ({ column }) => (
			<Button
				variant='ghost'
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				className='p-0 hover:bg-transparent'
			>
				Date de fin
				{column.getIsSorted() === 'asc' ? (
					<ChevronUp className='ml-1 h-4 w-4' />
				) : column.getIsSorted() === 'desc' ? (
					<ChevronDown className='ml-1 h-4 w-4' />
				) : null}
			</Button>
		),
		sortingFn: (rowA, rowB, columnId) => sortDateFn(rowA, rowB, columnId),
		sortUndefined: 'last', // Move undefined/null values to end
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
		enableHiding: true,
		enableSorting: false,
		header: () => (
			<div className='mr-3 flex items-center justify-end'>
				<p>Actions</p>
			</div>
		),
		id: 'actions',
	},
]
