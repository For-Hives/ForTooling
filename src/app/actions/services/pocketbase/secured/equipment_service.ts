'use server'

import { Equipment } from '@/app/actions/services/pocketbase/api_client/types'
import {
	EquipmentCreateInput,
	EquipmentUpdateInput,
	getEquipmentService,
} from '@/app/actions/services/pocketbase/equipment_service'
import {
	SecurityContext,
	SecurityError,
	checkResourcePermission,
	withSecurity,
} from '@/app/actions/services/pocketbase/secured/security_middleware'

/**
 * Get equipment by ID with security checks
 */
export const getEquipmentById = withSecurity(
	async (id: string, context: SecurityContext): Promise<Equipment> => {
		// Get the equipment
		const equipmentService = getEquipmentService()
		const equipment = await equipmentService.getById(id)

		// Check permission
		if (!checkResourcePermission(equipment.organization, context)) {
			throw new SecurityError(
				'Forbidden: You do not have access to this equipment',
				403
			)
		}

		return equipment
	}
)

/**
 * List equipment with security context
 */
export const listOrganizationEquipment = withSecurity(
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

/**
 * Create new equipment with security context
 */
export const createEquipment = withSecurity(
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

/**
 * Update equipment with security checks
 */
export const updateEquipment = withSecurity(
	async (
		params: { id: string; data: EquipmentUpdateInput },
		context: SecurityContext
	): Promise<Equipment> => {
		const equipmentService = getEquipmentService()

		// Get the equipment first to check permissions
		const existingEquipment = await equipmentService.getById(params.id)

		// Check permission
		if (!checkResourcePermission(existingEquipment.organization, context)) {
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

/**
 * Delete equipment with security checks
 */
export const deleteEquipment = withSecurity(
	async (id: string, context: SecurityContext): Promise<boolean> => {
		const equipmentService = getEquipmentService()

		// Get the equipment first to check permissions
		const existingEquipment = await equipmentService.getById(id)

		// Check permission (require admin for deletion)
		if (
			!checkResourcePermission(existingEquipment.organization, context, true)
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

/**
 * Search equipment with security context
 */
export const searchEquipment = withSecurity(
	async (
		searchTerm: string,
		context: SecurityContext
	): Promise<Equipment[]> => {
		const equipmentService = getEquipmentService()

		// The search is already scoped to the organization
		return equipmentService.search(context.orgPbId, searchTerm)
	}
)

/**
 * Find equipment by QR/NFC code with security context
 */
export const findEquipmentByQrNfcCode = withSecurity(
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
		if (!checkResourcePermission(equipment.organization, context)) {
			return null
		}

		return equipment
	}
)
