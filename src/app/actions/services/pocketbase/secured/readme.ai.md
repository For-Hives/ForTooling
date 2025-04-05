# Secured PocketBase Services Overview

This directory contains secured versions of PocketBase services that implement authentication, authorization, and multi-tenant isolation. These services form the foundation of the application's security model.

## Key Files

- `security_middleware.ts` - Core middleware for securing server actions
- `equipment_service.ts` - Secured equipment service with authorization checks
- Other entity-specific secured services

## Key Concepts

- **Security Middleware**: withSecurity() HOF that wraps server actions
- **SecurityContext**: Context object with user and organization information
- **Authorization Checks**: Permission validation for operations
- **Multi-tenancy**: Organization-based data isolation

## Best Practices

- Always use withSecurity() for protected operations
- Implement proper permission checks for each operation
- Return appropriate error responses for security violations
- Follow the established patterns for secured services

## Do's and Don'ts

### Do

- Use the withSecurity middleware for all protected actions
- Check permissions before data operations
- Return SecurityError for authorization failures
- Respect organization boundaries for data access

### Don't

- Create server actions without proper security checks
- Bypass the security middleware
- Allow cross-organization data access
- Expose sensitive operations without authentication

## For AI Assistants

When working with this directory:

- Understand the central role of the security middleware
- Note that all secured services use withSecurity()
- Be aware of the SecurityContext object passed to actions
- Recognize the importance of checkResourcePermission()
- Remember that organization isolation is a core security principle
- Follow the established patterns for new secured services
