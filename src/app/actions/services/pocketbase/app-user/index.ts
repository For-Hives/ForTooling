/**
 * AppUser service - public exports
 */

// Core operations
export {
	getAppUser,
	getCurrentAppUser,
	getAppUserByClerkId,
	createAppUser,
	updateAppUser,
	deleteAppUser,
} from '@/app/actions/services/pocketbase/app-user/core'

// Search functions
export {
	getAppUsersList,
	getAppUsersByOrganization,
	getAppUserCount,
	searchAppUsers,
} from '@/app/actions/services/pocketbase/app-user/search'

// Authentication functions
export { updateAppUserLastLogin } from '@/app/actions/services/pocketbase/app-user/auth'

// Webhook handlers
export {
	handleWebhookCreated,
	handleWebhookUpdated,
	handleWebhookDeleted,
} from '@/app/actions/services/pocketbase/app-user/webhook-handlers'

// Internal functions that might be used by other services
export { getByClerkId } from '@/app/actions/services/pocketbase/app-user/internal'
