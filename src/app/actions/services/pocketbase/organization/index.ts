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
} from '@/app/actions/services/pocketbase/organization/core'

// Membership functions
export {
	addUserToOrganization,
	removeUserFromOrganization,
	getOrganizationUsers,
} from '@/app/actions/services/pocketbase/organization/membership'

// Security utilities
export { isCurrentUserOrgAdmin } from '@/app/actions/services/pocketbase/organization/security'

// Webhook handlers
export {
	handleWebhookCreated,
	handleWebhookUpdated,
	handleWebhookDeleted,
	handleMembershipWebhookCreated,
	handleMembershipWebhookUpdated,
	handleMembershipWebhookDeleted,
} from '@/app/actions/services/pocketbase/organization/webhook-handlers'

// Internal functions for direct access when needed
export { getByClerkId } from '@/app/actions/services/pocketbase/organization/internal'
