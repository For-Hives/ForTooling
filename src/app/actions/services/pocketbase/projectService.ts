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
import { ListOptions, ListResult, Project } from '@/types/types_pocketbase'

/**
 * Get a single project by ID with security validation
 */
export async function getProject(id: string): Promise<Project> {
	try {
		// Security check - validates user has access to this resource
		await validateResourceAccess(ResourceType.PROJECT, id, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		return await pb.collection('projects').getOne(id)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error // Re-throw security errors
		}
		return handlePocketBaseError(error, 'ProjectService.getProject')
	}
}

/**
 * Get projects list with pagination and security checks
 */
export async function getProjectsList(
	organizationId: string,
	options: ListOptions = {}
): Promise<ListResult<Project>> {
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

		return await pb.collection('projects').getList(page, perPage, {
			...rest,
			filter,
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'ProjectService.getProjectsList')
	}
}

/**
 * Get all projects for an organization with security checks
 */
export async function getOrganizationProjects(
	organizationId: string
): Promise<Project[]> {
	try {
		// Security check
		await validateOrganizationAccess(organizationId, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Apply organization filter
		const filter = `organization="${organizationId}"`

		return await pb.collection('projects').getFullList({
			filter,
			sort: 'name',
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(
			error,
			'ProjectService.getOrganizationProjects'
		)
	}
}

/**
 * Get active projects with security checks
 * (current date is between startDate and endDate or endDate is not set)
 */
export async function getActiveProjects(
	organizationId: string
): Promise<Project[]> {
	try {
		// Security check
		await validateOrganizationAccess(organizationId, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		const now = new Date().toISOString()

		return await pb.collection('projects').getFullList({
			filter: pb.filter(
				'organization = {:orgId} && (startDate <= {:now} && (endDate >= {:now} || endDate = ""))',
				{ now, orgId: organizationId }
			),
			sort: 'name',
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'ProjectService.getActiveProjects')
	}
}

/**
 * Create a new project with security checks
 */
export async function createProject(
	organizationId: string,
	data: Omit<Partial<Project>, 'organization'>
): Promise<Project> {
	try {
		// Security check - requires WRITE permission
		await validateOrganizationAccess(organizationId, PermissionLevel.WRITE)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Ensure organization ID is set correctly
		return await pb.collection('projects').create({
			...data,
			organization: organizationId, // Force the correct organization ID
		})
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'ProjectService.createProject')
	}
}

/**
 * Update a project with security checks
 */
export async function updateProject(
	id: string,
	data: Omit<Partial<Project>, 'organization' | 'id'>
): Promise<Project> {
	try {
		// Security check - requires WRITE permission
		await validateResourceAccess(
			ResourceType.PROJECT,
			id,
			PermissionLevel.WRITE
		)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		// Never allow changing the organization
		const sanitizedData = { ...data }
		delete (sanitizedData as any).organization

		return await pb.collection('projects').update(id, sanitizedData)
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'ProjectService.updateProject')
	}
}

/**
 * Delete a project with security checks
 */
export async function deleteProject(id: string): Promise<boolean> {
	try {
		// Security check - requires ADMIN permission for deletion
		await validateResourceAccess(
			ResourceType.PROJECT,
			id,
			PermissionLevel.ADMIN
		)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		await pb.collection('projects').delete(id)
		return true
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'ProjectService.deleteProject')
	}
}

/**
 * Get project count for an organization with security checks
 */
export async function getProjectCount(organizationId: string): Promise<number> {
	try {
		// Security check
		await validateOrganizationAccess(organizationId, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		const result = await pb.collection('projects').getList(1, 1, {
			filter: `organization="${organizationId}"`,
			skipTotal: false,
		})

		return result.totalItems
	} catch (error) {
		if (error instanceof SecurityError) {
			throw error
		}
		return handlePocketBaseError(error, 'ProjectService.getProjectCount')
	}
}

/**
 * Search projects by name or address with security checks
 */
export async function searchProjects(
	organizationId: string,
	query: string
): Promise<Project[]> {
	try {
		// Security check
		await validateOrganizationAccess(organizationId, PermissionLevel.READ)

		const pb = await getPocketBase()
		if (!pb) {
			throw new Error('Failed to connect to PocketBase')
		}

		return await pb.collection('projects').getFullList({
			filter: pb.filter(
				'organization = {:orgId} && (name ~ {:query} || address ~ {:query})',
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
		return handlePocketBaseError(error, 'ProjectService.searchProjects')
	}
}
