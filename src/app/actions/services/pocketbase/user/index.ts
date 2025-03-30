/**
 * User service - public exports
 */

// Core operations
export {
	getUser,
	getCurrentUser,
	getUserByClerkId,
	createUser,
	updateUser,
	deleteUser,
} from '@/app/actions/services/pocketbase/user/core'

// Search functions
export {
	getUsersList,
	getUsersByOrganization,
	getUserCount,
	searchUsers,
} from '@/app/actions/services/pocketbase/user/search'

// Authentication functions
export { updateUserLastLogin } from '@/app/actions/services/pocketbase/user/auth'

// Webhook handlers
export {
	handleWebhookCreated,
	handleWebhookUpdated,
	handleWebhookDeleted,
} from '@/app/actions/services/pocketbase/user/webhook-handlers'

// Internal functions that might be used by other services
export { getByClerkId } from '@/app/actions/services/pocketbase/user/internal'
