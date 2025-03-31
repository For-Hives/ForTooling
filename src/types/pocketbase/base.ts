/**
 * Base types for PocketBase data models
 * These types represent the common schema structure across all collections
 */

/**
 * Base interface for all PocketBase records
 * Contains system fields present in every PocketBase record
 */
export interface BaseRecord {
	id: string
	created: string
	updated: string
	collectionId?: string
	collectionName?: string
}

/**
 * Generic list result interface for paginated PocketBase responses
 */
export interface ListResult<T> {
	page: number
	perPage: number
	totalItems: number
	totalPages: number
	items: T[]
}

/**
 * Generic query parameters for list operations
 */
export interface QueryParams {
	page?: number
	perPage?: number
	sort?: string
	filter?: string
	expand?: string
}
