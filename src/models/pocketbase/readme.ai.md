# PocketBase Models Overview

This directory contains the models, types, and validation schemas specific to PocketBase entities. These models represent the database schema and provide type safety and validation.

## Key Files

- `base.model.ts` - Base model types and utilities for all PocketBase entities
- `collections.model.ts` - Collection name constants
- Entity-specific models:
  - `app-user.model.ts` - User model
  - `equipment.model.ts` - Equipment model
  - `organization.model.ts` - Organization model
- `index.ts` - Centralized exports for all models

## Key Concepts

- **Base Models**: Common fields shared by all PocketBase records
- **Entity Models**: Specific fields and validation for each entity type
- **Zod Schemas**: Runtime validation for data integrity
- **TypeScript Types**: Static typing for development safety

## Best Practices

- Define both TypeScript types and Zod schemas for each entity
- Follow the established naming conventions (EntityName, EntityNameCreateInput, etc.)
- Use the createServiceSchemas utility for consistent schema creation
- Maintain backward compatibility when modifying existing models

## Do's and Don'ts

### Do

- Create new entity models following the established pattern
- Export all types and schemas from the index.ts file
- Add JSDoc comments for complex fields or validation rules
- Use the base model types for common fields

### Don't

- Duplicate type definitions across files
- Add business logic to model files
- Create models without proper validation schemas
- Define entity-specific fields in the base model

## For AI Assistants

When working with this directory:

- Understand the pattern of types + schemas for each entity
- Note that each entity model has create/update input types
- Be aware of the relationship between models and PocketBase collections
- Remember that all entities extend the BaseRecord type
- Follow the established naming conventions for consistency
- Recognize that models are used by services for data operations
