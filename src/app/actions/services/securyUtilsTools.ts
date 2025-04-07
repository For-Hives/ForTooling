/**
 * User permission levels
 */
export enum PermissionLevel {
	ADMIN = 'admin',
	READ = 'read',
	WRITE = 'write',
}

/**
 * Resource types for permission checks
 */
export enum ResourceType {
	ASSIGNMENT = 'assignment',
	EQUIPMENT = 'equipment',
	ORGANIZATION = 'organization',
	PROJECT = 'project',
	USER = 'user',
}

/**
 * Error thrown when security checks fail
 */
export class SecurityError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'SecurityError'
	}
}
