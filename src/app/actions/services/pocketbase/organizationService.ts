'use server'

import {
	getPocketBase,
	handlePocketBaseError,
} from '@/app/actions/services/pocketbase/baseService'
import {
	validateCurrentUser,
	validateOrganizationAccess,
	validateResourceAccess,
	ResourceType,
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

		const organization = await pb
			.collection('organizations')
			.getFirstListItem(`clerkId=`${clerkId}``)

		// After fetching, verify that the user belongs to this organization
		if (user.organization !== organization.id) {
			throw new SecurityError('User does not belong to this organization')
		}

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
 */
export async function getCurrentOrganizationSettings(): Promise<Organization> {
	try {
		// Get the current authenticated user
		const user = await validateCurrentUser()

		// Get their organization
		const organizationId = user.organization

		// Fetch the organization with validated access
		return await getOrganization(organizationId)
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
 * Check if current user is organization admin
 */
export async function isCurrentUserOrgAdmin(): Promise<boolean> {
	try {
		// Get current user
		const user = await validateCurrentUser()

		// Check admin status
		return user.isAdmin || user.role === 'admin'
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return false
	}
}
