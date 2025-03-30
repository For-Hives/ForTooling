// src/app/actions/services/clerk-sync/cacheService.ts
import crypto from 'crypto'

/**
 * Interface for cache entries with security features
 */
interface SecureCacheEntry<T> {
	data: T
	timestamp: number
	userId: string
	hash: string
}

/**
 * Secure caching service with user-specific isolation and integrity validation
 * Implements security best practices to prevent cache manipulation attacks
 */
class SecureCache {
	private cache: Map<string, SecureCacheEntry<any>>
	private secretKey: string

	constructor() {
		this.cache = new Map()

		// Use the environment secret or generate a random one per instance
		// This makes cache manipulation attacks significantly harder
		this.secretKey =
			process.env.CACHE_SECRET || crypto.randomBytes(32).toString('hex')
	}

	/**
	 * Creates a cryptographic hash to verify data integrity
	 *
	 * @param data The data to hash
	 * @param userId The user ID to include in the hash
	 * @returns The generated hash
	 */
	private createHash(data: any, userId: string): string {
		const content = JSON.stringify(data) + userId + this.secretKey
		return crypto.createHash('sha256').update(content).digest('hex')
	}

	/**
	 * Stores a value in the cache with security validation
	 *
	 * @param key The cache key
	 * @param value The value to store
	 * @param userId The user ID for isolation and validation
	 * @param ttl Optional TTL in milliseconds (defaults to 2 minutes)
	 */
	set(
		key: string,
		value: any,
		userId: string,
		ttl: number = 2 * 60 * 1000
	): void {
		// Create an integrity hash that binds the data to this specific user
		const integrityHash = this.createHash(value, userId)

		this.cache.set(key, {
			data: value,
			hash: integrityHash,
			timestamp: Date.now(),
			userId,
		})

		// Set automatic expiration for this entry
		if (ttl > 0) {
			setTimeout(() => {
				this.cache.delete(key)
			}, ttl)
		}
	}

	/**
	 * Retrieves a value from the cache with security checks
	 *
	 * @param key The cache key
	 * @param userId The user ID for isolation and validation
	 * @param maxAge Optional maximum age in milliseconds
	 * @returns The cached value or null if not found/invalid
	 */
	get(key: string, userId: string, maxAge: number = 2 * 60 * 1000): any | null {
		const entry = this.cache.get(key)

		// No entry found
		if (!entry) {
			return null
		}

		// Check if entry has expired
		if (maxAge > 0 && Date.now() - entry.timestamp > maxAge) {
			this.cache.delete(key)
			return null
		}

		// Enforce user isolation - users can only access their own cache entries
		if (entry.userId !== userId) {
			return null
		}

		// Verify data integrity using the hash
		const expectedHash = this.createHash(entry.data, userId)
		if (entry.hash !== expectedHash) {
			// Hash mismatch indicates potential tampering - remove the entry
			this.cache.delete(key)
			console.warn(`Cache integrity violation detected for key: ${key}`)
			return null
		}

		return entry.data
	}

	/**
	 * Invalidates a cache entry
	 *
	 * @param key The cache key to invalidate
	 * @param userId Optional user ID for additional security
	 */
	invalidate(key: string, userId?: string): void {
		// If userId is provided, only allow invalidation of that user's entries
		if (userId) {
			const entry = this.cache.get(key)
			if (entry && entry.userId === userId) {
				this.cache.delete(key)
			}
		} else {
			this.cache.delete(key)
		}
	}

	/**
	 * Clears all cache entries - use with caution
	 */
	clear(): void {
		this.cache.clear()
	}

	/**
	 * Gets the current size of the cache
	 *
	 * @returns Number of entries in the cache
	 */
	size(): number {
		return this.cache.size
	}
}

// Singleton instance for app-wide use
export const secureCache = new SecureCache()
