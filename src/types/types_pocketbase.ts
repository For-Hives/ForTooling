/**
 * Common fields for all record models
 */
export interface BaseModel {
	id: string
	created: string
	updated: string
	collectionId: string
	collectionName: string
}

/**
 * Organization model
 */
export interface Organization extends BaseModel {
	name: string
	email?: string
	phone?: string
	address?: string
	settings?: Record<string, unknown>

	// Clerk integration fields
	clerkId: string

	// Stripe related fields
	stripeCustomerId?: string
	subscriptionId?: string
	subscriptionStatus?: string
	priceId?: string
}

/**
 * User model (auth collection)
 */
export interface AppUser {
	id: string
	email: string
	emailVisibility: boolean
	verified: boolean
	name: string
	avatar?: string
	phone?: string
	role?: string
	isAdmin: boolean
	lastLogin?: string
	clerkId: string
	organizations?: Organization[]
	created: string
	updated: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	metadata?: Record<string, any>
}

/**
 * Equipment model
 */
export interface Equipment extends BaseModel {
	organizationId: string // References Organization.id
	name: string | null
	qrNfcCode: string | null
	tags: string[]
	notes: string | null
	acquisitionDate: string | null // ISO date string
	parentEquipmentId: string | null // Self-reference

	// Expanded relations
	expand?: {
		organizationId?: Organization
		parentEquipmentId?: Equipment
	}
}

/**
 * Project model
 */
export interface Project extends BaseModel {
	name: string | null
	address: string | null
	notes: string | null
	startDate: string | null // ISO date string
	endDate: string | null // ISO date string
	organizationId: string // References Organization.id

	// Expanded relations
	expand?: {
		organizationId?: Organization
	}
}

/**
 * Assignment model
 */
export interface Assignment extends BaseModel {
	organizationId: string // References Organization.id
	equipmentId: string // References Equipment.id
	assignedToUserId: string | null // References User.id
	assignedToProjectId: string | null // References Project.id
	startDate: string | null // ISO date string
	endDate: string | null // ISO date string
	notes: string | null

	// Expanded relations
	expand?: {
		organizationId?: Organization
		equipmentId?: Equipment
		assignedToUserId?: AppUser
		assignedToProjectId?: Project
	}
}

/**
 * Images model (this will be used to store images for the blog etc)
 */
export interface Image extends BaseModel {
	title: string | null
	alt: string | null
	caption: string | null
	image: string | null

	// Expanded relations
	expand?: Record<string, unknown>
}

/**
 * Filter options for list operations
 */
export interface ListOptions {
	filter?: string
	sort?: string
	expand?: string
	fields?: string
	skipTotal?: boolean
	page?: number
	perPage?: number
	requestKey?: string | null
}

/**
 * Common result format for paginated lists
 */
export interface ListResult<T> {
	page: number
	perPage: number
	totalItems: number
	totalPages: number
	items: T[]
}
