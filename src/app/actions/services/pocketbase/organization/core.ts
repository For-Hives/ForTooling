'use server'

import {
	getPocketBase,
	handlePocketBaseError,
} from '@/app/actions/services/pocketbase/baseService'
import {
	_createOrganization,
	_updateOrganization,
	_deleteOrganization,
} from '@/app/actions/services/pocketbase/organization/internal'
import {
	validateCurrentUser,
	validateOrganizationAccess,
} from '@/app/actions/services/pocketbase/securityUtils'
import {
	PermissionLevel,
	SecurityError,
} from '@/app/actions/services/securyUtilsTools'
import { Organization, ListOptions, ListResult } from '@/types/types_pocketbase'

/**
 * Core organization operations with security validations
 */

/**
 * Get a single organization by ID with security validation
 */
export async function getOrganization(id: string): Promise<Organization> {
	try {
		// Security check - validates user has access to this organization
		await validateOrganizationAccess(id, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		return await pb.collection('organizations').getOne(id)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error // Re-throw security errors
		}
		return handlePocketBaseError(error, 'OrganizationService.getOrganization')
	}
}

/**
 * Get an organization by Clerk ID with security validation
 * This is primarily used during authentication
 */
export async function getOrganizationByClerkId(
	clerkId: string
): Promise<Organization> {
	try {
		// Validate current user is authenticated
		const user = await validateCurrentUser()

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		const organization = await pb
			.collection('organizations')
			.getFirstListItem(`clerkId="${clerkId}"`)

		// Check if user has access to this organization
		// Get the user with expanded organizations
		const userWithOrgs = await pb.collection('users').getOne(user.id, {
			expand: 'organizations',
		})

		// Check if the user has access to this organization
		const hasAccess =
			userWithOrgs.organizations &&
			userWithOrgs.organizations.some(
				(orgId: string) => orgId === organization.id
			)

		if (!hasAccess) {
			throw new SecurityError('User does not belong to this organization')
		}

		// todo : fix types
		return organization as Organization
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(
			error,
			'OrganizationService.getOrganizationByClerkId'
		)
	}
}

/**
 * Get organizations list for the current user
 */
export async function getUserOrganizations(): Promise<Organization[]> {
	try {
		const user = await validateCurrentUser()

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Fetch the user with expanded organizations
		const userWithOrgs = await pb.collection('users').getOne(user.id, {
			expand: 'organizations',
		})

		if (!userWithOrgs.expand?.organizations) {
			return []
		}

		return userWithOrgs.expand.organizations
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(
			error,
			'OrganizationService.getUserOrganizations'
		)
	}
}

/**
 * Get organizations list with pagination
 * This should only be accessible to super-admins in regular operation
 */
export async function getOrganizationsList(
	options: ListOptions = {},
	elevated = false
): Promise<ListResult<Organization>> {
	try {
		if (!elevated) {
			// For regular access, verify super-admin status
			const user = await validateCurrentUser()
			if (!user.isAdmin) {
				throw new SecurityError(
					'This operation is restricted to super administrators'
				)
			}
		}

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		return await pb
			.collection('organizations')
			.getList(options.page || 1, options.perPage || 50, {
				filter: options.filter,
				sort: options.sort,
			})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(
			error,
			'OrganizationService.getOrganizationsList'
		)
	}
}

/**
 * Create a new organization - supports both regular and elevated access
 */
export async function createOrganization(
	data: Partial<Organization>,
	elevated = false
): Promise<Organization> {
	try {
		if (!elevated) {
			// For regular access, verify super-admin status
			const user = await validateCurrentUser()
			if (!user.isAdmin) {
				throw new SecurityError(
					'This operation is restricted to super administrators'
				)
			}
		}

		// For elevated access (webhooks), we bypass additional security checks
		return await _createOrganization(data)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(
			error,
			'OrganizationService.createOrganization'
		)
	}
}

/**
 * Update an organization with security validation
 */
export async function updateOrganization(
	id: string,
	data: Partial<Organization>,
	elevated = false
): Promise<Organization> {
	try {
		if (!elevated) {
			// Security check - requires ADMIN permission for organization updates
			await validateOrganizationAccess(id, PermissionLevel.ADMIN)

			// Sanitize sensitive fields for regular users
			const sanitizedData = { ...data }

			// Never allow changing the clerkId - that's a special binding
			delete sanitizedData.clerkId

			// Don't allow changing Stripe-related fields directly
			delete sanitizedData.stripeCustomerId
			delete sanitizedData.subscriptionId
			delete sanitizedData.subscriptionStatus
			delete sanitizedData.priceId

			return await _updateOrganization(id, sanitizedData)
		}

		// For elevated access, use the data as provided
		return await _updateOrganization(id, data)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(
			error,
			'OrganizationService.updateOrganization'
		)
	}
}

/**
 * Delete an organization - supports both regular and elevated access
 */
export async function deleteOrganization(
	id: string,
	elevated = false
): Promise<boolean> {
	try {
		if (!elevated) {
			// For regular access, verify super-admin status
			const user = await validateCurrentUser()
			if (!user.isAdmin) {
				throw new SecurityError(
					'This operation is restricted to super administrators'
				)
			}
		}

		// For elevated access (webhooks), we bypass additional security checks
		return await _deleteOrganization(id)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		handlePocketBaseError(error, 'OrganizationService.deleteOrganization')
		return false
	}
}

/**
 * Update organization subscription details
 * This should only be called from Stripe webhooks, not directly by users
 */
export async function updateSubscription(
	id: string,
	subscriptionData: {
		stripeCustomerId?: string
		subscriptionId?: string
		subscriptionStatus?: string
		priceId?: string
	},
	elevated = false
): Promise<Organization> {
	try {
		if (!elevated) {
			// For regular access, verify super-admin status
			const user = await validateCurrentUser()
			if (!user.isAdmin) {
				throw new SecurityError('This operation is restricted')
			}
		}

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Verify the organization exists
		const organization = await pb.collection('organizations').getOne(id)
		if (!organization) {
			throw new Error('Organization not found')
		}

		return await pb.collection('organizations').update(id, subscriptionData)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(
			error,
			'OrganizationService.updateSubscription'
		)
	}
}

/**
 * Get current organization settings for the authenticated user
 * If the user belongs to multiple organizations, takes the first active one
 */
export async function getCurrentOrganizationSettings(): Promise<Organization> {
	try {
		// Get all organizations for the current user
		const userOrganizations = await getUserOrganizations()

		if (!userOrganizations.length) {
			throw new SecurityError('User does not belong to any organization')
		}

		// For simplicity, we're returning the first organization
		const firstOrgId = userOrganizations[0].id

		// Fetch full organization details with validated access
		return await getOrganization(firstOrgId)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(
			error,
			'OrganizationService.getCurrentOrganizationSettings'
		)
	}
}
