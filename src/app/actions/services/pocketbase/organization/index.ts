/**
 * Organization service - public exports
 */

// Core operations
export {
	getOrganization,
	getOrganizationByClerkId,
	getUserOrganizations,
	getOrganizationsList,
	createOrganization,
	updateOrganization,
	deleteOrganization,
	updateSubscription,
	getCurrentOrganizationSettings,
} from './core'

// Membership functions
export {
	addUserToOrganization,
	removeUserFromOrganization,
	getOrganizationUsers,
} from './membership'

// Security utilities
export { isCurrentUserOrgAdmin } from './security'

// Webhook handlers
export {
	handleWebhookCreated,
	handleWebhookUpdated,
	handleWebhookDeleted,
	handleMembershipWebhookCreated,
	handleMembershipWebhookUpdated,
	handleMembershipWebhookDeleted,
} from './webhook-handlers'

// Internal functions for direct access when needed
export { getByClerkId } from './internal'
