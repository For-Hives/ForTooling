'use client'

import { Project } from '@/app/actions/services/pocketbase/api_client/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from '@/components/ui/pagination'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table'
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	Plus,
	SearchIcon,
	ChevronFirstIcon,
	ChevronLastIcon,
} from 'lucide-react'
import { useState } from 'react'

import { projectColumns } from './projects-table-columns'

interface ProjectsTableProps {
	data: Project[]
	pageCount?: number
}

export function ProjectsTable({ data }: ProjectsTableProps) {
	// Table state
	const [sorting, setSorting] = useState<SortingState>([
		{
			desc: false,
			id: 'name',
		},
	])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [searchQuery, setSearchQuery] = useState('')

	// Initialize the table
	const table = useReactTable({
		columns: projectColumns,
		data,
		enableRowSelection: false,
		getCoreRowModel: getCoreRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		globalFilterFn: (row, columnId, filterValue) => {
			const safeValue = (() => {
				const val = row.getValue(columnId)
				return typeof val === 'string'
					? val.toLowerCase()
					: String(val).toLowerCase()
			})()

			return safeValue.includes(filterValue.toLowerCase())
		},
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onGlobalFilterChange: setSearchQuery,
		onSortingChange: setSorting,
		state: {
			columnFilters,
			columnVisibility,
			globalFilter: searchQuery,
			sorting,
		},
	})

	return (
		<div className='space-y-4'>
			{/* Table header with filters and actions */}
			<div className='flex items-center justify-between'>
				<div className='flex flex-1 items-center space-x-2'>
					<div className='relative w-full md:w-80'>
						<SearchIcon className='text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4' />
						<Input
							type='search'
							placeholder='Rechercher un projet...'
							className='w-full rounded-md pl-8'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>
				<div className='flex items-center space-x-2'>
					<Button>
						<Plus className='mr-2 h-4 w-4' />
						Ajouter un projet
					</Button>
				</div>
			</div>

			{/* Table */}
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<TableHead key={header.id} className='whitespace-nowrap'>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={projectColumns.length}
									className='h-24 text-center'
								>
									Aucun projet trouvé.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Label htmlFor='perPage'>Lignes par page</Label>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={value => {
							table.setPageSize(Number(value))
						}}
					>
						<SelectTrigger id='perPage' className='h-8 w-[70px]'>
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side='top'>
							{[5, 10, 20, 30, 40, 50].map(pageSize => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className='flex items-center justify-end space-x-6'>
					<div className='flex flex-nowrap items-center justify-center text-sm font-medium'>
						Page&nbsp;{table.getState().pagination.pageIndex + 1}&nbsp;sur&nbsp;
						{table.getPageCount()}
					</div>
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<Button
									variant='outline'
									className='hidden h-8 w-8 p-0 lg:flex'
									onClick={() => table.setPageIndex(0)}
									disabled={!table.getCanPreviousPage()}
								>
									<span className='sr-only'>Aller à la première page</span>
									<ChevronFirstIcon className='h-4 w-4' />
								</Button>
							</PaginationItem>
							<PaginationItem>
								<Button
									variant='outline'
									className='h-8 w-8 p-0'
									onClick={() => table.previousPage()}
									disabled={!table.getCanPreviousPage()}
								>
									<span className='sr-only'>Aller à la page précédente</span>
									<ChevronLeftIcon className='h-4 w-4' />
								</Button>
							</PaginationItem>
							<PaginationItem>
								<Button
									variant='outline'
									className='h-8 w-8 p-0'
									onClick={() => table.nextPage()}
									disabled={!table.getCanNextPage()}
								>
									<span className='sr-only'>Aller à la page suivante</span>
									<ChevronRightIcon className='h-4 w-4' />
								</Button>
							</PaginationItem>
							<PaginationItem>
								<Button
									variant='outline'
									className='hidden h-8 w-8 p-0 lg:flex'
									onClick={() => table.setPageIndex(table.getPageCount() - 1)}
									disabled={!table.getCanNextPage()}
								>
									<span className='sr-only'>Aller à la dernière page</span>
									<ChevronLastIcon className='h-4 w-4' />
								</Button>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>
		</div>
	)
}
