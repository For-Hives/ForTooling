/**
 * PocketBase API Client exports
 */

// Client and utilities
export * from '@/app/actions/services/pocketbase/api_client/client'
export * from '@/app/actions/services/pocketbase/api_client/base_service'

// Re-export schemas and values from central location except Collections (to avoid conflict)
export {
	// Re-export value exports (non-types)
	appUserCreateSchema,
	appUserSchema,
	appUserUpdateSchema,
	baseRecordSchema,
	createPartialSchema,
	createServiceSchemas,
	equipmentCreateSchema,
	equipmentSchema,
	equipmentUpdateSchema,
	listResultSchema,
	organizationCreateSchema,
	organizationSchema,
	organizationUpdateSchema,
	queryParamsSchema,
} from '@/models/pocketbase'

// Re-export types separately to avoid 'isolatedModules' error
export type {
	AppUser,
	AppUserCreateInput,
	AppUserUpdateInput,
	BaseRecord,
	Equipment,
	EquipmentCreateInput,
	EquipmentUpdateInput,
	ListResult,
	Organization,
	OrganizationCreateInput,
	OrganizationUpdateInput,
	QueryParams,
} from '@/models/pocketbase'
