import {
	BaseRecord,
	baseRecordSchema,
	createServiceSchemas,
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
	isAdmin: boolean
	lastLogin: string
	clerkId: string
	organizations: string
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
 * Type definition for app user creation input
 */
export interface AppUserCreateInput {
	email: string
	emailVisibility?: boolean
	verified?: boolean
	name?: string
	role?: string
	isAdmin?: boolean
	lastLogin?: string
	clerkId: string
	organizations?: string
	metadata?: {
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
 * Type definition for app user update input
 */
export type AppUserUpdateInput = Partial<AppUserCreateInput>

/**
 * ========================================
 * APP USER SCHEMAS
 * ========================================
 */

/**
 * External account schema (for metadata)
 */
const externalAccountSchema = z.object({
	email: z.string().email(),
	imageUrl: z.string().url(),
	provider: z.string(),
	providerUserId: z.string(),
})

/**
 * Metadata public schema (for metadata)
 */
const metadataPublicSchema = z.object({
	hasCompletedOnboarding: z.boolean(),
	onboardingCompletedAt: z.string(),
})

/**
 * Metadata schema for app user
 */
const metadataSchema = z
	.object({
		createdAt: z.number().optional(),
		externalAccounts: z.array(externalAccountSchema).optional(),
		hasCompletedOnboarding: z.boolean().optional(),
		lastActiveAt: z.number().optional(),
		onboardingCompletedAt: z.string().optional(),
		public: metadataPublicSchema.optional(),
		updatedAt: z.number().optional(),
	})
	.optional()
	.default({})

/**
 * AppUser schema for validation
 */
export const appUserSchema = baseRecordSchema.extend({
	clerkId: z.string(),
	email: z.string().email(),
	emailVisibility: z.boolean().default(true),
	isAdmin: z.boolean().default(false),
	lastLogin: z.string().optional().or(z.literal('')),
	metadata: metadataSchema,
	name: z.string().optional().or(z.literal('')),
	organizations: z.string().optional().or(z.literal('')),
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
		isAdmin: data.isAdmin ?? false,
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
