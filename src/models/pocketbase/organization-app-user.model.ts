import { z } from 'zod'

import {
	BaseRecord,
	baseRecordSchema,
	createServiceSchemas,
} from './base.model'

/**
 * ========================================
 * ORGANIZATION APP USER TYPES
 * ========================================
 */

/**
 * OrganizationAppUser record interface
 */
export interface OrganizationAppUser extends BaseRecord {
	organization: string
	appUser: string
	role: string
}

/**
 * Type definition for organization app user creation input
 */
export interface OrganizationAppUserCreateInput {
	organization: string
	appUser: string
	role?: string
}

/**
 * Type definition for organization app user update input
 */
export type OrganizationAppUserUpdateInput =
	Partial<OrganizationAppUserCreateInput>

/**
 * ========================================
 * ORGANIZATION APP USER SCHEMAS
 * ========================================
 */

/**
 * OrganizationAppUser schema for validation
 */
export const organizationAppUserSchema = baseRecordSchema.extend({
	appUser: z.string(),
	organization: z.string(),
	role: z.string().optional().or(z.literal('')),
})

/**
 * Generated schemas for organization app user CRUD operations
 */
const { createSchema, updateSchema } = createServiceSchemas(
	organizationAppUserSchema
)

/**
 * Schema for organization app user creation
 */
export const organizationAppUserCreateSchema = createSchema.transform(data => {
	// Ensure all optional fields have default values
	return {
		...data,
		role: data.role || 'member',
	}
}) as z.ZodType<OrganizationAppUserCreateInput>

/**
 * Schema for organization app user updates
 */
export const organizationAppUserUpdateSchema =
	updateSchema as z.ZodType<OrganizationAppUserUpdateInput>
