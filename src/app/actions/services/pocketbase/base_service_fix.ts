/**
 * Utility function to fix type compatibility issues
 * This function is a workaround for TypeScript type compatibility issues
 * between Zod schemas and TypeScript interfaces
 *
 * @param schema The Zod schema to be fixed
 * @returns The same schema with fixed type compatibility
 */
export function fixSchemaType<T>(schema: any): any {
	// Simply pass through the schema but with a different type signature
	// This is a type assertion hack to make TypeScript happy
	return schema
}
