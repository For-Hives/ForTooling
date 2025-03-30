'use server'

import { getPocketBase, handlePocketBaseError } from './baseService'
import { ListOptions, ListResult, User } from './types'

/**
 * Get a single user by ID
 */
export async function getUser(id: string): Promise<User> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('users').getOne(id)
	} catch (error) {
		return handlePocketBaseError(error, 'UserService.getUser')
	}
}

/**
 * Get a user by Clerk ID
 */
export async function getUserByClerkId(clerkId: string): Promise<User> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('users').getFirstListItem(`clerkId="${clerkId}"`)
	} catch (error) {
		return handlePocketBaseError(error, 'UserService.getUserByClerkId')
	}
}

/**
 * Get users list with pagination
 */
export async function getUsersList(
	options: ListOptions = {}
): Promise<ListResult<User>> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		const { page = 1, perPage = 30, ...rest } = options
		return await pb.collection('users').getList(page, perPage, rest)
	} catch (error) {
		return handlePocketBaseError(error, 'UserService.getUsersList')
	}
}

/**
 * Get all users for an organization
 */
export async function getUsersByOrganization(
	organizationId: string
): Promise<User[]> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('users').getFullList({
			filter: `organization="${organizationId}"`,
			sort: 'name',
		})
	} catch (error) {
		return handlePocketBaseError(error, 'UserService.getUsersByOrganization')
	}
}

/**
 * Create a new user
 */
export async function createUser(data: Partial<User>): Promise<User> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('users').create(data)
	} catch (error) {
		return handlePocketBaseError(error, 'UserService.createUser')
	}
}

/**
 * Update a user
 */
export async function updateUser(
	id: string,
	data: Partial<User>
): Promise<User> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('users').update(id, data)
	} catch (error) {
		return handlePocketBaseError(error, 'UserService.updateUser')
	}
}

/**
 * Delete a user
 */
export async function deleteUser(id: string): Promise<boolean> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		await pb.collection('users').delete(id)
		return true
	} catch (error) {
		return handlePocketBaseError(error, 'UserService.deleteUser')
	}
}

/**
 * Update user's last login time
 */
export async function updateUserLastLogin(id: string): Promise<User> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('users').update(id, {
			lastLogin: new Date().toISOString(),
		})
	} catch (error) {
		return handlePocketBaseError(error, 'UserService.updateUserLastLogin')
	}
}

/**
 * Get the count of users in an organization
 */
export async function getUserCount(organizationId: string): Promise<number> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		const result = await pb.collection('users').getList(1, 1, {
			filter: 'organization=' + `${organizationId}`,
			skipTotal: false,
		})
		return result.totalItems
	} catch (error) {
		return handlePocketBaseError(error, 'UserService.getUserCount')
	}
}
