# Services Directory Overview

This directory contains service modules that handle integration with external systems and provide a clean API for data access. Services act as a bridge between server actions and external resources.

## Directory Structure

- `clerk-sync/` - Services for synchronizing data between Clerk and PocketBase
- `pocketbase/` - Services for interacting with the PocketBase backend
- `securyUtilsTools.ts` - Security utilities for server actions

## Key Concepts

- **Service Layer**: Encapsulates external system interactions
- **Data Synchronization**: Maintains consistency between auth system and database
- **Security Middleware**: Enforces access control and tenant isolation

## Best Practices

- Keep service methods focused on single responsibilities
- Handle errors consistently and provide meaningful messages
- Use TypeScript types for service inputs and outputs
- Follow the established patterns for each service type

## Do's and Don'ts

### Do

- Use the appropriate service for each external system
- Handle and log errors at the service level
- Follow the established typings for each service
- Maintain proper separation between different services

### Don't

- Mix concerns between different service types
- Bypass service layers to access external systems directly
- Expose sensitive information in service responses
- Create redundant services for the same functionality

## For AI Assistants

When working with this directory:

- Understand that services are organized by external system
- Be aware of the synchronization patterns between Clerk and PocketBase
- Note the security patterns implemented in the middleware
- Follow the established error handling patterns
- Remember that PocketBase services form the core data access layer
