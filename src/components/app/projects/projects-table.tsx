'use client'

import { Project } from '@/app/actions/services/pocketbase/api_client/types'
import { projectColumns } from '@/components/app/projects/projects-table-columns'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range'
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
	ColumnDef,
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
	FilterFn,
} from '@tanstack/react-table'
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	Plus,
	SearchIcon,
	ChevronFirstIcon,
	ChevronLastIcon,
	SlidersHorizontal,
	Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

interface ProjectsTableProps {
	data: Project[]
	pageCount?: number
	onDeleteProjects?: (projects: Project[]) => Promise<void>
}

const getColumnDisplayName = (columnId: string): string => {
	switch (columnId) {
		case 'name':
			return 'Nom du projet'
		case 'status':
			return 'Statut'
		case 'address':
			return 'Adresse'
		case 'startDate':
			return 'Date de début'
		case 'endDate':
			return 'Date de fin'
		case 'actions':
			return 'Actions'
		default:
			return columnId
	}
}

// Custom filter function for date range filtering
const dateRangeFilter: FilterFn<Project> = (row, columnId, value) => {
	// Check if value is an array of date strings
	if (!Array.isArray(value) || value.length !== 2) return true

	// Get project dates
	const startDateStr = row.getValue('startDate') as string | undefined
	const endDateStr = row.getValue('endDate') as string | undefined

	// If no start date, don't filter this project
	if (!startDateStr) return false

	// Convert to Date objects
	const projectStart = new Date(startDateStr)
	const projectEnd = endDateStr ? new Date(endDateStr) : null

	// Get filter dates
	const [filterStartStr, filterEndStr] = value as [string, string]
	const filterStart = new Date(filterStartStr)
	const filterEnd = new Date(filterEndStr)

	// A project matches the filter if:
	// 1. Its start date is within the filter period
	const startInRange = projectStart >= filterStart && projectStart <= filterEnd

	// 2. Its end date is within the filter period
	const endInRange = projectEnd
		? projectEnd >= filterStart && projectEnd <= filterEnd
		: false

	// 3. The project encompasses the entire filter period (starts before and ends after)
	const projectEnclosesFilter =
		projectStart <= filterStart &&
		(projectEnd === null || projectEnd >= filterEnd)

	// Return true if any condition is true
	return startInRange || endInRange || projectEnclosesFilter
}

// Determine if a project is active based on its dates
const isProjectActive = (
	startDate: string | undefined,
	endDate: string | undefined
): boolean => {
	if (!startDate) return false

	const now = new Date()
	const start = new Date(startDate)
	const end = endDate ? new Date(endDate) : null

	return start <= now && (!end || end >= now)
}

