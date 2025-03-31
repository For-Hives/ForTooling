/**
 * PocketBase Services
 * Central export point for all PocketBase services and utilities
 */
import { z } from 'zod'

// Export API client core
export * from '@/app/actions/services/pocketbase/api_client'

// Export individual services
export * from '@/app/actions/services/pocketbase/organization_service'
export * from '@/app/actions/services/pocketbase/app_user_service'
export * from '@/app/actions/services/pocketbase/equipment_service'

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
