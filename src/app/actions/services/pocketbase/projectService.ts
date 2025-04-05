'use server'

import {
	PocketBaseApiError,
	getPocketBase,
} from '@/app/actions/services/pocketbase/api_client/client'
import {
	Project,
	ListResult,
} from '@/app/actions/services/pocketbase/api_client/types'
import { withSecurity } from '@/app/actions/services/pocketbase/secured/security_middleware'
import {
	SecurityContext,
	SecurityError,
} from '@/app/actions/services/pocketbase/secured/security_types'

// Interface for collection options
interface CollectionOptions {
	filter?: string
	sort?: string
	expand?: string
	skipTotal?: boolean
	[key: string]: unknown
}

// Type for PocketBase client
type PocketBaseClient = {
	collection: (name: string) => {
		getOne: (id: string) => Promise<Project>
		getList: (
			page: number,
			perPage: number,
			options?: CollectionOptions
		) => Promise<ListResult<Project>>
		getFullList: (options?: CollectionOptions) => Promise<Project[]>
		create: (data: Record<string, unknown>) => Promise<Project>
		update: (id: string, data: Record<string, unknown>) => Promise<Project>
		delete: (id: string) => Promise<boolean>
		filter: (filter: string, params: Record<string, unknown>) => string
	}
	filter: (filter: string, params: Record<string, unknown>) => string
}

// Helper function to handle PocketBase errors
function handlePocketBaseError(error: unknown, source: string): never {
	console.error(`Error in ${source}:`, error)
	if (error instanceof PocketBaseApiError) {
		throw error
	}
	if (error instanceof SecurityError) {
		throw error
	}
	throw new Error(`Failed to execute operation in ${source}`)
}

// Interface for list options
interface ListOptions {
	page?: number
	perPage?: number
	sort?: string
	filter?: string
	expand?: string
}

/**
 * Get a single project by ID with security validation
 */
export async function getProject(id: string): Promise<Project> {
	try {
		// Security check is now handled by withSecurity HOF
		const pb = getPocketBase() as unknown as PocketBaseClient
		return await pb.collection('Project').getOne(id)
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
		// Security check is handled by withSecurity HOF
		const pb = getPocketBase() as unknown as PocketBaseClient

		const {
			filter: additionalFilter,
			page = 1,
			perPage = 30,
			...rest
		} = options

		// Apply organization filter to ensure data isolation
		const filter = `organization="${organizationId}"${additionalFilter ? ` && (${additionalFilter})` : ''}`

		return await pb.collection('Project').getList(page, perPage, {
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
		// Security check is handled by withSecurity HOF
		const pb = getPocketBase() as unknown as PocketBaseClient

		// Apply organization filter - correct field name based on schema
		const filter = `organization="${organizationId}"`

		return await pb.collection('Project').getFullList({
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
		// Security check is handled by withSecurity HOF
		const pb = getPocketBase() as unknown as PocketBaseClient
		const now = new Date().toISOString()

		// Fixed field name in filter
		return await pb.collection('Project').getFullList({
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
	data: Pick<
		Partial<Project>,
		'name' | 'address' | 'notes' | 'startDate' | 'endDate'
	>
): Promise<Project> {
	try {
		// Security check is handled by withSecurity HOF
		const pb = getPocketBase() as unknown as PocketBaseClient

		// Ensure organization ID is set correctly - fixed field name
		return await pb.collection('Project').create({
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
	data: Pick<
		Partial<Project>,
		'name' | 'address' | 'notes' | 'startDate' | 'endDate'
	>
): Promise<Project> {
	try {
		// Security check is handled by withSecurity HOF
		const pb = getPocketBase() as unknown as PocketBaseClient

		// Never allow changing the organization
		const sanitizedData = { ...data }
		// Fixed 'any' type and field name
		delete (sanitizedData as Record<string, unknown>).organization

		return await pb.collection('Project').update(id, sanitizedData)
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
		// Security check is handled by withSecurity HOF
		const pb = getPocketBase() as unknown as PocketBaseClient
		await pb.collection('Project').delete(id)
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
		// Security check is handled by withSecurity HOF
		const pb = getPocketBase() as unknown as PocketBaseClient

		// Fixed field name
		const result = await pb.collection('Project').getList(1, 1, {
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
		// Security check is handled by withSecurity HOF
		const pb = getPocketBase() as unknown as PocketBaseClient

		// Fixed field name in filter
		return await pb.collection('Project').getFullList({
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

// Replace these const exports with async function declarations
export async function securedGetProject(id: string) {
	const securedFunc = await withSecurity(
		async (id: string, context: SecurityContext) => {
			// Here you would add additional security checks specific to this resource
			// such as checking if the project belongs to the user's organization

			// First get the project to check if it belongs to the user's organization
			const project = await getProject(id)

			// Check if the project belongs to the user's organization
			if (project.organization !== context.orgPbId) {
				throw new SecurityError(
					'Cannot access project from another organization'
				)
			}

			return project
		}
	)

	return securedFunc(id)
}

export async function securedGetProjectsList(params: {
	organizationId: string
	options?: ListOptions
}) {
	const securedFunc = await withSecurity(
		async (
			params: { organizationId: string; options?: ListOptions },
			context: SecurityContext
		) => {
			const { options, organizationId } = params
			// Ensure organizationId matches the user's current organization
			if (organizationId !== context.orgPbId) {
				throw new SecurityError(
					'Cannot access projects from another organization'
				)
			}
			return getProjectsList(organizationId, options)
		}
	)

	return securedFunc(params)
}

export async function securedGetOrganizationProjects(organizationId: string) {
	const securedFunc = await withSecurity(
		async (organizationId: string, context: SecurityContext) => {
			// Ensure organizationId matches the user's current organization
			if (organizationId !== context.orgPbId) {
				throw new SecurityError(
					'Cannot access projects from another organization'
				)
			}
			return getOrganizationProjects(organizationId)
		}
	)

	return securedFunc(organizationId)
}
