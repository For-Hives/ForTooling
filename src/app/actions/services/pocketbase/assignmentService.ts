'use server'

import {
	getPocketBase,
	handlePocketBaseError,
} from '@/app/actions/services/pocketbase/baseService'
import {
	validateOrganizationAccess,
	validateResourceAccess,
	createOrganizationFilter,
	ResourceType,
	PermissionLevel,
	SecurityError,
} from '@/app/actions/services/pocketbase/securityUtils'
import { Assignment, ListOptions, ListResult } from '@/types/types_pocketbase'

/**
 * Get a single assignment by ID with security validation
 */
export async function getAssignment(id: string): Promise<Assignment> {
	try {
		// Security check - validates user has access to this resource
		await validateResourceAccess(
			ResourceType.ASSIGNMENT,
			id,
			PermissionLevel.READ
		)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		return await pb.collection('assignments').getOne(id)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error // Re-throw security errors
		}
		return handlePocketBaseError(error, 'AssignmentService.getAssignment')
	}
}

/**
 * Get assignments list with pagination and security checks
 */
export async function getAssignmentsList(
	organizationId: string,
	options: ListOptions = {}
): Promise<ListResult<Assignment>> {
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
		const filter = createOrganizationFilter(organizationId, additionalFilter)

		return await pb.collection('assignments').getList(page, perPage, {
			...rest,
			filter,
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'AssignmentService.getAssignmentsList')
	}
}

/**
 * Get active assignments for an organization with security checks
 * Active assignments have startDate ≤ current date and no endDate or endDate ≥ current date
 */
