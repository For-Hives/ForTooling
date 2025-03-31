/**
 * PocketBase Services
 * Central export point for all PocketBase services and utilities
 */

// Export API client core
export * from './api_client'

// Export individual services
export * from './organization_service'
export * from './app_user_service'
export * from './equipment_service'

// Re-export common validation utility
import { z } from 'zod'

/**
 * Validate organization ID format
 * @param id - The ID to validate
 * @returns Whether the ID is valid
 */
export function isValidOrganizationId(id: unknown): boolean {
	return z.string().length(15).safeParse(id).success
}

/**
 * Validate user ID format
 * @param id - The ID to validate
 * @returns Whether the ID is valid
 */
export function isValidUserId(id: unknown): boolean {
	return z.string().length(15).safeParse(id).success
}

/**
 * Validate ID format for any record
 * @param id - The ID to validate
 * @returns Whether the ID is valid
 */
export function isValidRecordId(id: unknown): boolean {
	return z.string().length(15).safeParse(id).success
}
