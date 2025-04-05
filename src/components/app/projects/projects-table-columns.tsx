'use client'

// Import the Project interface
import { Project } from '@/app/actions/services/pocketbase/api_client/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { EllipsisIcon, PencilIcon, TrashIcon } from 'lucide-react'

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
	if (!dateString) return 'Not set'

	try {
		const date = new Date(dateString)
		return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid date'
	} catch {
		return 'Invalid date'
	}
}

export const projectColumns: ColumnDef<Project>[] = [
	// Selection column
	{
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={value => row.toggleSelected(!!value)}
				aria-label='Select row'
			/>
		),
		enableHiding: false,
		enableSorting: false,
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
			/>
		),
		id: 'select',
	},
	// Project name column
	{
		accessorKey: 'name',
		cell: ({ row }) => (
			<div className='font-medium'>{row.getValue('name')}</div>
		),
		header: 'Project Name',
	},
	// Project address column
	{
		accessorKey: 'address',
		cell: ({ row }) => {
			const address = row.getValue('address') as string
			return address ? (
				<div>{address}</div>
			) : (
				<div className='text-muted-foreground'>No address</div>
			)
		},
		header: 'Address',
	},
	// Project status column (derived from dates)
	{
		cell: ({ row }) => {
			const active = isProjectActive(row.original)
			return (
				<Badge
					className={
						active
							? 'bg-green-500/20 text-green-700 hover:bg-green-500/20'
							: 'bg-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/20'
					}
				>
					{active ? 'Active' : 'Inactive'}
				</Badge>
			)
		},
		header: 'Status',
		id: 'status',
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
		header: 'Start Date',
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
		header: 'End Date',
	},
	// Actions column
	{
		cell: () => {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<EllipsisIcon className='h-4 w-4' />
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
			)
		},
		id: 'actions',
	},
]