export async function getActiveAssignments(
	organizationId: string
): Promise<Assignment[]> {
	try {
		// Security check
		await validateOrganizationAccess(organizationId, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		const now = new Date().toISOString()

		return await pb.collection('assignments').getFullList({
			expand: 'equipmentId,assignedToUserId,assignedToProjectId',
			filter: pb.filter(
				'organizationId = {:orgId} && startDate <= {:now} && (endDate = "" || endDate >= {:now})',
				{ now, orgId: organizationId }
			),
			sort: '-created',
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(
			error,
			'AssignmentService.getActiveAssignments'
		)
	}
}

/**
 * Get current assignment for a specific equipment with security checks
 */
export async function getCurrentEquipmentAssignment(
	equipmentId: string
): Promise<Assignment | null> {
	try {
		// Security check - validates access to the equipment
		const { organizationId } = await validateResourceAccess(
			ResourceType.EQUIPMENT,
			equipmentId,
			PermissionLevel.READ
		)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		const now = new Date().toISOString()

		// Include organization check for extra security
		const assignments = await pb.collection('assignments').getList(1, 1, {
			expand: 'equipmentId,assignedToUserId,assignedToProjectId',
			filter: pb.filter(
				'organizationId = {:orgId} && equipmentId = {:equipId} && startDate <= {:now} && (endDate = "" || endDate >= {:now})',
				{ equipId: equipmentId, now, orgId: organizationId }
			),
			sort: '-created',
		})

		return assignments.items.length > 0
			? (assignments.items[0] as Assignment)
			: null
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(
			error,
			'AssignmentService.getCurrentEquipmentAssignment'
		)
	}
}

/**
 * Get assignments for a user with security checks
 */
export async function getUserAssignments(
	userId: string
): Promise<Assignment[]> {
	try {
		// Security check - validates access to the user
		const { organizationId } = await validateResourceAccess(
			ResourceType.USER,
			userId,
			PermissionLevel.READ
		)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Include organization filter for security
		return await pb.collection('assignments').getFullList({
			expand: 'equipmentId,assignedToProjectId',
			filter: createOrganizationFilter(
				organizationId,
				`assignedToUserId="${userId}"`
			),
			sort: '-created',
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'AssignmentService.getUserAssignments')
	}
}

/**
 * Get assignments for a project with security checks
 */
export async function getProjectAssignments(
	projectId: string
): Promise<Assignment[]> {
	try {
		// Security check - validates access to the project
		const { organizationId } = await validateResourceAccess(
			ResourceType.PROJECT,
			projectId,
			PermissionLevel.READ
		)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Include organization filter for security
		return await pb.collection('assignments').getFullList({
			expand: 'equipmentId,assignedToUserId',
			filter: createOrganizationFilter(
				organizationId,
				`assignedToProjectId=${projectId}`
			),
			sort: '-created',
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(
			error,
			'AssignmentService.getProjectAssignments'
		)
	}
}

/**
 * Create a new assignment with security checks
 */
export async function createAssignment(
	organizationId: string,
	data: Pick<
		Partial<Assignment>,
		| 'equipmentId'
		| 'assignedToUserId'
		| 'assignedToProjectId'
		| 'startDate'
		| 'endDate'
		| 'notes'
	>
): Promise<Assignment> {
	try {
		// Security check - requires WRITE permission
		await validateOrganizationAccess(organizationId, PermissionLevel.WRITE)

		// If equipment is provided, verify access to it
		if (data.equipmentId) {
			await validateResourceAccess(
				ResourceType.EQUIPMENT,
				data.equipmentId,
				PermissionLevel.READ
			)
		}

		// If assignedToUser is provided, verify access to that user
		if (data.assignedToUserId) {
			await validateResourceAccess(
				ResourceType.USER,
				data.assignedToUserId,
				PermissionLevel.READ
			)
		}

		// If assignedToProject is provided, verify access to that project
		if (data.assignedToProjectId) {
			await validateResourceAccess(
				ResourceType.PROJECT,
				data.assignedToProjectId,
				PermissionLevel.READ
			)
		}

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Ensure organization ID is set correctly
		return await pb.collection('assignments').create({
			...data,
			organizationId, // Force the correct organization ID
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'AssignmentService.createAssignment')
	}
}

/**
 * Update an assignment with security checks
 */
export async function updateAssignment(
	id: string,
	data: Pick<
		Partial<Assignment>,
		| 'equipmentId'
		| 'assignedToUserId'
		| 'assignedToProjectId'
		| 'startDate'
		| 'endDate'
		| 'notes'
	>
): Promise<Assignment> {
	try {
		// Security check - requires WRITE permission for the assignment
		await validateResourceAccess(
			ResourceType.ASSIGNMENT,
			id,
			PermissionLevel.WRITE
		)

		// Additional validations for related resources
		if (data.equipmentId) {
			await validateResourceAccess(
				ResourceType.EQUIPMENT,
				data.equipmentId,
				PermissionLevel.READ
			)
		}

		if (data.assignedToUserId) {
			await validateResourceAccess(
				ResourceType.USER,
				data.assignedToUserId,
				PermissionLevel.READ
			)
		}

		if (data.assignedToProjectId) {
			await validateResourceAccess(
				ResourceType.PROJECT,
				data.assignedToProjectId,
				PermissionLevel.READ
			)
		}

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Never allow changing the organization
		const sanitizedData = { ...data }
		// Use type assertion with more specific type
		delete (sanitizedData as Record<string, unknown>).organizationId

		return await pb.collection('assignments').update(id, sanitizedData)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'AssignmentService.updateAssignment')
	}
}

/**
 * Delete an assignment with security checks
 */
export async function deleteAssignment(id: string): Promise<boolean> {
	try {
		// Security check - requires WRITE permission
		await validateResourceAccess(
			ResourceType.ASSIGNMENT,
			id,
			PermissionLevel.WRITE
		)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		await pb.collection('assignments').delete(id)
		return true
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'AssignmentService.deleteAssignment')
	}
}

/**
 * Complete an assignment by setting its end date to now with security checks
 */
export async function completeAssignment(id: string): Promise<Assignment> {
	try {
		// Security check - requires WRITE permission
		await validateResourceAccess(
			ResourceType.ASSIGNMENT,
			id,
			PermissionLevel.WRITE
		)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		return await pb.collection('assignments').update(id, {
			endDate: new Date().toISOString(),
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'AssignmentService.completeAssignment')
	}
}

/**
 * Get assignment history for an equipment with security checks
 */
export async function getEquipmentAssignmentHistory(
	equipmentId: string
): Promise<Assignment[]> {
	try {
		// Security check - validates access to the equipment
		const { organizationId } = await validateResourceAccess(
			ResourceType.EQUIPMENT,
			equipmentId,
			PermissionLevel.READ
		)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Include organization filter for security
		return await pb.collection('assignments').getFullList({
			expand: 'assignedToUserId,assignedToProjectId',
			filter: createOrganizationFilter(
				organizationId,
				`equipmentId="${equipmentId}"`
			),
			sort: '-startDate',
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(
			error,
			'AssignmentService.getEquipmentAssignmentHistory'
		)
	}
}
