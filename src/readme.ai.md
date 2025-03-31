# Source Directory Overview

This directory contains the main source code for the SaaS Platform for Equipment Management with NFC/QR tracking.

## Directory Structure

- `app/` - Next.js App Router structure with application routes and server actions
- `components/` - Reusable React components
- `hooks/` - Custom React hooks for shared logic
- `lib/` - Utility functions and shared code
- `models/` - Data models and type definitions
- `stores/` - Zustand state management stores

## Best Practices

- Follow the established architectural patterns for each directory
- Maintain proper separation of concerns between layers
- Keep components focused on UI and presentation logic
- Use server actions for data mutations and secure operations
- Leverage the models directory for shared type definitions

## Do's and Don'ts

### Do

- Use relative imports with the `@/` prefix (e.g., `import { Button } from '@/components/ui/button'`)
- Add proper TypeScript type definitions for all new code
- Place business logic in appropriate server actions
- Reuse existing components and hooks where possible

### Don't

- Add business logic to client components
- Create circular dependencies between modules
- Duplicate code that already exists elsewhere
- Use any/unknown types without proper typing

## For AI Assistants

When working with this codebase:

- Understand the multi-tenant architecture with organization isolation
- Respect the security model with proper authentication checks
- Use the service layer for data access operations
- Follow the established directory structure and naming conventions
