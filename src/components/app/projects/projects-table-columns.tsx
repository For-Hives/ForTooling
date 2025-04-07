'use client'

import { Project } from '@/app/actions/services/pocketbase/api_client/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ArrowDownIcon, ArrowUpIcon, MoreHorizontal } from 'lucide-react'

// Helper function to get sort icon
const getSortIcon = (sortState: false | 'asc' | 'desc') => {
	if (sortState === 'asc') {
		return <ArrowUpIcon className='ml-2 h-4 w-4' />
	}
	if (sortState === 'desc') {
		return <ArrowDownIcon className='ml-2 h-4 w-4' />
	}
	return null
}

export const projectColumns: ColumnDef<Project>[] = [
	{
		accessorKey: 'name',
		cell: ({ row }) => {
			const value = row.getValue('name')
			if (!value || typeof value !== 'string') return <span>-</span>
			return <span className='font-medium'>{value}</span>
		},
		enableHiding: false,
		enableSorting: true,
		header: ({ column }) => {
			return (
				<button
					className='hover:text-primary flex cursor-pointer items-center'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Nom du projet
					{getSortIcon(column.getIsSorted())}
				</button>
			)
		},
		maxSize: 300,
		minSize: 150,
		size: 200,
	},
	{
		accessorKey: 'status',
		cell: ({ row }) => {
			const startDate = row.getValue('startDate')
			const endDate = row.getValue('endDate')
			const now = new Date()
			const start = startDate ? new Date(startDate as string) : null
			const end = endDate ? new Date(endDate as string) : null
			const isActive = start && start <= now && (!end || end >= now)

			return (
				<Badge
					variant={isActive ? 'default' : 'secondary'}
					className={cn(
						'px-2 py-1 font-medium whitespace-nowrap',
						isActive
							? 'bg-green-100 text-green-800 hover:bg-green-100'
							: 'bg-gray-100 text-gray-600 hover:bg-gray-100'
					)}
				>
					{isActive ? 'Actif' : 'Inactif'}
				</Badge>
			)
		},
		enableHiding: false,
		enableSorting: true,
		header: ({ column }) => {
			return (
				<button
					className='hover:text-primary flex cursor-pointer items-center'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Statut
					{getSortIcon(column.getIsSorted())}
				</button>
			)
		},
		maxSize: 120,
		minSize: 80,
		size: 100,
	},
	{
		accessorKey: 'address',
		cell: ({ row }) => {
			const value = row.getValue('address')
			if (!value || typeof value !== 'string') return <span>-</span>
			return <span>{value}</span>
		},
		enableHiding: false,
		enableSorting: true,
		header: ({ column }) => {
			return (
				<button
					className='hover:text-primary flex cursor-pointer items-center'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Adresse
					{getSortIcon(column.getIsSorted())}
				</button>
			)
		},
		maxSize: 300,
		minSize: 150,
		size: 200,
	},
	{
		accessorKey: 'startDate',
		cell: ({ row }) => {
			const value = row.getValue('startDate')
			if (!value || typeof value !== 'string') return <span>-</span>
			const date = new Date(value)
			return (
				<span className='whitespace-nowrap'>
					{format(date, 'dd MMM yyyy', { locale: fr })}
				</span>
			)
		},
		enableHiding: false,
		enableSorting: true,
		header: ({ column }) => {
			return (
				<button
					className='hover:text-primary flex cursor-pointer items-center'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Date de début
					{getSortIcon(column.getIsSorted())}
				</button>
			)
		},
		maxSize: 180,
		minSize: 120,
		size: 140,
	},
	{
		accessorKey: 'endDate',
		cell: ({ row }) => {
			const value = row.getValue('endDate')
			if (!value || typeof value !== 'string') return <span>-</span>
			const date = new Date(value)
			return (
				<span className='whitespace-nowrap'>
					{format(date, 'dd MMM yyyy', { locale: fr })}
				</span>
			)
		},
		enableHiding: false,
		enableSorting: true,
		header: ({ column }) => {
			return (
				<button
					className='hover:text-primary flex cursor-pointer items-center'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Date de fin
					{getSortIcon(column.getIsSorted())}
				</button>
			)
		},
		maxSize: 180,
		minSize: 120,
		size: 140,
	},
	{
		accessorKey: 'notes',
		cell: ({ row }) => {
			const value = row.getValue('notes') as string | undefined
			if (!value)
				return <span className='text-muted-foreground italic'>Aucune note</span>

			// Tronquer le texte s'il est trop long
			const maxLength = 60
			const displayText =
				value.length > maxLength ? `${value.substring(0, maxLength)}...` : value

			return (
				<div className='max-w-md overflow-hidden text-ellipsis'>
					{displayText}
				</div>
			)
		},
		enableHiding: false,
		enableSorting: true,
		header: ({ column }) => {
			return (
				<button
					className='hover:text-primary flex cursor-pointer items-center'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Notes
					{getSortIcon(column.getIsSorted())}
				</button>
			)
		},
		maxSize: 400,
		minSize: 150,
		size: 250,
	},
	{
		accessorKey: 'toolCount',
		cell: ({ row }) => {
			// todo, this value is actually mocked
			const projectId = row.original.id || ''
			const stableRandomSeed = projectId
				.split('')
				.reduce((a, b) => a + b.charCodeAt(0), 0)
			const toolCount = (stableRandomSeed % 10) + 1 // Génère un nombre entre 1 et 10

			return (
				<div className='text-center'>
					<Badge variant='outline' className='px-2 py-1 font-medium'>
						{toolCount}
					</Badge>
				</div>
			)
		},
		enableHiding: false,
		enableSorting: true,
		header: ({ column }) => {
			return (
				<button
					className='hover:text-primary flex cursor-pointer items-center'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Équipements
					{getSortIcon(column.getIsSorted())}
				</button>
			)
		},
		maxSize: 150,
		minSize: 80,
		size: 120,
	},
	{
		cell: ({ row }) => {
			const project = row.original

			return (
				<div className='flex justify-end'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' className='h-8 w-8 p-0'>
								<span className='sr-only'>Ouvrir le menu</span>
								<MoreHorizontal className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuItem
								className='cursor-pointer'
								onClick={() => console.info('Voir', project.id)}
							>
								Voir le détail
							</DropdownMenuItem>
							<DropdownMenuItem
								className='cursor-pointer'
								onClick={() => console.info('Éditer', project.id)}
							>
								Modifier
							</DropdownMenuItem>
							<DropdownMenuItem
								className='cursor-pointer text-red-600'
								onClick={() => console.info('Supprimer', project.id)}
							>
								Supprimer
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			)
		},
		enableHiding: false,
		header: () => <div className='text-right'>Actions</div>,
		id: 'actions',
		maxSize: 100,
		minSize: 60,
		size: 80,
	},
]
