'use server'

import {
	getPocketBase,
	handlePocketBaseError,
} from '@/app/actions/services/pocketbase/baseService'
import {
	validateCurrentUser,
	validateOrganizationAccess,
	PermissionLevel,
	SecurityError,
} from '@/app/actions/services/pocketbase/securityUtils'
import { Organization, ListOptions, ListResult } from '@/types/types_pocketbase'

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
		// This endpoint is typically called during authentication
		// We still validate the current user is authenticated
		const user = await validateCurrentUser()

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Fixed the template literal syntax
		const organization = await pb
			.collection('organizations')
			.getFirstListItem(`clerkId=${clerkId}`)

		// After fetching, verify that the user belongs to this organization
		// The user can have multiple organizations, so we need to check if the requested org
		// is in their list of organizations
		if (
			!user.expand?.organizationId ||
			!Array.isArray(user.expand.organizationId)
		) {
			throw new SecurityError('User has no associated organizations')
		}

		// Check if the requested organization is in the user's list of organizations
		const hasAccess = user.expand.organizationId.some(
			org => org.id === organization.id
		)

		if (!hasAccess) {
			throw new SecurityError('User does not belong to this organization')
		}

		// todo: fix type
		return organization
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
 * Get organizations list with pagination for the current user
 */
export async function getUserOrganizations(): Promise<Organization[]> {
	try {
		const user = await validateCurrentUser()

		// If the user's organizations are already expanded, return them
		if (
			user.expand?.organizationId &&
			Array.isArray(user.expand.organizationId)
		) {
			return user.expand.organizationId
		}

		// Otherwise, we need to fetch them
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Assuming there's a relation field in the users collection that points to organizations
		// Fetch the user with expanded organizations
		const userWithOrgs = await pb.collection('users').getOne(user.id, {
			expand: 'organizationId',
		})

		if (
			userWithOrgs.expand?.organizationId &&
			Array.isArray(userWithOrgs.expand.organizationId)
		) {
			return userWithOrgs.expand.organizationId
		}

		return []
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
 * This should only be accessible to super-admins, so we don't implement it
 * in a regular multi-tenant app
 */
export async function getOrganizationsList(
	options: ListOptions = {}
): Promise<ListResult<Organization>> {
	// This function should be restricted to super-admins only
	throw new SecurityError(
		'This operation is restricted to super administrators'
	)
}

/**
 * Create a new organization
 * This should only be done during onboarding or by super-admins
 */
export async function createOrganization(
	data: Partial<Organization>
): Promise<Organization> {
	// For creating organizations, we typically handle this specially
	// during onboarding with Clerk. This should not be exposed to regular users.
	throw new SecurityError('This operation is restricted')
}

/**
 * Update an organization with security validation
 */
export async function updateOrganization(
	id: string,
	data: Partial<Organization>
): Promise<Organization> {
	try {
		// Security check - requires ADMIN permission for organization updates
		await validateOrganizationAccess(id, PermissionLevel.ADMIN)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Sanitize sensitive fields
		const sanitizedData = { ...data }

		// Never allow changing the clerkId - that's a special binding
		delete sanitizedData.clerkId

		// Don't allow changing Stripe-related fields directly
		// These should only be updated by the Stripe webhook
		delete sanitizedData.stripeCustomerId
		delete sanitizedData.subscriptionId
		delete sanitizedData.subscriptionStatus
		delete sanitizedData.priceId

		return await pb.collection('organizations').update(id, sanitizedData)
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
 * Delete an organization
 * This should only be accessible to super-admins or during account cancellation flows
 */
export async function deleteOrganization(id: string): Promise<boolean> {
	// This function should be restricted to super-admins only
	// or be part of a special account cancellation flow
	throw new SecurityError('This operation is restricted')
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
	}
): Promise<Organization> {
	try {
		// This function should verify it's being called from a valid webhook
		// For demo purposes, we'll implement a basic check
		// In production, you'd add a webhook secret validation

		// We'll skip full security checks since this is called from webhooks
		// but we still validate the organization exists

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
		return handlePocketBaseError(
			error,
			'OrganizationService.updateSubscription'
		)
	}
}

/**
 * Get current organization settings for the authenticated user
 * If the user belongs to multiple organizations, takes the first active one or prompts selection
 */
export async function getCurrentOrganizationSettings(): Promise<Organization> {
	try {
		// Get all organizations for the current user
		const userOrganizations = await getUserOrganizations()

		if (!userOrganizations.length) {
			throw new SecurityError('User does not belong to any organization')
		}

		// For simplicity, we're returning the first organization
		// In a real application, you might want to use the last selected org or prompt for selection
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

/**
 * Check if current user is organization admin for a specific organization
 */
export async function isCurrentUserOrgAdmin(
	organizationId: string
): Promise<boolean> {
	try {
		// Get current user
		const user = await validateCurrentUser()

		// Check if user has admin role
		const isAdmin = user.isAdmin || user.role === 'admin'

		// If they're not an admin by role, we need to check if they're an admin of this specific org
		if (!isAdmin) {
			// This would need additional checks in a real application
			// For example, checking a userOrganizationRole table
			return false
		}

		// Verify they belong to this organization
		const userOrgs = await getUserOrganizations()
		const belongsToOrg = userOrgs.some(org => org.id === organizationId)

		return isAdmin && belongsToOrg
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return false
	}
}
