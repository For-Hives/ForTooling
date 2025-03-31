'use server'

import { PocketBaseApiError } from '@/app/actions/services/pocketbase/api_client/client'
import { findUserByClerkId } from '@/app/actions/services/pocketbase/app_user_service'
import { findOrganizationByClerkId } from '@/app/actions/services/pocketbase/organization_service'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

/**
 * Security middleware error class
 */
export class SecurityError extends Error {
	statusCode: number

	constructor(message: string, statusCode = 401) {
		super(message)
		this.name = 'SecurityError'
		this.statusCode = statusCode
	}
}

/**
 * Type for the security context provided to secured actions
 */
export interface SecurityContext {
	userId: string
	orgId: string
	orgRole: string
	userPbId: string
	orgPbId: string
	isAdmin: boolean
}

/**
 * Type for a handler function that requires security context
 */
export type SecuredHandler<TParams = unknown, TResult = unknown> = (
	params: TParams,
	context: SecurityContext
) => Promise<TResult>

/**
 * Higher-order function that wraps server actions with security checks
 *
 * @param handler - The server action handler function
 * @param options - Security options
 * @returns A new handler function with security checks
 */
export function withSecurity<TParams, TResult>(
	handler: SecuredHandler<TParams, TResult>,
	options: {
		revalidatePaths?: string[]
		requireAdmin?: boolean
	} = {}
) {
	return async (params: TParams): Promise<TResult> => {
		try {
			// Get auth info from Clerk (auth() is async in Next.js 14)
			const authData = await auth()

			// Check if user is authenticated
			if (!authData.userId) {
				throw new SecurityError('Unauthorized: User not authenticated')
			}

			// Check if user has selected an organization
			if (!authData.orgId) {
				throw new SecurityError('Unauthorized: No organization selected')
			}

			// Check admin requirement if needed
			if (options.requireAdmin && authData.orgRole !== 'admin') {
				throw new SecurityError('Forbidden: Admin access required', 403)
			}

			// Get the PocketBase IDs for the user and organization
			const userRecord = await findUserByClerkId(authData.userId)
			if (!userRecord) {
				throw new SecurityError('User not found in database')
			}

			const orgRecord = await findOrganizationByClerkId(authData.orgId)
			if (!orgRecord) {
				throw new SecurityError('Organization not found in database')
			}

			// Create security context
			const securityContext: SecurityContext = {
				isAdmin: authData.orgRole === 'admin' || userRecord.isAdmin,
				orgId: authData.orgId,
				orgPbId: orgRecord.id,
				orgRole: authData.orgRole || 'member',
				userId: authData.userId,
				userPbId: userRecord.id,
			}

			// Call the handler with security context
			const result = await handler(params, securityContext)

			// Revalidate paths if specified
			if (options.revalidatePaths) {
				for (const path of options.revalidatePaths) {
					revalidatePath(path)
				}
			}

			return result
		} catch (error) {
			if (error instanceof SecurityError) {
				throw error
			}

			if (error instanceof PocketBaseApiError) {
				throw error
			}

			console.error('Error in secured handler:', error)
			throw new SecurityError('An unexpected error occurred', 500)
		}
	}
}

/**
 * Check if the current user has permission to access a resource
 *
 * @param resourceOrgId - The organization ID associated with the resource
 * @param context - The security context
 * @param requireAdmin - Whether admin access is required
 * @returns True if the user has permission
 */
export function checkResourcePermission(
	resourceOrgId: string,
	context: SecurityContext,
	requireAdmin = false
): boolean {
	// Check if the resource belongs to the user's organization
	if (resourceOrgId !== context.orgPbId) {
		return false
	}

	// Check admin requirement if needed
	if (requireAdmin && !context.isAdmin) {
		return false
	}

	return true
}
