/**
 * Zod schemas for PocketBase data models
 * These schemas are used for validation of data going in and out of PocketBase
 */
import { z } from 'zod'

/**
 * Base schema for all PocketBase records
 */
export const baseRecordSchema = z.object({
	collectionId: z.string().optional(),
	collectionName: z.string().optional(),
	created: z.string().datetime(),
	id: z.string(),
	updated: z.string().datetime(),
})

/**
 * Organization schema
 */
export const organizationSchema = baseRecordSchema.extend({
	address: z.string().optional().or(z.literal('')),
	clerkId: z.string().optional().or(z.literal('')),
	email: z.string().email().optional().or(z.literal('')),
	name: z.string(),
	phone: z.string().optional().or(z.literal('')),
	priceId: z.string().optional().or(z.literal('')),
	settings: z.record(z.string(), z.unknown()).optional().default({}),
	stripeCustomerId: z.string().optional().or(z.literal('')),
	subscriptionId: z.string().optional().or(z.literal('')),
	subscriptionStatus: z.string().optional().or(z.literal('')),
})

/**
 * AppUser schema
 */
export const appUserSchema = baseRecordSchema.extend({
	clerkId: z.string().optional().or(z.literal('')),
	email: z.string().email().optional().or(z.literal('')),
	emailVisibility: z.boolean().optional().default(true),
	isAdmin: z.boolean().optional().default(false),
	lastLogin: z.string().datetime().optional().or(z.literal('')),
	metadata: z
		.object({
			createdAt: z.number().optional(),
			externalAccounts: z
				.array(
					z.object({
						email: z.string().email(),
						imageUrl: z.string().url(),
						provider: z.string(),
						providerUserId: z.string(),
					})
				)
				.optional(),
			hasCompletedOnboarding: z.boolean().optional(),
			lastActiveAt: z.number().optional(),
			onboardingCompletedAt: z.string().optional(),
			public: z
				.object({
					hasCompletedOnboarding: z.boolean(),
					onboardingCompletedAt: z.string(),
				})
				.optional(),
			updatedAt: z.number().optional(),
		})
		.optional()
		.default({}),
	name: z.string().optional().or(z.literal('')),
	organizations: z.string().optional().or(z.literal('')),
	role: z.string().optional().or(z.literal('')),
	verified: z.boolean().optional().default(false),
})

/**
 * Equipment schema
 */
export const equipmentSchema = baseRecordSchema.extend({
	acquisitionDate: z.string().datetime().optional().or(z.literal('')),
	name: z.string(),
	notes: z.string().optional().or(z.literal('')),
	organization: z.string(),
	parentEquipment: z.string().optional().or(z.literal('')),
	qrNfcCode: z.string(),
	tags: z.string().optional().or(z.literal('')),
})

/**
 * Project schema
 */
export const projectSchema = baseRecordSchema.extend({
	address: z.string().optional().or(z.literal('')),
	endDate: z.string().datetime().optional().or(z.literal('')),
	name: z.string(),
	notes: z.string().optional().or(z.literal('')),
	organization: z.string(),
	startDate: z.string().datetime().optional().or(z.literal('')),
})

/**
 * Assignment schema
 */
export const assignmentSchema = baseRecordSchema.extend({
	assignedToProject: z.string().optional().or(z.literal('')),
	assignedToUser: z.string().optional().or(z.literal('')),
	endDate: z.string().datetime().optional().or(z.literal('')),
	equipment: z.string(),
	notes: z.string().optional().or(z.literal('')),
	organization: z.string(),
	startDate: z.string().datetime(),
})

/**
 * ActivityLog schema
 */
export const activityLogSchema = baseRecordSchema.extend({
	equipment: z.string().optional().or(z.literal('')),
	metadata: z.record(z.string(), z.unknown()).optional().default({}),
	organization: z.string().optional().or(z.literal('')),
	user: z.string().optional().or(z.literal('')),
})

/**
 * Image schema
 */
export const imageSchema = baseRecordSchema.extend({
	alt: z.string().optional().or(z.literal('')),
	caption: z.string().optional().or(z.literal('')),
	image: z.string(),
	title: z.string().optional().or(z.literal('')),
})

/**
 * List result schema (generic)
 */
export const listResultSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
	z.object({
		items: z.array(itemSchema),
		page: z.number(),
		perPage: z.number(),
		totalItems: z.number(),
		totalPages: z.number(),
	})

/**
 * Query parameters schema
 */
export const queryParamsSchema = z.object({
	expand: z.string().optional(),
	filter: z.string().optional(),
	page: z.number().optional(),
	perPage: z.number().optional(),
	sort: z.string().optional(),
})
