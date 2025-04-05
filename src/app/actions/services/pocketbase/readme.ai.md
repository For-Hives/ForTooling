# PocketBase Services Overview

This directory contains services for interacting with the PocketBase backend, our primary database. It provides structured access to data with proper validation and type safety.

## Directory Structure

- `api_client/` - Core client for PocketBase API communication
- `secured/` - Secured services with authentication and authorization checks
- `*_service.ts` files - Entity-specific services (app_user_service.ts, equipment_service.ts, etc.)

## Key Concepts

- **Service Pattern**: Entity-specific services for database operations
- **Base Service**: Generic CRUD operations shared across entities
- **Security Middleware**: Authentication and authorization checks
- **Type Safety**: Zod validation for inputs and outputs

## Best Practices

- Use entity-specific services for database operations
- Apply proper validation for all inputs and outputs
- Handle errors consistently with detailed messages
- Follow the established patterns for CRUD operations

## Do's and Don'ts

### Do

- Use the established service pattern for new entities
- Follow the type validation approach with Zod
- Implement proper error handling
- Use the security middleware for protected operations

### Don't

- Create direct PocketBase calls outside the service layer
- Skip validation for inputs or outputs
- Mix authorization logic with data access
- Duplicate functionality across services

## For AI Assistants

When working with this directory:

- Understand the service pattern for database access
- Note that entity-specific services extend the BaseService
- Be aware of the security middleware for protected operations
- Follow the established error handling patterns
- Remember that Zod schemas are used for validation
- Recognize that the api_client subdirectory contains the core client code
