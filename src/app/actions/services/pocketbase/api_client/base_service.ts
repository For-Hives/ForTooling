/**
 * Generic base service for PocketBase CRUD operations
 */

import {
	getPocketBase,
	handlePocketBaseError,
	CollectionMethodOptions,
	defaultCollectionMethodOptions,
	validateWithZod,
} from '@/app/actions/services/pocketbase/api_client/client'
import { ListResult, QueryParams } from '@/models/pocketbase'
import { z } from 'zod'

/**
 * Base service class for PocketBase collections
 * Provides generic CRUD operations for any collection
 */
export class BaseService<T, CreateInput, UpdateInput> {
	protected readonly collectionName: string
	protected readonly schema: z.ZodType<T>
	protected readonly createSchema: z.ZodType<CreateInput>
	protected readonly updateSchema: z.ZodType<UpdateInput>
	protected readonly listSchema: z.ZodType<ListResult<T>>

	/**
	 * Constructor for BaseService
	 *
	 * @param collectionName - The name of the PocketBase collection
	 * @param schema - Zod schema for validating records
	 * @param createSchema - Zod schema for validating create inputs
	 * @param updateSchema - Zod schema for validating update inputs
	 */
	constructor(
		collectionName: string,
		schema: z.ZodType<T>,
		createSchema: z.ZodType<CreateInput>,
		updateSchema: z.ZodType<UpdateInput>
	) {
		this.collectionName = collectionName
		this.schema = schema
		this.createSchema = createSchema
		this.updateSchema = updateSchema
		this.listSchema = z.object({
			items: z.array(this.schema),
			page: z.number(),
			perPage: z.number(),
			totalItems: z.number(),
			totalPages: z.number(),
		})
	}

	/**
	 * Get a single record by ID
	 *
	 * @param id - The ID of the record to retrieve
	 * @param options - Optional configuration for the request
	 * @returns The record
	 */
	async getById(
		id: string,
		options: CollectionMethodOptions = defaultCollectionMethodOptions
	): Promise<T> {
		try {
			const pb = getPocketBase()
			const record = await pb.collection(this.collectionName).getOne(id)

			return options.validateOutput === false
				? (record as T)
				: validateWithZod(this.schema, record)
		} catch (error) {
			handlePocketBaseError(error)
		}
	}

	/**
	 * Get a list of records
	 *
	 * @param params - Query parameters for filtering, sorting, etc.
	 * @param options - Optional configuration for the request
	 * @returns A list result containing the records
	 */
	async getList(
		params: QueryParams = {},
		options: CollectionMethodOptions = defaultCollectionMethodOptions
	): Promise<ListResult<T>> {
		try {
			const pb = getPocketBase()
			const result = await pb
				.collection(this.collectionName)
				.getList(params.page, params.perPage, {
					expand: params.expand,
					filter: params.filter,
					sort: params.sort,
				})

			return options.validateOutput === false
				? (result as ListResult<T>)
				: validateWithZod(this.listSchema, result)
		} catch (error) {
			handlePocketBaseError(error)
		}
	}

	/**
	 * Create a new record
	 *
	 * @param data - The data for the new record
	 * @param options - Optional configuration for the request
	 * @returns The created record
	 */
	async create(
		data: CreateInput,
		options: CollectionMethodOptions = defaultCollectionMethodOptions
	): Promise<T> {
		try {
			// Validate input data
			const validatedData = validateWithZod(this.createSchema, data)

			const pb = getPocketBase()
			const record = await pb
				.collection(this.collectionName)
				.create(validatedData as Record<string, unknown>)

			return options.validateOutput === false
				? (record as T)
				: validateWithZod(this.schema, record)
		} catch (error) {
			handlePocketBaseError(error)
		}
	}

	/**
	 * Update an existing record
	 *
	 * @param id - The ID of the record to update
	 * @param data - The data to update
	 * @param options - Optional configuration for the request
	 * @returns The updated record
	 */
	async update(
		id: string,
		data: UpdateInput,
		options: CollectionMethodOptions = defaultCollectionMethodOptions
	): Promise<T> {
		try {
			// Validate input data
			const validatedData = validateWithZod(this.updateSchema, data)

			const pb = getPocketBase()
			const record = await pb
				.collection(this.collectionName)
				.update(id, validatedData as Record<string, unknown>)

			return options.validateOutput === false
				? (record as T)
				: validateWithZod(this.schema, record)
		} catch (error) {
			handlePocketBaseError(error)
		}
	}

	/**
	 * Delete a record
	 *
	 * @param id - The ID of the record to delete
	 * @returns A boolean indicating success
	 */
	async delete(id: string): Promise<boolean> {
		try {
			const pb = getPocketBase()
			await pb.collection(this.collectionName).delete(id)
			return true
		} catch (error) {
			handlePocketBaseError(error)
		}
	}

	/**
	 * Get a count of records matching a filter
	 *
	 * @param filter - The filter to apply
	 * @returns The count of matching records
	 */
	async getCount(filter?: string): Promise<number> {
		try {
			const pb = getPocketBase()
			const result = await pb.collection(this.collectionName).getList(1, 1, {
				filter,
			})

			return result.totalItems
		} catch (error) {
			handlePocketBaseError(error)
		}
	}
}
