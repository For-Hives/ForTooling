import { z } from 'zod'

/**
 * ========================================
 * BASE TYPES
 * ========================================
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

/**
 * ========================================
 * BASE SCHEMAS
 * ========================================
 */

/**
 * Base schema for all PocketBase records
 * Contains validation for system fields present in all records
 */
export const baseRecordSchema = z.object({
	collectionId: z.string().optional(),
	collectionName: z.string().optional(),
	created: z.string().datetime(),
	id: z.string(),
	updated: z.string().datetime(),
})

/**
 * List result schema (generic)
 * Used for paginated results from PocketBase
 */
export const listResultSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
	z.object({
		items: z.array(itemSchema),
		page: z.number(),
		perPage: z.number(),
		totalItems: z.number(),
		totalPages: z.number(),
	})

/**
 * Query parameters schema
 * Validates parameters for list operations
 */
export const queryParamsSchema = z.object({
	expand: z.string().optional(),
	filter: z.string().optional(),
	page: z.number().optional(),
	perPage: z.number().optional(),
	sort: z.string().optional(),
})

/**
 * ========================================
 * UTILITY FUNCTIONS
 * ========================================
 */

/**
 * Create partial schema by making all properties optional
 * Useful for update operations
 */
export function createPartialSchema<T>(
	schema: z.ZodType<T>
): z.ZodType<unknown> {
	// Handle ZodObject specifically
	if (schema instanceof z.ZodObject) {
		return schema.partial()
	}

	// For non-object schemas, we can't properly partial them
	// Just return the original schema as a fallback
	console.warn('Attempting to create partial schema for non-object type')
	return schema as z.ZodType<unknown>
}

/**
 * Create schemas for CRUD operations based on a base schema
 */
export function createServiceSchemas<T>(baseSchema: z.ZodType<T>) {
	// For create operations, strip system fields
	const createSchema =
		baseSchema instanceof z.ZodObject
			? baseSchema.omit({
					collectionId: true,
					collectionName: true,
					created: true,
					id: true,
					updated: true,
				})
			: baseSchema

	// For update operations, make all properties optional
	const updateSchema = createPartialSchema(createSchema as z.ZodType<unknown>)

	return {
		baseSchema,
		createSchema,
		updateSchema,
	}
}
