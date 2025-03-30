'use server'

import { getPocketBase } from '@/app/actions/services/pocketbase/baseService'
import {
	SecurityError,
	PermissionLevel,
	ResourceType,
} from '@/app/actions/services/securyUtilsTools'
import { AppUser } from '@/types/types_pocketbase'
import { auth } from '@clerk/nextjs/server'

/**
 * Validates a user ID against the current authenticated user
 * @param userId The user ID to validate
 * @throws {SecurityError} If the user ID is invalid or unauthorized
 */
export async function validateCurrentUser(userId?: string): Promise<AppUser> {
	// Get Clerk auth context
	const { userId: clerkUserId } = await auth()

	if (!clerkUserId) {
		throw new SecurityError('Unauthenticated access')
	}

	const pb = await getPocketBase()
	if (!pb) {
		throw new SecurityError('Database connection error')
	}

	try {
		// Find the user by Clerk ID
		const user = await pb
			.collection('users')
			.getFirstListItem(`clerkId=${clerkUserId}`)

		// If a specific user ID was provided, verify it matches the current user
		if (userId && user.id !== userId) {
			throw new SecurityError('Unauthorized access to user data')
		}

		return user
	} catch (error) {
		console.error('User validation error:', error)
		throw new SecurityError('Failed to validate user')
	}
}

/**
 * Validates organizational access and permissions
 * @param organizationId The organization ID to validate
 * @param permission The required permission level
 * @returns The validated user and organization
 * @throws {Error} If access is unauthorized
 */
export async function validateOrganizationAccess(
	organizationId: string,
	permission: PermissionLevel = PermissionLevel.READ
): Promise<{ user: AppUser; organizationId: string }> {
	// Get authenticated user
	const user = await validateCurrentUser()

	// Check organization membership
	if (user.expand?.organizationId !== organizationId) {
		throw new SecurityError('Unauthorized access to organization data')
	}

	// Check permission level
	if (
		permission === PermissionLevel.ADMIN &&
		!user.isAdmin &&
		user.role !== 'admin'
	) {
		throw new SecurityError('Insufficient permissions for this operation')
	}

	if (
		permission === PermissionLevel.WRITE &&
		!user.isAdmin &&
		user.role !== 'admin' &&
		user.role !== 'manager'
	) {
		throw new SecurityError('Insufficient permissions for this operation')
	}

	return { organizationId, user }
}

/**
 * Validates resource access (equipment, project, assignment)
 * @param resourceType The type of resource
 * @param resourceId The resource ID
 * @param permission The required permission level
 * @returns The validated user and organization ID
 * @throws {Error} If access is unauthorized
 */
export async function validateResourceAccess(
	resourceType: ResourceType,
	resourceId: string,
	permission: PermissionLevel = PermissionLevel.READ
): Promise<{ user: AppUser; organizationId: string }> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new SecurityError('Database connection error')
	}

	try {
		// Fetch the resource to check organization membership
		const resource = await pb.collection(resourceType).getOne(resourceId)

		// Now validate organization access with the required permission
		return validateOrganizationAccess(resource.organization, permission)
	} catch (error) {
		console.error(
			`Resource validation error (${resourceType}/${resourceId}):`,
			error
		)
		throw new SecurityError('Failed to validate resource access')
	}
}

/**
 * Creates a secure organization filter
 * Ensures that all queries include organization-level filtering
 * @param organizationId The organization ID to filter by
 * @param additionalFilter Optional additional filter expression
 * @returns A complete filter string with organization filtering
 */
export async function createOrganizationFilter(
	organizationId: string,
	additionalFilter?: string
): Promise<string> {
	const orgFilter = `organization="${organizationId}"`

	if (!additionalFilter) {
		return orgFilter
	}

	return `${orgFilter} && (${additionalFilter})`
}
