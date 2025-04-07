import { getAppUserService } from '@/app/actions/services/pocketbase/app_user_service'
import { AppUser } from '@/models/pocketbase'
import { currentUser } from '@clerk/nextjs/server'

import { getOrganizationAppUserService } from './organization_app_user_service'

/**
 * Security error class for authentication and authorization errors
 */
export class SecurityError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'SecurityError'
	}
}

/**
 * Permission levels for authorization
 */
export enum PermissionLevel {
	ADMIN = 'admin',
	READ = 'read',
	WRITE = 'write',
}

/**
 * Validates that the current user is authenticated
 * @returns The authenticated user
 * @throws {SecurityError} If the user is not authenticated
 */
export async function validateCurrentUser(): Promise<AppUser> {
	try {
		// Get the current user from Clerk
		const user = await currentUser()

		if (!user?.id) {
			throw new SecurityError('Authentication required')
		}

		// Get the user from PocketBase
		const userService = getAppUserService()
		const pbUser = await userService.findByClerkId(user.id)

		if (!pbUser) {
			throw new SecurityError('User not found in database')
		}

		return pbUser
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		console.error('Authentication error:', error)
		throw new SecurityError('Authentication failed')
	}
}

/**
 * Validates that the current user has access to the specified organization with required permission level
 * @param organizationId The organization ID to validate
 * @param requiredPermission The required permission level
 * @returns The validated user and organization ID
 * @throws {SecurityError} If access is unauthorized
 */
export async function validateOrganizationAccess(
	organizationId: string,
	requiredPermission: PermissionLevel = PermissionLevel.READ
): Promise<{ user: AppUser; organizationId: string }> {
	// First validate the user is authenticated
	const user = await validateCurrentUser()

	// Get the organization-user service
	const orgUserService = getOrganizationAppUserService()

	// Get the user's role in this organization
	const mapping = await orgUserService.findByAppUserAndOrganization(
		user.id,
		organizationId
	)

	if (!mapping) {
		throw new SecurityError('Unauthorized access to organization data')
	}

	const role = mapping.role

	// Check permission level based on role
	if (requiredPermission === PermissionLevel.ADMIN && role !== 'admin') {
		throw new SecurityError('Admin permission required for this operation')
	}

	if (
		requiredPermission === PermissionLevel.WRITE &&
		!['admin', 'manager'].includes(role)
	) {
		throw new SecurityError('Write permission required for this operation')
	}

	// If we reach here, the user has the required permission
	return { organizationId, user }
}

/**
 * Higher-order function that wraps a function with organization access validation
 * @param fn The function to wrap
 * @param permissionLevel The permission level required
 * @returns The wrapped function
 */
export function withOrganizationAccess<
	TArgs extends [string, ...unknown[]],
	TReturn,
>(
	fn: (...args: TArgs) => Promise<TReturn>,
	permissionLevel: PermissionLevel = PermissionLevel.READ
): (...args: TArgs) => Promise<TReturn> {
	return async (...args: TArgs): Promise<TReturn> => {
		// The first argument should be the organization ID
		const organizationId = args[0]

		// Validate the organization access
		await validateOrganizationAccess(organizationId, permissionLevel)

		// Call the original function
		return fn(...args)
	}
}
