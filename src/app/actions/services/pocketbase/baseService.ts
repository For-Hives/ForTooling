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
	const token = process.env.PB_USER_TOKEN
	const url = process.env.PB_SERVER_URL

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
