# Actions Directory Overview

This directory contains server actions that handle data operations and business logic for the application. Server actions are a Next.js feature that allows executing code on the server for secure data operations.

## Directory Structure

- `equipment/` - Actions related to equipment management
- `services/` - Core services and utilities for data access and integration

## Key Concepts

- **Server Actions**: Functions marked with `'use server'` that run securely on the server
- **Security Middleware**: Higher-order functions that wrap actions to enforce security
- **Service Layer**: Utilities for interacting with external services like PocketBase and Clerk

## Best Practices

- Always wrap sensitive operations with the security middleware
- Include proper error handling and validation
- Use TypeScript types for inputs and outputs
- Keep actions focused on a single responsibility

## Do's and Don'ts

### Do

- Use the `withSecurity` middleware for protected operations
- Validate inputs with Zod before processing
- Handle errors with proper status codes and messages
- Organize actions by domain/feature

### Don't

- Create actions without proper security checks
- Expose sensitive data in return values
- Mix client and server code in the same file
- Bypass the service layer for data access

## For AI Assistants

When working with this directory:

- Always respect the multi-tenant security model
- Understand the pattern of using service layers for data access
- Follow the established pattern for error handling and validation
- Be aware of the revalidation paths for data mutations
- Note that the security middleware automatically handles organization isolation
