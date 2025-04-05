# Library Directory Overview

This directory contains utility functions, helper classes, and shared code that is used throughout the application. It provides common functionality that doesn't fit into components, hooks, or models.

## Key Concepts

- **Utility Functions**: Pure functions for common tasks
- **Helpers**: Helper functions for specific domains
- **Constants**: Application-wide constants and configuration
- **Type Guards**: TypeScript type guards and type utilities

## Best Practices

- Keep utilities focused on a single responsibility
- Write pure functions whenever possible
- Use TypeScript for proper typing
- Add comprehensive tests for utility functions

## Do's and Don'ts

### Do

- Create well-documented, reusable utilities
- Use descriptive names that indicate purpose
- Add proper TypeScript types for all functions
- Group related utilities in appropriate files

### Don't

- Add stateful logic to utility functions
- Create utilities with side effects
- Duplicate functionality from standard libraries
- Mix unrelated utilities in the same file

## For AI Assistants

When working with this directory:

- Understand that lib contains shareable, stateless utilities
- Note that functions should be pure when possible
- Be aware of the organization by domain/purpose
- Remember that utilities should have proper TypeScript types
- Follow the established patterns for error handling
- Consider that utilities should be well-tested
