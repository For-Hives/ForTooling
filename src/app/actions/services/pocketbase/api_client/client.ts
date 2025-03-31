/**
 * PocketBase client for server-side API calls
 */
import PocketBase, { ClientResponseError } from 'pocketbase'
import { cache } from 'react'
import { z } from 'zod'

/**
 * Error class for PocketBase API errors
 */
export class PocketBaseApiError extends Error {
	status: number
	data?: Record<string, unknown>

	constructor(message: string, status: number, data?: Record<string, unknown>) {
		super(message)
		this.name = 'PocketBaseApiError'
		this.status = status
		this.data = data
	}

	/**
	 * Convert a ClientResponseError to PocketBaseApiError
	 */
	static fromClientResponseError(
		error: ClientResponseError
	): PocketBaseApiError {
		return new PocketBaseApiError(error.message, error.status, error.data)
	}
}

/**
 * Get a PocketBase instance (cached per request)
 * This implementation bypasses cookie auth for now and relies on admin auth
 */
export const getPocketBase = cache(() => {
	// Create a new PocketBase instance
	const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL)

	const token = process.env.PB_TOKEN_API_ADMIN
	if (token) {
		pb.authStore.save(token)
	} else {
		throw new Error('PB_TOKEN_API_ADMIN is not set')
	}

	return pb
})

/**
 * Generic function to handle PocketBase errors
 */
export function handlePocketBaseError(error: unknown): never {
	if (error instanceof ClientResponseError) {
		throw PocketBaseApiError.fromClientResponseError(error)
	}

	if (error instanceof Error) {
		throw new PocketBaseApiError(error.message, 500)
	}

	throw new PocketBaseApiError('Unknown error occurred', 500)
}

/**
 * Collection names for PocketBase
 */
export const Collections = {
	ACTIVITY_LOGS: 'ActivityLog',
	APP_USERS: 'AppUser',
	ASSIGNMENTS: 'Assignment',
	EQUIPMENT: 'Equipment',
	IMAGES: 'Images',
	ORGANIZATIONS: 'Organization',
	PROJECTS: 'Project',
} as const

/**
 * Type-safe collection names
 */
export type CollectionName = (typeof Collections)[keyof typeof Collections]

/**
 * Validate response data with Zod schema
 */
export function validateWithZod<T>(schema: z.ZodType<T>, data: unknown): T {
	try {
		console.log('data', data)
		return schema.parse(data)
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error('Validation error:', error.format())
			throw new PocketBaseApiError('Data validation failed', 422, {
				validationErrors: error.format(),
			})
		}
		throw error
	}
}

/**
 * Type for the collection method options
 */
export interface CollectionMethodOptions {
	validateOutput?: boolean
}

/**
 * Default options for collection methods
 */
export const defaultCollectionMethodOptions: CollectionMethodOptions = {
	validateOutput: true,
}
