'use server'

import {
	getPocketBase,
	handlePocketBaseError,
	RecordData,
} from '@/app/actions/services/pocketbase/baseService'
import {
	validateCurrentUser,
	validateOrganizationAccess,
	PermissionLevel,
	SecurityError,
} from '@/app/actions/services/pocketbase/securityUtils'
import { userService } from '@/app/actions/services/pocketbase/userService'
import {
	Organization,
	User,
	ListOptions,
	ListResult,
} from '@/types/types_pocketbase'
import {
	ClerkOrganizationWebhookData,
	ClerkMembershipWebhookData,
	WebhookProcessingResult,
} from '@/types/webhooks'

// ============================
// Internal methods (no security checks)
// ============================

/**
 * Internal: Create organization without security checks
 * @param data Organization data
 */
async function _createOrganization(
	data: Partial<Organization>
): Promise<Organization> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		return await pb.collection('organizations').create(data)
	} catch (error) {
		return handlePocketBaseError(
			error,
			'OrganizationService._createOrganization'
		)
	}
}

/**
 * Internal: Update organization without security checks
 * @param id Organization ID
 * @param data Updated organization data
 */
async function _updateOrganization(
	id: string,
	data: Partial<Organization>
): Promise<Organization> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		return await pb.collection('organizations').update(id, data)
	} catch (error) {
		return handlePocketBaseError(
			error,
			'OrganizationService._updateOrganization'
		)
	}
}

/**
 * Internal: Delete organization without security checks
 * @param id Organization ID
 */
async function _deleteOrganization(id: string): Promise<boolean> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		await pb.collection('organizations').delete(id)
		return true
	} catch (error) {
		handlePocketBaseError(error, 'OrganizationService._deleteOrganization')
		return false
	}
}

/**
 * Internal: Add user to organization without security checks
 * @param userId User ID
 * @param organizationId Organization ID
 */
async function _addUserToOrganization(
	userId: string,
	organizationId: string
): Promise<User> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Get the user
		const user = await pb.collection('users').getOne(userId, {
			expand: 'organizations',
		})

		// Get current organizations
		let currentOrgs = user.organizations || []
		if (typeof currentOrgs === 'string') {
			currentOrgs = [currentOrgs]
		}

		// Check if user is already in organization
		if (!currentOrgs.includes(organizationId)) {
			// Add organization to user's organizations list
			currentOrgs.push(organizationId)
		}

		// Update user with new organizations list
		return await pb.collection('users').update(userId, {
			organizations: currentOrgs,
		})
	} catch (error) {
		return handlePocketBaseError(
			error,
			'OrganizationService._addUserToOrganization'
		)
	}
}

/**
 * Internal: Remove user from organization without security checks
 * @param userId User ID
 * @param organizationId Organization ID
 */
async function _removeUserFromOrganization(
	userId: string,
	organizationId: string
): Promise<User> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Get the user
		const user = await pb.collection('users').getOne(userId, {
			expand: 'organizations',
		})

		// Get current organizations
		let currentOrgs = user.organizations || []
		if (typeof currentOrgs === 'string') {
			currentOrgs = [currentOrgs]
		}

		// Remove organization from user's organizations list
		const updatedOrgs = currentOrgs.filter(orgId => orgId !== organizationId)

		// Update user with new organizations list
		return await pb.collection('users').update(userId, {
			organizations: updatedOrgs,
		})
	} catch (error) {
		return handlePocketBaseError(
			error,
			'OrganizationService._removeUserFromOrganization'
		)
	}
}

// ============================
// Public API methods (with security)
// ============================

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
 * Get all users in an organization
 */
