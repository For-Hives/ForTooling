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
	email: string | null
	phone: string | null
	address: string | null
	settings: Record<string, unknown> | null

	// Clerk integration fields
	clerkId: string

	// Stripe related fields
	stripeCustomerId?: string
	subscriptionId?: string
	subscriptionStatus?: string
	priceId?: string

	// Expanded relations
	expand?: Record<string, unknown>
}

/**
 * User model (auth collection)
 */
export interface User extends BaseModel {
	email: string
	emailVisibility: boolean
	verified: boolean
	name: string | null
	avatar?: string | null // File field
	phone: string | null
	role: string | null
	isAdmin: boolean
	canLogin: boolean
	lastLogin?: string

	// Clerk integration field
	clerkId?: string

	// Expanded relations
	expand?: Record<string, unknown>
}

/**
 * Equipment model
 */
export interface Equipment extends BaseModel {
	organizationId: string // References Organization.id
	name: string | null
	qrNfcCode: string | null
	tags: string | null // Consider parsing this as string[]
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
		assignedToUserId?: User
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
