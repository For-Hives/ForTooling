import 'server-only'
import PocketBase from 'pocketbase'

// Singleton pattern for PocketBase instance
let instance: PocketBase | null = null

/**
 * Initialize and authenticate with PocketBase
 * Uses server-side authentication with an admin token
 *
 * @returns {Promise<PocketBase | null>} Authenticated PocketBase instance or null if authentication fails
 */
export const getPocketBase = async (): Promise<PocketBase | null> => {
	// Return existing instance if valid
	if (instance?.authStore?.isValid) {
		return instance
	}

	// Get credentials from environment variables
	// PB_TOKEN_API_ADMIN
	// PB_API_URL
	const token = process.env.PB_TOKEN_API_ADMIN
	const url = process.env.PB_API_URL

	if (!token || !url) {
		console.error('Missing PocketBase credentials in environment variables')
		return null
	}

	// Create new PocketBase instance
	instance = new PocketBase(url)
	instance.authStore.save(token, null)
	instance.autoCancellation(false)

	return instance
}

/**
 * Error handler for PocketBase operations
 * @param error The caught error
 * @param context Optional context information for better error reporting
 */
export const handlePocketBaseError = (
	error: unknown,
	context?: string
): never => {
	const contextMsg = context ? ` [${context}]` : ''
	console.error(`PocketBase error${contextMsg}:`, error)

	if (error instanceof Error) {
		throw new Error(
			`PocketBase operation failed${contextMsg}: ${error.message}`
		)
	}

	throw new Error(`Unknown PocketBase error${contextMsg}`)
}

/**
 * Type for record data
 */
export type RecordData = Record<string, unknown>

/**
 * Base method for creating records with permission handling
 * @param collection - Collection name
 * @param data - Record data
 * @param elevated - Whether this operation has elevated permissions (e.g., from webhook)
 */
export async function createRecord(
	collection: string,
	data: RecordData,
	// We keep the elevated param for future implementation of permission checks
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	elevated = false
) {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to initialize PocketBase client')
		}

		// Create the record with the PocketBase instance
		return await pb.collection(collection).create(data)
	} catch (error) {
		console.error(`Error creating record in ${collection}:`, error)
		throw error
	}
}

/**
 * Base method for updating records with permission handling
 * @param collection - Collection name
 * @param id - Record ID
 * @param data - Updated data
 * @param elevated - Whether this operation has elevated permissions
 */
export async function updateRecord(
	collection: string,
	id: string,
	data: RecordData,
	// We keep the elevated param for future implementation of permission checks
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	elevated = false
) {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to initialize PocketBase client')
		}

		// Update the record with the PocketBase instance
		return await pb.collection(collection).update(id, data)
	} catch (error) {
		console.error(`Error updating record in ${collection}:`, error)
		throw error
	}
}

/**
 * Base method for deleting records with permission handling
 * @param collection - Collection name
 * @param id - Record ID
 * @param elevated - Whether this operation has elevated permissions
 */
export async function deleteRecord(
	collection: string,
	id: string,
	// We keep the elevated param for future implementation of permission checks
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	elevated = false
) {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to initialize PocketBase client')
		}

		// Delete the record with the PocketBase instance
		return await pb.collection(collection).delete(id)
	} catch (error) {
		console.error(`Error deleting record in ${collection}:`, error)
		throw error
	}
}

/**
 * Base method for retrieving a single record by ID
 * @param collection - Collection name
 * @param id - Record ID
 */
export async function getRecordById(collection: string, id: string) {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to initialize PocketBase client')
		}

		return await pb.collection(collection).getOne(id)
	} catch (error) {
		console.error(`Error getting record by ID in ${collection}:`, error)
		throw error
	}
}

/**
 * Base method for listing records with filters
 * @param collection - Collection name
 * @param page - Page number
 * @param perPage - Items per page
 * @param filter - Filter string
 * @param sort - Sort string
 */
export async function listRecords(
	collection: string,
	page = 1,
	perPage = 50,
	filter = '',
	sort = ''
) {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to initialize PocketBase client')
		}

		return await pb.collection(collection).getList(page, perPage, {
			filter,
			sort,
		})
	} catch (error) {
		console.error(`Error listing records in ${collection}:`, error)
		throw error
	}
}