export async function getOrganizationUsers(
	organizationId: string
): Promise<User[]> {
	try {
		// Security check - validates user has access to this organization
		await validateOrganizationAccess(organizationId, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Query users with this organization in their organizations list
		const result = await pb.collection('users').getList(1, 100, {
			filter: `organizations ~ "${organizationId}"`,
		})

		return result.items
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(
			error,
			'OrganizationService.getOrganizationUsers'
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

		if (!isAdmin) {
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

/**
 * Add a user to an organization
 */
export async function addUserToOrganization(
	userId: string,
	organizationId: string,
	elevated = false
): Promise<User> {
	try {
		if (!elevated) {
			// Security check - requires ADMIN permission for member management
			await validateOrganizationAccess(organizationId, PermissionLevel.ADMIN)
		}

		return await _addUserToOrganization(userId, organizationId)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(
			error,
			'OrganizationService.addUserToOrganization'
		)
	}
}

/**
 * Remove a user from an organization
 */
export async function removeUserFromOrganization(
	userId: string,
	organizationId: string,
	elevated = false
): Promise<User> {
	try {
		if (!elevated) {
			// Security check - requires ADMIN permission for member management
			await validateOrganizationAccess(organizationId, PermissionLevel.ADMIN)
		}

		return await _removeUserFromOrganization(userId, organizationId)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(
			error,
			'OrganizationService.removeUserFromOrganization'
		)
	}
}

/**
 * Gets an organization by Clerk ID
 * @param {string} clerkId - Clerk organization ID
 * @returns {Promise<Organization | null>} Organization record or null if not found
 */
export async function getByClerkId(
	clerkId: string
): Promise<Organization | null> {
	try {
		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		const organization = await pb
			.collection('organizations')
			.getFirstListItem(`clerkId=${clerkId}`)
		return organization as Organization
	} catch (error) {
		// If organization not found, return null instead of throwing
		if (error instanceof Error && error.message.includes('404')) {
			return null
		}
		console.error('Error fetching organization by clerk ID:', error)
		return null
	}
}

// ============================
// Webhook handler methods
// ============================

/**
 * Handles a webhook event for organization creation
 * @param {ClerkOrganizationWebhookData} data - Organization data from Clerk
 * @param {boolean} elevated - Whether operation has elevated permissions
 * @returns {Promise<WebhookProcessingResult>} Processing result
 */
export async function handleWebhookCreated(
	data: ClerkOrganizationWebhookData,
	elevated = true
): Promise<WebhookProcessingResult> {
	try {
		// Check if already exists
		const existing = await getByClerkId(data.id)
		if (existing) {
			return {
				message: `Organization ${data.id} already exists`,
				success: true,
			}
		}

		// Create new organization
		await createOrganization(
			{
				clerkId: data.id,
				name: data.name,
				settings: {
					imageUrl: data.image_url || null,
					logoUrl: data.logo_url || null,
					slug: data.slug || null,
				},
			},
			elevated
		)

		return {
			message: `Created organization ${data.id}`,
			success: true,
		}
	} catch (error) {
		console.error('Failed to process organization creation webhook:', error)
		return {
			message: `Failed to process organization creation: ${error instanceof Error ? error.message : 'Unknown error'}`,
			success: false,
		}
	}
}

/**
 * Handles a webhook event for organization update
 * @param {ClerkOrganizationWebhookData} data - Organization data from Clerk
 * @param {boolean} elevated - Whether operation has elevated permissions
 * @returns {Promise<WebhookProcessingResult>} Processing result
 */
export async function handleWebhookUpdated(
	data: ClerkOrganizationWebhookData,
	elevated = true
): Promise<WebhookProcessingResult> {
	try {
		// Find existing organization
		const existing = await getByClerkId(data.id)
		if (!existing) {
			return {
				message: `Organization ${data.id} not found`,
				success: false,
			}
		}

		// Update organization
		await updateOrganization(
			existing.id,
			{
				name: data.name,
				settings: {
					...existing.settings,
					imageUrl: data.image_url || existing.settings?.imageUrl || null,
					logoUrl: data.logo_url || existing.settings?.logoUrl || null,
					slug: data.slug || existing.settings?.slug || null,
				},
			},
			elevated
		)

		return {
			message: `Updated organization ${data.id}`,
			success: true,
		}
	} catch (error) {
		console.error('Failed to process organization update webhook:', error)
		return {
			message: `Failed to process organization update: ${error instanceof Error ? error.message : 'Unknown error'}`,
			success: false,
		}
	}
}

/**
 * Handles a webhook event for organization deletion
 * @param {ClerkOrganizationWebhookData} data - Organization deletion data from Clerk
 * @param {boolean} elevated - Whether operation has elevated permissions
 * @returns {Promise<WebhookProcessingResult>} Processing result
 */
export async function handleWebhookDeleted(
	data: ClerkOrganizationWebhookData,
	elevated = true
): Promise<WebhookProcessingResult> {
	try {
		// Find existing organization
		const existing = await getByClerkId(data.id)
		if (!existing) {
			return {
				message: `Organization ${data.id} already deleted or not found`,
				success: true,
			}
		}

		// Delete organization
		await deleteOrganization(existing.id, elevated)

		return {
			message: `Deleted organization ${data.id}`,
			success: true,
		}
	} catch (error) {
		console.error('Failed to process organization deletion webhook:', error)
		return {
			message: `Failed to process organization deletion: ${error instanceof Error ? error.message : 'Unknown error'}`,
			success: false,
		}
	}
}

/**
 * Handles membership creation from webhook
 * @param {ClerkMembershipWebhookData} data - Membership data from Clerk
 * @param {boolean} elevated - Whether operation has elevated permissions
 * @returns {Promise<WebhookProcessingResult>} Processing result
 */
export async function handleMembershipWebhookCreated(
	data: ClerkMembershipWebhookData,
	elevated = true
): Promise<WebhookProcessingResult> {
	try {
		// Get organization and user
		const organization = await getByClerkId(data.organization.id)
		if (!organization) {
			return {
				message: `Organization with Clerk ID ${data.organization.id} not found`,
				success: false,
			}
		}

		const user = await userService.getByClerkId(data.public_user_data.user_id)
		if (!user) {
			return {
				message: `User with Clerk ID ${data.public_user_data.user_id} not found`,
				success: false,
			}
		}

		// Add user to organization
		await addUserToOrganization(user.id, organization.id, elevated)

		// Update user role if needed
		if (data.role === 'admin') {
			await userService.updateUser(
				user.id,
				{
					role: 'admin',
				},
				elevated
			)
		}

		return {
			message: `Added user ${user.id} to organization ${organization.id}`,
			success: true,
		}
	} catch (error) {
		console.error('Failed to process membership creation webhook:', error)
		return {
			message: `Failed to process membership creation: ${error instanceof Error ? error.message : 'Unknown error'}`,
			success: false,
		}
	}
}

/**
 * Handles membership update from webhook
 * @param {ClerkMembershipWebhookData} data - Membership data from Clerk
 * @param {boolean} elevated - Whether operation has elevated permissions
 * @returns {Promise<WebhookProcessingResult>} Processing result
 */
export async function handleMembershipWebhookUpdated(
	data: ClerkMembershipWebhookData,
	elevated = true
): Promise<WebhookProcessingResult> {
	try {
		// Get organization and user
		const organization = await getByClerkId(data.organization.id)
		if (!organization) {
			return {
				message: `Organization with Clerk ID ${data.organization.id} not found`,
				success: false,
			}
		}

		const user = await userService.getByClerkId(data.public_user_data.user_id)
		if (!user) {
			return {
				message: `User with Clerk ID ${data.public_user_data.user_id} not found`,
				success: false,
			}
		}

		// Update user role if needed
		if (data.role === 'admin') {
			await userService.updateUser(
				user.id,
				{
					role: 'admin',
				},
				elevated
			)
		} else if (data.role === 'basic_member') {
			await userService.updateUser(
				user.id,
				{
					role: 'member',
				},
				elevated
			)
		}

		return {
			message: `Updated user ${user.id} role in organization ${organization.id}`,
			success: true,
		}
	} catch (error) {
		console.error('Failed to process membership update webhook:', error)
		return {
			message: `Failed to process membership update: ${error instanceof Error ? error.message : 'Unknown error'}`,
			success: false,
		}
	}
}

/**
 * Handles membership deletion from webhook
 * @param {ClerkMembershipWebhookData} data - Membership data from Clerk
 * @param {boolean} elevated - Whether operation has elevated permissions
 * @returns {Promise<WebhookProcessingResult>} Processing result
 */
export async function handleMembershipWebhookDeleted(
	data: ClerkMembershipWebhookData,
	elevated = true
): Promise<WebhookProcessingResult> {
	try {
		// Get organization and user
		const organization = await getByClerkId(data.organization.id)
		if (!organization) {
			return {
				message: `Organization with Clerk ID ${data.organization.id} not found`,
				success: true,
			}
		}

		const user = await userService.getByClerkId(data.public_user_data.user_id)
		if (!user) {
			return {
				message: `User with Clerk ID ${data.public_user_data.user_id} not found`,
				success: true,
			}
		}

		// Remove user from organization
		await removeUserFromOrganization(user.id, organization.id, elevated)

		return {
			message: `Removed user ${user.id} from organization ${organization.id}`,
			success: true,
		}
	} catch (error) {
		console.error('Failed to process membership deletion webhook:', error)
		return {
			message: `Failed to process membership deletion: ${error instanceof Error ? error.message : 'Unknown error'}`,
			success: false,
		}
	}
}
