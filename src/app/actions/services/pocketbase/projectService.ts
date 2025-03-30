'use server'

import { getPocketBase, handlePocketBaseError } from './baseService'
import { ListOptions, ListResult, Project } from './types'

/**
 * Get a single project by ID
 */
export async function getProject(id: string): Promise<Project> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('projects').getOne(id)
	} catch (error) {
		return handlePocketBaseError(error, 'ProjectService.getProject')
	}
}

/**
 * Get projects list with pagination
 */
export async function getProjectsList(
	options: ListOptions = {}
): Promise<ListResult<Project>> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		const { page = 1, perPage = 30, ...rest } = options
		return await pb.collection('projects').getList(page, perPage, rest)
	} catch (error) {
		return handlePocketBaseError(error, 'ProjectService.getProjectsList')
	}
}

/**
 * Get all projects for an organization
 */
export async function getOrganizationProjects(
	organizationId: string
): Promise<Project[]> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('projects').getFullList({
			filter: `organization=`${organizationId}``,
			sort: 'name',
		})
	} catch (error) {
		return handlePocketBaseError(
			error,
			'ProjectService.getOrganizationProjects'
		)
	}
}

/**
 * Get active projects (current date is between startDate and endDate or endDate is not set)
 */
export async function getActiveProjects(
	organizationId: string
): Promise<Project[]> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	const now = new Date().toISOString()

	try {
		return await pb.collection('projects').getFullList({
			filter: pb.filter(
				'organization = {:orgId} && (startDate <= {:now} && (endDate >= {:now} || endDate = ""))',
				{ now, orgId: organizationId }
			),
			sort: 'name',
		})
	} catch (error) {
		return handlePocketBaseError(error, 'ProjectService.getActiveProjects')
	}
}

/**
 * Create a new project
 */
export async function createProject(data: Partial<Project>): Promise<Project> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('projects').create(data)
	} catch (error) {
		return handlePocketBaseError(error, 'ProjectService.createProject')
	}
}

/**
 * Update a project
 */
export async function updateProject(
	id: string,
	data: Partial<Project>
): Promise<Project> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('projects').update(id, data)
	} catch (error) {
		return handlePocketBaseError(error, 'ProjectService.updateProject')
	}
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<boolean> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		await pb.collection('projects').delete(id)
		return true
	} catch (error) {
		return handlePocketBaseError(error, 'ProjectService.deleteProject')
	}
}

/**
 * Get project count for an organization
 */
export async function getProjectCount(organizationId: string): Promise<number> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		const result = await pb.collection('projects').getList(1, 1, {
			filter: `organization="${organizationId}"`,
			skipTotal: false,
		})
		return result.totalItems
	} catch (error) {
		return handlePocketBaseError(error, 'ProjectService.getProjectCount')
	}
}

/**
 * Search projects by name or address
 */
export async function searchProjects(
	organizationId: string,
	query: string
): Promise<Project[]> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
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
		return handlePocketBaseError(error, 'ProjectService.searchProjects')
	}
}
