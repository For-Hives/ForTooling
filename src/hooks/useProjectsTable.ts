'use client'

import {
	ColumnFiltersState,
	PaginationState,
	SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'

/**
 * Custom hook for managing the Projects table state
 * This handles sorting, pagination, and filtering with type safety
 */
export function useProjectsTable() {
	// Sorting state
	const [sorting, setSorting] = useState<SortingState>([
		{
			desc: false,
			id: 'name',
		},
	])

	// Pagination state
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	})

	// Column visibility state
	const [columnVisibility, setColumnVisibility] = useState({})

	// Column filters state
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

	// Global filter state
	const [globalFilter, setGlobalFilter] = useState('')

	return {
		columnFilters,
		columnVisibility,
		globalFilter,
		pagination,
		setColumnFilters,
		setColumnVisibility,
		setGlobalFilter,
		setPagination,
		setSorting,
		sorting,
	}
}
