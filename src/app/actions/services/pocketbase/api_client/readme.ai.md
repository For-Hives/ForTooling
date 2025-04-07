# PocketBase API Client Overview

This directory contains the core client for communicating with the PocketBase backend. It provides the foundation for all database operations.

## Key Files

- `client.ts` - Core PocketBase client initialization and utilities
- `base_service.ts` - Generic CRUD service for PocketBase collections
- `index.ts` - Exports for client components and services

## Key Concepts

- **PocketBase Client**: Initialized and configured connection to PocketBase
- **BaseService**: Generic class with CRUD operations for any collection
- **Error Handling**: Centralized error processing for PocketBase operations
- **Type Safety**: Zod validation for inputs and outputs

## Best Practices

- Use the BaseService for implementing entity-specific services
- Handle errors using the centralized error utilities
- Validate inputs and outputs using Zod schemas
- Follow the established patterns for service methods

## Do's and Don'ts

### Do

- Use getPocketBase() to obtain the client instance
- Handle errors with handlePocketBaseError
- Validate data with validateWithZod
- Extend BaseService for new entity services

### Don't

- Create multiple PocketBase client instances
- Bypass error handling mechanisms
- Skip validation for inputs or outputs
- Modify core client behavior without careful consideration

## For AI Assistants

When working with this directory:

- Understand that this is the foundational layer for database access
- Note that BaseService provides generic CRUD operations
- Be aware of the error handling patterns in handlePocketBaseError
- Recognize that all entity-specific services extend BaseService
- Remember that Zod is used for validation throughout the system
- Consider that this layer abstracts away direct PocketBase API calls
