import { z } from 'zod'

import {
	BaseRecord,
	baseRecordSchema,
	createServiceSchemas,
} from './base.model'

/**
 * ========================================
 * ORGANIZATION TYPES
 * ========================================
 */

/**
 * Organization record interface
 */
export interface Organization extends BaseRecord {
	name: string
	email: string
	phone: string
	address: string
	settings: Record<string, unknown>
	clerkId: string
	stripeCustomerId: string
	subscriptionId: string
	subscriptionStatus: string
	priceId: string
}

/**
 * Type definition for organization creation input
 */
export interface OrganizationCreateInput {
	name: string
	email?: string
	phone?: string
	address?: string
	settings?: Record<string, unknown>
	clerkId: string
	stripeCustomerId?: string
	subscriptionId?: string
	subscriptionStatus?: string
	priceId?: string
}

/**
 * Type definition for organization update input
 */
export type OrganizationUpdateInput = Partial<OrganizationCreateInput>

/**
 * ========================================
 * ORGANIZATION SCHEMAS
 * ========================================
 */

/**
 * Organization schema for validation
 */
export const organizationSchema = baseRecordSchema.extend({
	address: z.string().optional().or(z.literal('')),
	clerkId: z.string(),
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
 * Generated schemas for organization CRUD operations
 */
const { createSchema, updateSchema } = createServiceSchemas(organizationSchema)

/**
 * Schema for organization creation
 */
export const organizationCreateSchema = createSchema.transform(data => {
	// Ensure all string fields have default values
	return {
		...data,
		address: data.address || '',
		email: data.email || '',
		phone: data.phone || '',
		priceId: data.priceId || '',
		stripeCustomerId: data.stripeCustomerId || '',
		subscriptionId: data.subscriptionId || '',
		subscriptionStatus: data.subscriptionStatus || '',
	}
}) as z.ZodType<OrganizationCreateInput>

/**
 * Schema for organization updates
 */
export const organizationUpdateSchema =
	updateSchema as z.ZodType<OrganizationUpdateInput>
