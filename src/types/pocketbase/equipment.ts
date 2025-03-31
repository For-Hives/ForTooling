import { BaseRecord } from '@/types/pocketbase/base'

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
