/**
 * Security middleware error class
 */
export class SecurityError extends Error {
	statusCode: number

	constructor(message: string, statusCode = 401) {
		super(message)
		this.name = 'SecurityError'
		this.statusCode = statusCode
	}
}

/**
 * Type for the security context provided to secured actions
 */
export interface SecurityContext {
	userId: string
	orgId: string
	orgRole: string
	userPbId: string
	orgPbId: string
	isAdmin: boolean
}

/**
 * Type for a handler function that requires security context
 */
export type SecuredHandler<TParams = unknown, TResult = unknown> = (
	params: TParams,
	context: SecurityContext
) => Promise<TResult>
