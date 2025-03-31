import type {
	EquipmentCreateInput,
	EquipmentUpdateInput,
} from '@/types/pocketbase'

import {
	baseRecordSchema,
	createServiceSchemas,
} from '@/schemas/pocketbase/base'
import { z } from 'zod'

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
