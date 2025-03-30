'use server'

import {
	createEquipment,
	updateEquipment,
	deleteEquipment,
	generateUniqueCode,
} from '@/app/actions/services/pocketbase/equipmentService'
import { SecurityError } from '@/app/actions/services/pocketbase/securityUtils'
import { Equipment } from '@/types/types_pocketbase'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Define validation schema for equipment data
const equipmentSchema = z.object({
	acquisitionDate: z.string().optional(),
	name: z.string().min(2, 'Name must be at least 2 characters'),
	notes: z.string().optional(),
	parentEquipment: z.string().optional(),
	tags: z.array(z.string()).optional(),
})

type EquipmentFormData = z.infer<typeof equipmentSchema>

/**
 * Result type for all equipment actions
 */
export type EquipmentActionResult = {
	success: boolean
	message?: string
	data?: Equipment
	validationErrors?: Record<string, string>
}

/**
 * Convert tags array to string for PocketBase storage
 */
function convertTagsForStorage(tags?: string[]): string | null {
	if (!tags || tags.length === 0) return null
	return JSON.stringify(tags)
}

/**
 * Create a new equipment item
 */
export async function createEquipmentAction(
	organizationId: string,
	formData: EquipmentFormData
): Promise<EquipmentActionResult> {
	try {
		// Validate input data
		const validatedData = equipmentSchema.parse(formData)

		// Generate unique code for the equipment
		const qrNfcCode = await generateUniqueCode()

		// Create the equipment with security checks built into the service
		const newEquipment = await createEquipment(organizationId, {
			acquisitionDate: validatedData.acquisitionDate || null,
			name: validatedData.name,
			notes: validatedData.notes || null,
			parentEquipmentId: validatedData.parentEquipment || null,
			qrNfcCode,
			tags: convertTagsForStorage(validatedData.tags),
		})

		// Revalidate relevant paths to refresh data
		revalidatePath('/dashboard/equipment')

		return {
			data: newEquipment,
			message: 'Equipment created successfully',
			success: true,
		}
	} catch (error) {
		// Handle validation errors
		if (error instanceof z.ZodError) {
			const validationErrors = error.errors.reduce(
				(acc, curr) => {
					const key = curr.path.join('.')
					acc[key] = curr.message
					return acc
				},
				{} as Record<string, string>
			)

			return {
				message: 'Validation failed',
				success: false,
				validationErrors,
			}
		}

		// Handle security errors
		if (error instanceof SecurityError) {
			return {
				message: error.message,
				success: false,
			}
		}

		// Handle other errors
		console.error('Error creating equipment:', error)
		return {
			message:
				error instanceof Error ? error.message : 'An unknown error occurred',
			success: false,
		}
	}
}

/**
 * Update an existing equipment item
 */
export async function updateEquipmentAction(
	equipmentId: string,
	formData: EquipmentFormData
): Promise<EquipmentActionResult> {
	try {
		// Validate input data
		const validatedData = equipmentSchema.parse(formData)

		// Update the equipment with security checks built into the service
		const updatedEquipment = await updateEquipment(equipmentId, {
			acquisitionDate: validatedData.acquisitionDate || null,
			name: validatedData.name,
			notes: validatedData.notes || null,
			parentEquipmentId: validatedData.parentEquipment || null,
			tags: convertTagsForStorage(validatedData.tags),
		})

		// Revalidate relevant paths to refresh data
		revalidatePath('/dashboard/equipment')
		revalidatePath(`/dashboard/equipment/${equipmentId}`)

		return {
			data: updatedEquipment,
			message: 'Equipment updated successfully',
			success: true,
		}
	} catch (error) {
		// Handle validation errors
		if (error instanceof z.ZodError) {
			const validationErrors = error.errors.reduce(
				(acc, curr) => {
					const key = curr.path.join('.')
					acc[key] = curr.message
					return acc
				},
				{} as Record<string, string>
			)

			return {
				message: 'Validation failed',
				success: false,
				validationErrors,
			}
		}

		// Handle security errors
		if (error instanceof SecurityError) {
			return {
				message: error.message,
				success: false,
			}
		}

		// Handle other errors
		console.error('Error updating equipment:', error)
		return {
			message:
				error instanceof Error ? error.message : 'An unknown error occurred',
			success: false,
		}
	}
}

/**
 * Delete an equipment item
 */
export async function deleteEquipmentAction(
	equipmentId: string
): Promise<EquipmentActionResult> {
	try {
		// Delete the equipment with security checks built into the service
		await deleteEquipment(equipmentId)

		// Revalidate relevant paths to refresh data
		revalidatePath('/dashboard/equipment')

		return {
			message: 'Equipment deleted successfully',
			success: true,
		}
	} catch (error) {
		// Handle security errors
		if (error instanceof SecurityError) {
			return {
				message: error.message,
				success: false,
			}
		}

		// Handle other errors
		console.error('Error deleting equipment:', error)
		return {
			message:
				error instanceof Error ? error.message : 'An unknown error occurred',
			success: false,
		}
	}
}
