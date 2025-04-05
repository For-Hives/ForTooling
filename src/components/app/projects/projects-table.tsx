'use client'

import { Project } from '@/app/actions/services/pocketbase/api_client/types'
import { projectColumns } from '@/components/app/projects/projects-table-columns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from '@/components/ui/pagination'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
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
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	Plus,
	SearchIcon,
	ChevronFirstIcon,
	ChevronLastIcon,
	SlidersHorizontal,
	Calendar,
	X,
} from 'lucide-react'
import { useState } from 'react'

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

	// Date range state
	const [startDateRange, setStartDateRange] = useState<Date | undefined>(
		undefined
	)
	const [endDateRange, setEndDateRange] = useState<Date | undefined>(undefined)

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

	// Apply date range filter
	const applyDateFilter = () => {
		// If both dates are set, filter by date range
		if (startDateRange && endDateRange) {
			table
				.getColumn('startDate')
				?.setFilterValue([
					startDateRange.toISOString(),
					endDateRange.toISOString(),
				])
		} else {
			// Clear filter if dates are not set
			table.getColumn('startDate')?.setFilterValue(undefined)
		}
	}

	// Reset date filter
	const resetDateFilter = () => {
		setStartDateRange(undefined)
		setEndDateRange(undefined)
		table.getColumn('startDate')?.setFilterValue(undefined)
	}

	// Handle status filter
	const handleStatusFilterChange = (value: string) => {
		if (value === 'all') {
			table.getColumn('status')?.setFilterValue(undefined)
		} else {
			table
				.getColumn('status')
				?.setFilterValue(value === 'active' ? true : false)
		}
	}

	return (
		<div className='space-y-4'>
			{/* Table header with filters and actions */}
			<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
				<div className='flex flex-1 flex-col gap-4 md:flex-row md:items-center md:space-x-2'>
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

					{/* Status Filter */}
					<Select onValueChange={handleStatusFilterChange} defaultValue='all'>
						<SelectTrigger className='w-full md:w-[180px]'>
							<SelectValue placeholder='Filtrer par statut' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>Tous les statuts</SelectItem>
							<SelectItem value='active'>Actifs</SelectItem>
							<SelectItem value='inactive'>Inactifs</SelectItem>
						</SelectContent>
					</Select>

					{/* Date Range Filter */}
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant='outline'
								className='w-full justify-start text-left font-normal md:w-[240px]'
							>
								<Calendar className='mr-2 h-4 w-4' />
								{startDateRange && endDateRange ? (
									<span>
										{format(startDateRange, 'dd/MM/yyyy')} -{' '}
										{format(endDateRange, 'dd/MM/yyyy')}
									</span>
								) : (
									<span>Filtrer par date</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent className='w-full p-0' align='start'>
							<div className='p-4 pb-0'>
								<div className='space-y-2'>
									<h4 className='text-sm font-medium'>Période de début</h4>
									<CalendarComponent
										mode='single'
										selected={startDateRange}
										onSelect={setStartDateRange}
										initialFocus
										locale={fr}
									/>
								</div>
								<div className='space-y-2 pt-4'>
									<h4 className='text-sm font-medium'>Période de fin</h4>
									<CalendarComponent
										mode='single'
										selected={endDateRange}
										onSelect={setEndDateRange}
										initialFocus
										locale={fr}
										disabled={date =>
											startDateRange ? date < startDateRange : false
										}
									/>
								</div>
								<div className='flex items-center gap-2 pt-4 pb-4'>
									<Button
										variant='secondary'
										className='w-full'
										onClick={applyDateFilter}
										disabled={!startDateRange || !endDateRange}
									>
										Appliquer
									</Button>
									<Button
										variant='outline'
										className='w-full'
										onClick={resetDateFilter}
										disabled={!startDateRange && !endDateRange}
									>
										Réinitialiser
									</Button>
								</div>
							</div>
						</PopoverContent>
					</Popover>
				</div>

				<div className='flex items-center gap-2'>
					{/* Column Visibility */}
					<Popover>
						<PopoverTrigger asChild>
							<Button variant='outline' size='sm' className='h-8'>
								<SlidersHorizontal className='mr-2 h-4 w-4' />
								Colonnes
							</Button>
						</PopoverTrigger>
						<PopoverContent className='w-[200px] p-0' align='end'>
							<div className='p-2'>
								<div className='flex items-center justify-between p-1'>
									<Label className='text-xs font-medium'>Visibilité</Label>
									<Button
										onClick={() => setColumnVisibility({})}
										variant='ghost'
										className='h-8 px-2 text-xs'
									>
										Tout afficher
									</Button>
								</div>
								<Separator className='my-1' />
								<div className='space-y-2 py-2'>
									{table
										.getAllColumns()
										.filter(column => column.getCanHide())
										.map(column => {
											return (
												<div key={column.id} className='flex items-center px-1'>
													<Checkbox
														checked={column.getIsVisible()}
														onCheckedChange={value => {
															column.toggleVisibility(!!value)
														}}
														id={`column-${column.id}`}
													/>
													<Label
														htmlFor={`column-${column.id}`}
														className='ml-2 text-xs'
													>
														{column.id === 'name'
															? 'Nom du projet'
															: column.id === 'status'
																? 'Statut'
																: column.id === 'address'
																	? 'Adresse'
																	: column.id === 'startDate'
																		? 'Date de début'
																		: column.id === 'endDate'
																			? 'Date de fin'
																			: column.id === 'actions'
																				? 'Actions'
																				: column.id}
													</Label>
												</div>
											)
										})}
								</div>
							</div>
						</PopoverContent>
					</Popover>

					<Button>
						<Plus className='mr-2 h-4 w-4' />
						Ajouter un projet
					</Button>
				</div>
			</div>

			{/* Display active filters */}
			{(columnFilters.length > 0 || startDateRange || endDateRange) && (
				<div className='flex flex-wrap gap-2'>
					<div className='text-muted-foreground mr-2 flex items-center text-sm'>
						Filtres actifs:
					</div>
					{columnFilters.map(filter => {
						if (filter.id === 'status') {
							return (
								<Badge
									key={filter.id}
									variant='outline'
									className='flex items-center gap-1'
								>
									Statut: {filter.value ? 'Actifs' : 'Inactifs'}
									<Button
										variant='ghost'
										onClick={() =>
											table.getColumn('status')?.setFilterValue(undefined)
										}
										className='h-4 w-4 p-0 hover:bg-transparent'
									>
										<X className='h-3 w-3' />
									</Button>
								</Badge>
							)
						}
						return null
					})}
					{startDateRange && endDateRange && (
						<Badge variant='outline' className='flex items-center gap-1'>
							Dates: {format(startDateRange, 'dd/MM/yyyy')} -{' '}
							{format(endDateRange, 'dd/MM/yyyy')}
							<Button
								variant='ghost'
								onClick={resetDateFilter}
								className='h-4 w-4 p-0 hover:bg-transparent'
							>
								<X className='h-3 w-3' />
							</Button>
						</Badge>
					)}
				</div>
			)}

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
