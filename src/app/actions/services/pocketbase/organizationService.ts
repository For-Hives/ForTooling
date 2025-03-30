'use server'

import {
	getPocketBase,
	handlePocketBaseError,
} from '@/app/actions/services/pocketbase/baseService'
import { Organization, ListOptions, ListResult } from '@/types/types_pocketbase'

/**
 * Get a single organization by ID
 */
export async function getOrganization(id: string): Promise<Organization> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('organizations').getOne(id)
	} catch (error) {
		return handlePocketBaseError(error, 'OrganizationService.getOrganization')
	}
}

/**
 * Get an organization by Clerk ID
 */
export async function getOrganizationByClerkId(
	clerkId: string
): Promise<Organization> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb
			.collection('organizations')
			.getFirstListItem(`clerkId="${clerkId}"`)
	} catch (error) {
		return handlePocketBaseError(
			error,
			'OrganizationService.getOrganizationByClerkId'
		)
	}
}

/**
 * Get organizations list with pagination
 */
export async function getOrganizationsList(
	options: ListOptions = {}
): Promise<ListResult<Organization>> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		const { page = 1, perPage = 30, ...rest } = options
		return await pb.collection('organizations').getList(page, perPage, rest)
	} catch (error) {
		return handlePocketBaseError(
			error,
			'OrganizationService.getOrganizationsList'
		)
	}
}

/**
 * Create a new organization
 */
export async function createOrganization(
	data: Partial<Organization>
): Promise<Organization> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('organizations').create(data)
	} catch (error) {
		return handlePocketBaseError(
			error,
			'OrganizationService.createOrganization'
		)
	}
}

/**
 * Update an organization
 */
export async function updateOrganization(
	id: string,
	data: Partial<Organization>
): Promise<Organization> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('organizations').update(id, data)
	} catch (error) {
		return handlePocketBaseError(
			error,
			'OrganizationService.updateOrganization'
		)
	}
}

/**
 * Delete an organization
 */
export async function deleteOrganization(id: string): Promise<boolean> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		await pb.collection('organizations').delete(id)
		return true
	} catch (error) {
		return handlePocketBaseError(
			error,
			'OrganizationService.deleteOrganization'
		)
	}
}

/**
 * Update organization subscription details
 */
export async function updateSubscription(
	id: string,
	subscriptionData: {
		stripeCustomerId?: string
		subscriptionId?: string
		subscriptionStatus?: string
		priceId?: string
	}
): Promise<Organization> {
	const pb = await getPocketBase()
	if (!pb) {
		throw new Error('Failed to connect to PocketBase')
	}

	try {
		return await pb.collection('organizations').update(id, subscriptionData)
	} catch (error) {
		return handlePocketBaseError(
			error,
			'OrganizationService.updateSubscription'
		)
	}
}
