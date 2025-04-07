'use server'

import {
	EquipmentCreateInput,
	EquipmentUpdateInput,
	getEquipmentService,
} from '@/app/actions/services/pocketbase/equipment_service'
import {
	withSecurity,
	checkResourcePermission,
} from '@/app/actions/services/pocketbase/secured/security_middleware'
import {
	SecurityContext,
	SecurityError,
} from '@/app/actions/services/pocketbase/secured/security_types'
import { Equipment } from '@/models/pocketbase'

/**
 * Get equipment by ID with security checks
 */
export async function getEquipmentById(id: string): Promise<Equipment> {
	const securedFunc = await withSecurity(
		async (id: string, context: SecurityContext): Promise<Equipment> => {
			// Get the equipment
			const equipmentService = getEquipmentService()
			const equipment = await equipmentService.getById(id)

			// Check permission
			if (!(await checkResourcePermission(equipment.organization, context))) {
				throw new SecurityError(
					'Forbidden: You do not have access to this equipment',
					403
				)
			}

			return equipment
		}
	)

	return securedFunc(id)
}

/**
 * List equipment with security context
 */
export async function listOrganizationEquipment(params: {
	searchTerm?: string
	page?: number
	perPage?: number
	sort?: string
}): Promise<{
	items: Equipment[]
	totalItems: number
	totalPages: number
}> {
	const securedFunc = await withSecurity(
		async (
			params: {
				searchTerm?: string
				page?: number
				perPage?: number
				sort?: string
			},
			context: SecurityContext
		): Promise<{
			items: Equipment[]
			totalItems: number
			totalPages: number
		}> => {
			const equipmentService = getEquipmentService()

			// Apply the organization filter automatically
			const filter = params.searchTerm
				? `organization = "${context.orgPbId}" && (name ~ "${params.searchTerm}" || tags ~ "${params.searchTerm}" || notes ~ "${params.searchTerm}")`
				: `organization = "${context.orgPbId}"`

			// Get the equipment list
			const result = await equipmentService.getList({
				filter,
				page: params.page,
				perPage: params.perPage,
				sort: params.sort,
			})

			return {
				items: result.items,
				totalItems: result.totalItems,
				totalPages: result.totalPages,
			}
		}
	)

	return securedFunc(params)
}

/**
 * Create new equipment with security context
 */
export async function createEquipment(
	data: Omit<EquipmentCreateInput, 'organization'>
): Promise<Equipment> {
	const securedFunc = await withSecurity(
		async (
			data: Omit<EquipmentCreateInput, 'organization'>,
			context: SecurityContext
		): Promise<Equipment> => {
			const equipmentService = getEquipmentService()

			// Always set the organization to the current user's organization
			const equipmentData: EquipmentCreateInput = {
				...data,
				organization: context.orgPbId,
			}

			// Generate QR/NFC code if not provided
			if (!equipmentData.qrNfcCode) {
				equipmentData.qrNfcCode = await equipmentService.generateUniqueCode()
			}

			return equipmentService.create(equipmentData)
		},
		{ revalidatePaths: ['/app/equipment'] }
	)

	return securedFunc(data)
}

/**
 * Update equipment with security checks
 */
export async function updateEquipment(params: {
	id: string
	data: EquipmentUpdateInput
}): Promise<Equipment> {
	const securedFunc = await withSecurity(
		async (
			params: { id: string; data: EquipmentUpdateInput },
			context: SecurityContext
		): Promise<Equipment> => {
			const equipmentService = getEquipmentService()

			// Get the equipment first to check permissions
			const existingEquipment = await equipmentService.getById(params.id)

			// Check permission
			if (
				!(await checkResourcePermission(
					existingEquipment.organization,
					context
				))
			) {
				throw new SecurityError(
					'Forbidden: You do not have access to this equipment',
					403
				)
			}

			// Prevent changing the organization
			const updateData = params.data as Record<string, unknown>
			if (
				typeof updateData === 'object' &&
				updateData !== null &&
				'organization' in updateData &&
				updateData.organization &&
				updateData.organization !== context.orgPbId
			) {
				throw new SecurityError(
					'Forbidden: Cannot change equipment organization',
					403
				)
			}

			return equipmentService.update(params.id, params.data)
		},
		{ revalidatePaths: ['/app/equipment'] }
	)

	return securedFunc(params)
}

/**
 * Delete equipment with security checks
 */
export async function deleteEquipment(id: string): Promise<boolean> {
	const securedFunc = await withSecurity(
		async (id: string, context: SecurityContext): Promise<boolean> => {
			const equipmentService = getEquipmentService()

			// Get the equipment first to check permissions
			const existingEquipment = await equipmentService.getById(id)

			// Check permission (require admin for deletion)
			if (
				!(await checkResourcePermission(
					existingEquipment.organization,
					context,
					true
				))
			) {
				throw new SecurityError(
					'Forbidden: Only administrators can delete equipment',
					403
				)
			}

			return equipmentService.delete(id)
		},
		{
			requireAdmin: true,
			revalidatePaths: ['/app/equipment'],
		}
	)

	return securedFunc(id)
}

/**
 * Search equipment with security context
 */
export async function searchEquipment(
	searchTerm: string
): Promise<Equipment[]> {
	const securedFunc = await withSecurity(
		async (
			searchTerm: string,
			context: SecurityContext
		): Promise<Equipment[]> => {
			const equipmentService = getEquipmentService()

			// The search is already scoped to the organization
			return equipmentService.search(context.orgPbId, searchTerm)
		}
	)

	return securedFunc(searchTerm)
}

/**
 * Find equipment by QR/NFC code with security context
 */
export async function findEquipmentByQrNfcCode(
	qrNfcCode: string
): Promise<Equipment | null> {
	const securedFunc = await withSecurity(
		async (
			qrNfcCode: string,
			context: SecurityContext
		): Promise<Equipment | null> => {
			const equipmentService = getEquipmentService()

			const equipment = await equipmentService.findByQrNfcCode(qrNfcCode)

			// If no equipment found, return null
			if (!equipment) {
				return null
			}

			// Check permission - return null if no access instead of error
			if (!(await checkResourcePermission(equipment.organization, context))) {
				return null
			}

			return equipment
		}
	)

	return securedFunc(qrNfcCode)
}