export function ProjectsTable({ data, onDeleteProjects }: ProjectsTableProps) {
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
	const [rowSelection, setRowSelection] = useState({})

	// Date range state
	const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

	// Define columns with virtual columns for filtering
	const columns: ColumnDef<Project>[] = [
		// Selection column
		{
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={value => {
						row.toggleSelected(!!value)
					}}
					aria-label='Sélectionner la ligne'
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
					onCheckedChange={value => {
						table.toggleAllPageRowsSelected(!!value)
					}}
					aria-label='Sélectionner toutes les lignes'
				/>
			),
			id: 'select',
			maxSize: 20,
			minSize: 0,
			size: 20,
		},
		// Virtual column for date range filtering
		{
			accessorFn: row => ({
				endDate: row.endDate,
				startDate: row.startDate,
			}),
			cell: () => null,
			enableColumnFilter: true,
			enableHiding: false,
			filterFn: dateRangeFilter,
			header: () => null,
			id: 'dateFilter',
			maxSize: 0,
			meta: {
				isVirtual: true,
			},
			minSize: 0,
			size: 0,
		},
		// Virtual column for status filtering
		{
			accessorFn: row => {
				return isProjectActive(row.startDate, row.endDate)
			},
			cell: () => null,
			enableColumnFilter: true,
			enableHiding: false,
			filterFn: 'equals',
			header: () => null,
			id: 'statusFilter',
			maxSize: 0,
			meta: {
				isVirtual: true,
			},
			minSize: 0,
			size: 0,
		},
		...projectColumns,
	]

	// Initialize the table
	const table = useReactTable({
		columns,
		data,
		enableRowSelection: true,
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
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		state: {
			columnFilters,
			columnVisibility,
			globalFilter: searchQuery,
			rowSelection,
			sorting,
		},
	})

	// Calculate selected rows
	const selectedRows = table.getFilteredSelectedRowModel().rows

	// Delete selected projects
	const handleDeleteSelected = async () => {
		if (!onDeleteProjects || selectedRows.length === 0) return

		// Extract the Project objects from the selected rows
		const projectsToDelete = selectedRows.map(row => row.original)

		// Call the delete function passed from the parent
		await onDeleteProjects(projectsToDelete)

		// Clear selection after delete
		table.resetRowSelection()
	}

	// Apply date range filter
	const handleDateRangeChange = (range: DateRange | undefined) => {
		setDateRange(range)

		if (range?.from && range?.to) {
			// Use our virtual column for date filtering
			table
				.getColumn('dateFilter')
				?.setFilterValue([range.from.toISOString(), range.to.toISOString()])
		} else {
			table.getColumn('dateFilter')?.setFilterValue(undefined)
		}
	}

	// Handle status filter
	const handleStatusFilterChange = (value: string) => {
		if (value === 'all') {
			table.getColumn('statusFilter')?.setFilterValue(undefined)
		} else {
			table.getColumn('statusFilter')?.setFilterValue(value === 'active')
		}
	}

	// Get the current status filter value
	const statusFilterValue = table.getColumn('statusFilter')?.getFilterValue()

	return (
		<div className='space-y-6'>
			{/* Toolbar with search, delete selected and add project */}
			<div className='flex gap-6 sm:flex-row sm:items-center sm:justify-between'>
				<div className='flex gap-3'>
					{/* Search bar */}
					<div className='relative w-full'>
						<SearchIcon className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
						<Input
							type='search'
							placeholder='Rechercher un projet...'
							className='h-10 w-full min-w-[220px] rounded-md bg-white pr-4 pl-10'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
						/>
					</div>

					{/* Status filter */}
					<Select
						onValueChange={handleStatusFilterChange}
						defaultValue='all'
						value={
							statusFilterValue === undefined
								? 'all'
								: statusFilterValue === true
									? 'active'
									: 'inactive'
						}
					>
						<SelectTrigger className='h-10 bg-white'>
							<SelectValue placeholder='Statut' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>Tous les statuts</SelectItem>
							<SelectItem value='active'>Actifs</SelectItem>
							<SelectItem value='inactive'>Inactifs</SelectItem>
						</SelectContent>
					</Select>

					<DatePickerWithRange
						onChange={handleDateRangeChange}
						defaultValue={dateRange}
					/>

					{/* Filters bar */}
					<div className='flex flex-wrap items-center justify-start gap-4'>
						{/* Column controls */}
						<div>
							{/* Column Visibility */}
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant='outline'
										size='default'
										className='h-10 bg-white'
									>
										<SlidersHorizontal className='mr-2 h-4 w-4' />
										Colonnes affichées
									</Button>
								</PopoverTrigger>
								<PopoverContent className='w-[220px] p-0' align='end'>
									<div className='p-4'>
										<div className='flex items-center justify-between'>
											<Label className='text-xs font-medium'>Visibilité</Label>
											<Button
												onClick={() => setColumnVisibility({})}
												variant='ghost'
												className='h-8 px-2 text-xs'
											>
												Tout afficher
											</Button>
										</div>
										<Separator className='my-2' />
										<div className='space-y-3 py-2'>
											{table
												.getAllColumns()
												.filter(column => column.getCanHide())
												.map(column => {
													return (
														<div key={column.id} className='flex items-center'>
															<Checkbox
																checked={column.getIsVisible()}
																onCheckedChange={value => {
																	column.toggleVisibility(!!value)
																}}
																id={`column-${column.id}`}
															/>
															<Label
																htmlFor={`column-${column.id}`}
																className='ml-2 text-sm'
															>
																{getColumnDisplayName(column.id)}
															</Label>
														</div>
													)
												})}
										</div>
									</div>
								</PopoverContent>
							</Popover>
						</div>
					</div>
				</div>

				{/* Main actions */}
				<div className='flex items-center gap-3'>
					{/* Delete selected button */}
					{selectedRows.length > 0 && (
						<Button
							variant='destructive'
							size='default'
							onClick={handleDeleteSelected}
							className='h-10'
						>
							<Trash2 className='mr-2 h-4 w-4' />
							Supprimer ({selectedRows.length})
						</Button>
					)}

					<Button className='h-10'>
						<Plus className='mr-2 h-4 w-4' />
						Ajouter un projet
					</Button>
				</div>
			</div>

			{/* Table */}
			<div className='rounded-md border border-slate-100 bg-white'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<TableHead
										key={header.id}
										className='bg-gray-50 px-4 py-3 whitespace-nowrap'
									>
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
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
									className='border-b transition-colors hover:bg-gray-50'
								>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id} className='px-4 py-3'>
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
									colSpan={table.getAllColumns().length}
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
			<div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
				<div className='flex items-center gap-2'>
					<Label htmlFor='perPage' className='text-sm'>
						Lignes par page
					</Label>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={value => {
							table.setPageSize(Number(value))
						}}
					>
						<SelectTrigger id='perPage' className='h-10 w-[70px] bg-white'>
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

				<div className='flex items-center gap-6'>
					<div className='text-muted-foreground flex text-sm'>
						Page&nbsp;{table.getState().pagination.pageIndex + 1}&nbsp;sur&nbsp;
						{table.getPageCount()}
					</div>
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<Button
									variant='outline'
									className='h-10 w-10 bg-white p-0'
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
									className='h-10 w-10 bg-white p-0'
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
									className='h-10 w-10 bg-white p-0'
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
									className='h-10 w-10 bg-white p-0'
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
