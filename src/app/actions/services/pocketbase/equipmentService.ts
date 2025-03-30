'use server'

import { getPocketBase, handlePocketBaseError } from './baseService'
import { Equipment, ListOptions, ListResult } from './types'

/**
 * Get a single equipment item by ID
 */
export async function getEquipment(id: string): Promise<Equipment> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('equipment').getOne(id)
	} catch (error) {
		return handlePocketBaseError(error, 'EquipmentService.getEquipment')
	}
}

/**
 * Get equipment by QR/NFC code
 */
export async function getEquipmentByCode(
	qrNfcCode: string
): Promise<Equipment> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb
			.collection('equipment')
			.getFirstListItem(`qrNfcCode="${qrNfcCode}"`)
	} catch (error) {
		return handlePocketBaseError(error, 'EquipmentService.getEquipmentByCode')
	}
}

/**
 * Get equipment list with pagination
 */
export async function getEquipmentList(
	options: ListOptions = {}
): Promise<ListResult<Equipment>> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		const { page = 1, perPage = 30, ...rest } = options
		return await pb.collection('equipment').getList(page, perPage, rest)
	} catch (error) {
		return handlePocketBaseError(error, 'EquipmentService.getEquipmentList')
	}
}

/**
 * Get all equipment for an organization
 */
export async function getOrganizationEquipment(
	organizationId: string
): Promise<Equipment[]> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('equipment').getFullList({
			filter: `organization="${organizationId}"`,
			sort: 'name',
		})
	} catch (error) {
		return handlePocketBaseError(
			error,
			'EquipmentService.getOrganizationEquipment'
		)
	}
}

/**
 * Create a new equipment item
 */
export async function createEquipment(
	data: Partial<Equipment>
): Promise<Equipment> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('equipment').create(data)
	} catch (error) {
		return handlePocketBaseError(error, 'EquipmentService.createEquipment')
	}
}

/**
 * Update an equipment item
 */
export async function updateEquipment(
	id: string,
	data: Partial<Equipment>
): Promise<Equipment> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('equipment').update(id, data)
	} catch (error) {
		return handlePocketBaseError(error, 'EquipmentService.updateEquipment')
	}
}

/**
 * Delete an equipment item
 */
export async function deleteEquipment(id: string): Promise<boolean> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		await pb.collection('equipment').delete(id)
		return true
	} catch (error) {
		return handlePocketBaseError(error, 'EquipmentService.deleteEquipment')
	}
}

/**
 * Get child equipment (items that have this equipment as parent)
 */
export async function getChildEquipment(
	parentId: string
): Promise<Equipment[]> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('equipment').getFullList({
			filter: `parentEquipment="${parentId}"`,
			sort: 'name',
		})
	} catch (error) {
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
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		const result = await pb.collection('equipment').getList(1, 1, {
			filter: `organization="${organizationId}"`,
			skipTotal: false,
		})
		return result.totalItems
	} catch (error) {
		return handlePocketBaseError(error, 'EquipmentService.getEquipmentCount')
	}
}

/**
 * Search equipment by name or tag
 */
export async function searchEquipment(
	organizationId: string,
	query: string
): Promise<Equipment[]> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('equipment').getFullList({
			filter: pb.filter(
				'organization = {:orgId} && (name ~ {:query} || tags ~ {:query} || qrNfcCode = {:query})',
				{
					orgId: organizationId,
					query: query,
				}
			),
			sort: 'name',
		})
	} catch (error) {
		return handlePocketBaseError(error, 'EquipmentService.searchEquipment')
	}
}
