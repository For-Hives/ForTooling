import {
	BaseRecord,
	baseRecordSchema,
	createServiceSchemas,
	normalizeDateTime,
} from '@/models/pocketbase/base.model'
import { z } from 'zod'

/**
 * ========================================
 * APP USER TYPES
 * ========================================
 */

/**
 * AppUser record interface
 */
export interface AppUser extends BaseRecord {
	email: string
	emailVisibility: boolean
	verified: boolean
	name: string
	role: string
	lastLogin: string
	clerkId: string
	organizations: string
	metadata: {
		createdAt: string
		externalAccounts?: Array<{
			email: string
			imageUrl: string
			provider: string
			providerUserId: string
		}>
		hasCompletedOnboarding?: boolean
		lastActiveAt?: string
		onboardingCompletedAt?: string
		public?: {
			hasCompletedOnboarding: boolean
			onboardingCompletedAt: string
		}
		updatedAt?: string
	}
}

/**
 * Type definition for app user creation input
 */
export interface AppUserCreateInput {
	email: string
	emailVisibility?: boolean
	verified?: boolean
	name?: string
	role?: string
	lastLogin?: string
	clerkId: string
	organizations?: string
	metadata?: {
		createdAt: string
		externalAccounts?: Array<{
			email: string
			imageUrl: string
			provider: string
			providerUserId: string
		}>
		hasCompletedOnboarding?: boolean
		lastActiveAt?: string
		onboardingCompletedAt?: string
		public?: {
			hasCompletedOnboarding: boolean
			onboardingCompletedAt: string
		}
		updatedAt?: string
	}
}

/**
 * Type definition for app user update input
 */
export type AppUserUpdateInput = Partial<AppUserCreateInput>

/**
 * ========================================
 * APP USER SCHEMAS
 * ========================================
 */

/**
 * Metadata schema for app user
 */
const appUserMetadataSchema = z
	.object({
		createdAt: z.union([z.number(), z.string()]),
		externalAccounts: z
			.array(
				z.object({
					email: z.string().optional(),
					imageUrl: z.string().optional(),
					provider: z.string(),
					providerUserId: z.string(),
				})
			)
			.optional(),
		hasCompletedOnboarding: z.boolean().optional(),
		lastActiveAt: z.union([z.number(), z.string()]),
		onboardingCompletedAt: z.string().optional(),
		public: z
			.object({
				hasCompletedOnboarding: z.boolean().optional(),
				onboardingCompletedAt: z.string().optional(),
			})
			.optional(),
		updatedAt: z.union([z.number(), z.string()]),
	})
	.passthrough()

/**
 * AppUser schema for validation
 */
export const appUserSchema = baseRecordSchema.extend({
	clerkId: z.string(),
	email: z.string().email(),
	emailVisibility: z.boolean().default(true),
	lastLogin: z
		.string()
		.optional()
		.or(z.literal(''))
		.transform((val: string | undefined | '') => {
			if (!val) return ''
			return normalizeDateTime(val)
		}),
	metadata: appUserMetadataSchema,
	name: z.string().optional().or(z.literal('')),
	organizations: z
		.union([z.string(), z.array(z.any())])
		.optional()
		.transform(val => {
			return typeof val === 'string' ? val : ''
		}),
	role: z.string().optional().or(z.literal('')),
	verified: z.boolean().default(false),
})

/**
 * Generated schemas for app user CRUD operations
 */
const { createSchema, updateSchema } = createServiceSchemas(appUserSchema)

/**
 * Schema for app user creation
 */
export const appUserCreateSchema = createSchema.transform(data => {
	// Ensure all optional fields have default values
	return {
		...data,
		emailVisibility: data.emailVisibility ?? true,
		lastLogin: data.lastLogin || '',
		metadata: data.metadata || { createdAt: Date.now() },
		name: data.name || '',
		organizations: data.organizations || '',
		role: data.role || '',
		verified: data.verified ?? false,
	}
}) as z.ZodType<AppUserCreateInput>

/**
 * Schema for app user updates
 */
export const appUserUpdateSchema = updateSchema as z.ZodType<AppUserUpdateInput>
