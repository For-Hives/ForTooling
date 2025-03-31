/**
 * Core types for PocketBase data models
 * These types represent the schema of our database collections
 */

/**
 * Base type for all PocketBase records
 */
export interface BaseRecord {
	id: string
	created: string
	updated: string
	collectionId?: string
	collectionName?: string
}

/**
 * Organization record
 */
export interface Organization extends BaseRecord {
	name: string
	email: string | ''
	phone: string | ''
	address: string | ''
	settings: Record<string, unknown>
	clerkId: string
	stripeCustomerId: string | ''
	subscriptionId: string | ''
	subscriptionStatus: string | ''
	priceId: string | ''
}

/**
 * AppUser record
 */
export interface AppUser extends BaseRecord {
	email: string | ''
	emailVisibility: boolean
	verified: boolean
	name: string | ''
	role: string | ''
	isAdmin: boolean
	lastLogin: string | ''
	clerkId: string
	organizations: string | ''
	metadata: {
		createdAt: number
		externalAccounts?: Array<{
			email: string
			imageUrl: string
			provider: string
			providerUserId: string
		}>
		hasCompletedOnboarding?: boolean
		lastActiveAt?: number
		onboardingCompletedAt?: string
		public?: {
			hasCompletedOnboarding: boolean
			onboardingCompletedAt: string
		}
		updatedAt?: number
	}
}

/**
 * Equipment record
 */
export interface Equipment extends BaseRecord {
	organization: string
	name: string
	qrNfcCode: string
	tags: string | ''
	notes: string | ''
	acquisitionDate: string | ''
	parentEquipment?: string | ''
}

/**
 * Project record
 */
export interface Project extends BaseRecord {
	name: string
	address: string | ''
	notes: string | ''
	startDate: string | ''
	endDate: string | ''
	organization: string
}

/**
 * Assignment record
 */
export interface Assignment extends BaseRecord {
	organization: string
	equipment: string
	assignedToUser?: string | ''
	assignedToProject?: string | ''
	startDate: string
	endDate: string | ''
	notes: string | ''
}

/**
 * ActivityLog record
 */
export interface ActivityLog extends BaseRecord {
	organization?: string | ''
	user?: string | ''
	equipment?: string | ''
	metadata: Record<string, unknown>
}

/**
 * Image record
 */
export interface Image extends BaseRecord {
	title: string | ''
	alt: string | ''
	caption: string | ''
	image: string
}

/**
 * PocketBase response types
 */
export interface ListResult<T> {
	page: number
	perPage: number
	totalItems: number
	totalPages: number
	items: T[]
}

/**
 * Generic query parameters for list operations
 */
export interface QueryParams {
	page?: number
	perPage?: number
	sort?: string
	filter?: string
	expand?: string
}
