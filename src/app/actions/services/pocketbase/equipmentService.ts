'use server'

import {
	getPocketBase,
	handlePocketBaseError,
} from '@/app/actions/services/pocketbase/baseService'
import {
	validateOrganizationAccess,
	validateResourceAccess,
	createOrganizationFilter,
} from '@/app/actions/services/pocketbase/securityUtils'
import {
	PermissionLevel,
	ResourceType,
	SecurityError,
} from '@/app/actions/services/securyUtilsTools'
import { Equipment, ListOptions, ListResult } from '@/types/types_pocketbase'

/**
 * Get a single equipment item by ID with security validation
 */
export async function getEquipment(id: string): Promise<Equipment> {
	try {
		// Security check - validates user has access to this resource
		await validateResourceAccess(
			ResourceType.EQUIPMENT,
			id,
			PermissionLevel.READ
		)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		return await pb.collection('equipment').getOne(id)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error // Re-throw security errors
		}
		return handlePocketBaseError(error, 'EquipmentService.getEquipment')
	}
}

/**
 * Get equipment by QR/NFC code with organization validation
 */
export async function getEquipmentByCode(
	organizationId: string,
	qrNfcCode: string
): Promise<Equipment> {
	try {
		// Security check - validates user belongs to this organization
		await validateOrganizationAccess(organizationId, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Apply organization filter for security
		const filter = await createOrganizationFilter(
			organizationId,
			`qrNfcCode="${qrNfcCode}"`
		)
		return await pb.collection('equipment').getFirstListItem(filter)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'EquipmentService.getEquipmentByCode')
	}
}

/**
 * Get equipment list with pagination and security checks
 */
export async function getEquipmentList(
	organizationId: string,
	options: ListOptions = {}
): Promise<ListResult<Equipment>> {
	try {
		// Security check
		await validateOrganizationAccess(organizationId, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		const {
			filter: additionalFilter,
			page = 1,
			perPage = 30,
			...rest
		} = options

		// Apply organization filter to ensure data isolation
		const filter = await createOrganizationFilter(
			organizationId,
			additionalFilter
		)

		return await pb.collection('equipment').getList(page, perPage, {
			...rest,
			filter,
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'EquipmentService.getEquipmentList')
	}
}

/**
 * Get all equipment for an organization with security check
 */
export async function getOrganizationEquipment(
	organizationId: string
): Promise<Equipment[]> {
	try {
		// Security check
		await validateOrganizationAccess(organizationId, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Apply organization filter - fixed field name to match interface
		const filter = `organizationId=${organizationId}`

		return await pb.collection('equipment').getFullList({
			filter,
			sort: 'name',
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(
			error,
			'EquipmentService.getOrganizationEquipment'
		)
	}
}

/**
 * Create a new equipment item with permission check
 */
export async function createEquipment(
	organizationId: string,
	data: Pick<
		Partial<Equipment>,
		| 'name'
		| 'qrNfcCode'
		| 'tags'
		| 'notes'
		| 'acquisitionDate'
		| 'parentEquipmentId'
	>
): Promise<Equipment> {
	try {
		// Security check - requires WRITE permission - removed unused user variable
		await validateOrganizationAccess(organizationId, PermissionLevel.WRITE)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Ensure organization ID is set and matches the authenticated user's org
		// Fixed field name to match interface
		return await pb.collection('equipment').create({
			...data,
			organizationId, // Force the correct organization ID
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'EquipmentService.createEquipment')
	}
}

/**
 * Update an equipment item with permission and ownership checks
 */
export async function updateEquipment(
	id: string,
	data: Pick<
		Partial<Equipment>,
		| 'name'
		| 'qrNfcCode'
		| 'tags'
		| 'notes'
		| 'acquisitionDate'
		| 'parentEquipmentId'
	>
): Promise<Equipment> {
	try {
		// Security check - validates organization and requires WRITE permission
		await validateResourceAccess(
			ResourceType.EQUIPMENT,
			id,
			PermissionLevel.WRITE
		)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Never allow changing the organization
		const sanitizedData = { ...data }
		// Fixed 'any' type and field name
		delete (sanitizedData as Record<string, unknown>).organizationId

		return await pb.collection('equipment').update(id, sanitizedData)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'EquipmentService.updateEquipment')
	}
}

/**
 * Delete an equipment item with permission check
 */
export async function deleteEquipment(id: string): Promise<boolean> {
	try {
		// Security check - requires ADMIN permission for deletion
		await validateResourceAccess(
			ResourceType.EQUIPMENT,
			id,
			PermissionLevel.ADMIN
		)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		await pb.collection('equipment').delete(id)
		return true
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'EquipmentService.deleteEquipment')
	}
}

/**
 * Get child equipment (items that have this equipment as parent)
 */
export async function getChildEquipment(
	parentId: string
): Promise<Equipment[]> {
	try {
		// Security check - validates parent equipment access
		const { organizationId } = await validateResourceAccess(
			ResourceType.EQUIPMENT,
			parentId,
			PermissionLevel.READ
		)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Apply organization filter for security - fixed field name
		const filter = await createOrganizationFilter(
			organizationId,
			`parentEquipmentId="${parentId}"`
		)

		return await pb.collection('equipment').getFullList({
			filter,
			sort: 'name',
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'EquipmentService.getChildEquipment')
	}
}

/**
 * Generate a unique QR/NFC code
 */
export async function generateUniqueCode(): Promise<string> {
	// Generate a random alphanumeric code
	const prefix = 'EQ'
	const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase()
	return `${prefix}-${randomPart}`
}

/**
 * Get equipment count for an organization
 */
export async function getEquipmentCount(
	organizationId: string
): Promise<number> {
	try {
		// Security check
		await validateOrganizationAccess(organizationId, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		const result = await pb.collection('equipment').getList(1, 1, {
			filter: `organizationId="${organizationId}"`, // Fixed field name
			skipTotal: false,
		})
		return result.totalItems
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'EquipmentService.getEquipmentCount')
	}
}

/**
 * Search equipment by name or tag within organization
 */
export async function searchEquipment(
	organizationId: string,
	query: string
): Promise<Equipment[]> {
	try {
		// Security check
		await validateOrganizationAccess(organizationId, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		return await pb.collection('equipment').getFullList({
			filter: pb.filter(
				'organizationId = {:orgId} && (name ~ {:query} || tags ~ {:query} || qrNfcCode = {:query})',
				{
					orgId: organizationId,
					query,
				}
			),
			sort: 'name',
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'EquipmentService.searchEquipment')
	}
}
