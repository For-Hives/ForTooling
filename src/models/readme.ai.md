# Models Directory Overview

This directory contains the data models, type definitions, and validation schemas used throughout the application. It serves as the central source of truth for data structures.

## Directory Structure

- `pocketbase/` - Models for PocketBase entities with type definitions and Zod schemas

## Key Concepts

- **Type Definitions**: TypeScript interfaces for all data structures
- **Validation Schemas**: Zod schemas for runtime validation
- **Data Models**: Combination of types and validation for entities
- **Single Source of Truth**: Central location for all data structures

## Best Practices

- Define all types and schemas in one place
- Use Zod for validation throughout the application
- Follow the established patterns for model definitions
- Keep models focused on data structure, not behavior

## Do's and Don'ts

### Do

- Define new models in the appropriate subdirectory
- Create both TypeScript types and Zod schemas
- Export types and schemas from the index files
- Follow the established naming conventions

### Don't

- Duplicate model definitions across the application
- Mix business logic with data models
- Create models without proper validation schemas
- Define models outside this directory

## For AI Assistants

When working with this directory:

- Understand that models define both types and validation
- Note that all PocketBase models extend BaseRecord
- Be aware of the centralized export pattern in index.ts files
- Remember that these models are used throughout the application
- Follow the established patterns for new model definitions
- Recognize that models are organized by data source/system
