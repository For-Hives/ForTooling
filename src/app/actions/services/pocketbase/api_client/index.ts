/**
 * PocketBase API Client exports
 */

// Client and utilities
export * from '@/app/actions/services/pocketbase/api_client/client'
export * from '@/app/actions/services/pocketbase/api_client/base_service'

// Types and schemas
export * from '@/app/actions/services/pocketbase/api_client/types'
export * from '@/app/actions/services/pocketbase/api_client/schemas'

// Re-export common utility for creating service inputs
import { z } from 'zod'

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
	// We need to cast the schema to avoid TypeScript errors
	const updateSchema = createPartialSchema(createSchema as z.ZodType<unknown>)

	return {
		baseSchema,
		createSchema,
		updateSchema,
	}
}
