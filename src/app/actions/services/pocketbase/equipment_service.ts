import { BaseService } from '@/app/actions/services/pocketbase/api_client'
import {
	Collections,
	Equipment,
	EquipmentCreateInput,
	EquipmentUpdateInput,
	equipmentCreateSchema,
	equipmentSchema,
	equipmentUpdateSchema,
} from '@/models/pocketbase'

// Re-export types for convenience
export type { Equipment, EquipmentCreateInput, EquipmentUpdateInput }

/**
 * Service for equipment-related operations
 * Provides CRUD and search functionality for equipment records
 */
export class EquipmentService extends BaseService<
	Equipment,
	EquipmentCreateInput,
	EquipmentUpdateInput
> {
	constructor() {
		super(
			Collections.EQUIPMENT,
			// @eslint-disable-next-line @typescript-eslint/ban-ts-comment @ts-expect-error - Types are compatible but TypeScript cannot verify it [ :) ]
			equipmentSchema,
			equipmentCreateSchema,
			equipmentUpdateSchema
		)
	}

	/**
	 * Find equipment by QR/NFC code
	 *
	 * @param qrNfcCode - The QR/NFC code to search for
	 * @returns The equipment or null if not found
	 */
	async findByQrNfcCode(qrNfcCode: string): Promise<Equipment | null> {
		try {
			const result = await this.getList({
				filter: `qrNfcCode = "${qrNfcCode}"`,
			})

			return result.items.length > 0 ? result.items[0] : null
		} catch (error) {
			console.error('Error finding equipment by QR/NFC code:', error)
			return null
		}
	}

	/**
	 * Find all equipment for an organization
	 *
	 * @param organizationId - The organization ID
	 * @returns Array of equipment
	 */
	async findByOrganization(organizationId: string): Promise<Equipment[]> {
		try {
			const result = await this.getList({
				filter: `organization = "${organizationId}"`,
			})

			return result.items
		} catch (error) {
			console.error('Error finding equipment by organization:', error)
			return []
		}
	}

	/**
	 * Find equipment by parent equipment ID
	 *
	 * @param parentEquipmentId - The parent equipment ID
	 * @returns Array of child equipment
	 */
	async findByParentEquipment(parentEquipmentId: string): Promise<Equipment[]> {
		try {
			const result = await this.getList({
				filter: `parentEquipment = "${parentEquipmentId}"`,
			})

			return result.items
		} catch (error) {
			console.error('Error finding equipment by parent equipment:', error)
			return []
		}
	}

	/**
	 * Search equipment by name, tags or notes
	 *
	 * @param organizationId - The organization ID
	 * @param searchTerm - Term to search for
	 * @returns Array of matching equipment
	 */
	async search(
		organizationId: string,
		searchTerm: string
	): Promise<Equipment[]> {
		try {
			// Clean up search term for use in filter
			const cleanTerm = searchTerm.trim().replace(/"/g, '\\"')

			// Construct the filter as a string, properly escaping quotation marks
			const filter =
				'organization = "' +
				organizationId +
				'" && (name ~ "' +
				cleanTerm +
				'" || tags ~ "' +
				cleanTerm +
				'" || notes ~ "' +
				cleanTerm +
				'")'

			const result = await this.getList({
				filter,
			})

			return result.items
		} catch (error) {
			console.error('Error searching equipment:', error)
			return []
		}
	}

	/**
	 * Generate a new unique QR/NFC code
	 *
	 * @returns A new unique code
	 */
	async generateUniqueCode(): Promise<string> {
		// Generate a random alphanumeric code
		const generateCode = () => {
			const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
			let result = ''
			for (let i = 0; i < 10; i++) {
				result += chars.charAt(Math.floor(Math.random() * chars.length))
			}
			return result
		}

		// Keep generating until we find a unique one
		let isUnique = false
		let code = ''

		while (!isUnique) {
			code = generateCode()
			const existing = await this.findByQrNfcCode(code)
			isUnique = existing === null
		}

		return code
	}
}

// Singleton instance
let equipmentServiceInstance: EquipmentService | null = null

/**
 * Get the EquipmentService instance
 * Uses singleton pattern to ensure only one instance exists
 *
 * @returns The EquipmentService instance
 */
export function getEquipmentService(): EquipmentService {
	if (!equipmentServiceInstance) {
		equipmentServiceInstance = new EquipmentService()
	}
	return equipmentServiceInstance
}

/**
 * Find equipment by QR/NFC code
 * Convenience function that uses the EquipmentService
 *
 * @param qrNfcCode - The QR/NFC code
 * @returns The equipment or null if not found
 */
export async function findEquipmentByQrNfcCode(
	qrNfcCode: string
): Promise<Equipment | null> {
	return getEquipmentService().findByQrNfcCode(qrNfcCode)
}

/**
 * Find all equipment for an organization
 * Convenience function that uses the EquipmentService
 *
 * @param organizationId - The organization ID
 * @returns Array of equipment
 */
export async function findEquipmentByOrganization(
	organizationId: string
): Promise<Equipment[]> {
	return getEquipmentService().findByOrganization(organizationId)
}

/**
 * Search equipment by name, tags or notes
 * Convenience function that uses the EquipmentService
 *
 * @param organizationId - The organization ID
 * @param searchTerm - Term to search for
 * @returns Array of matching equipment
 */
export async function searchEquipment(
	organizationId: string,
	searchTerm: string
): Promise<Equipment[]> {
	return getEquipmentService().search(organizationId, searchTerm)
}

/**
 * Generate a new unique QR/NFC code
 * Convenience function that uses the EquipmentService
 *
 * @returns A new unique code
 */
export async function generateUniqueEquipmentCode(): Promise<string> {
	return getEquipmentService().generateUniqueCode()
}
