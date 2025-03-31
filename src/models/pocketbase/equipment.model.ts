import { z } from 'zod'

import {
	BaseRecord,
	baseRecordSchema,
	createServiceSchemas,
} from './base.model'

/**
 * ========================================
 * EQUIPMENT TYPES
 * ========================================
 */

/**
 * Equipment record interface
 * Represents the data structure for equipment items in the system
 */
export interface Equipment extends BaseRecord {
	organization: string
	name: string
	qrNfcCode: string
	tags: string
	notes: string
	acquisitionDate: string
	parentEquipment?: string
}

/**
 * Type definition for equipment creation input
 * Contains all fields required when creating a new equipment
 */
export interface EquipmentCreateInput {
	organization: string
	name: string
	qrNfcCode: string
	tags?: string
	notes?: string
	acquisitionDate?: string
	parentEquipment?: string
}

/**
 * Type definition for equipment update input
 * All fields are optional as updates can be partial
 */
export type EquipmentUpdateInput = Partial<EquipmentCreateInput>

/**
 * ========================================
 * EQUIPMENT SCHEMAS
 * ========================================
 */

/**
 * Equipment schema for validation
 * Defines validation rules for equipment records from PocketBase
 */
export const equipmentSchema = baseRecordSchema.extend({
	acquisitionDate: z.string(),
	name: z.string(),
	notes: z.string(),
	organization: z.string(),
	parentEquipment: z.string().optional(),
	qrNfcCode: z.string(),
	tags: z.string(),
})

/**
 * Generated schemas for equipment CRUD operations
 * We use the update schema but create a custom create schema
 */
const { updateSchema } = createServiceSchemas(equipmentSchema)

/**
 * Schema for equipment creation
 * Use this for validating data when creating new equipment
 */
export const equipmentCreateSchema = z
	.object({
		acquisitionDate: z.string().optional(),
		name: z.string(),
		notes: z.string().optional(),
		organization: z.string(),
		parentEquipment: z.string().optional(),
		qrNfcCode: z.string(),
		tags: z.string().optional(),
	})
	.transform(data => {
		// Ensure all string fields have default values
		return {
			...data,
			acquisitionDate: data.acquisitionDate || '',
			notes: data.notes || '',
			tags: data.tags || '',
		}
	}) as z.ZodType<EquipmentCreateInput>

/**
 * Schema for equipment updates
 * Use this for validating data when updating equipment
 */
export const equipmentUpdateSchema =
	updateSchema as z.ZodType<EquipmentUpdateInput>
