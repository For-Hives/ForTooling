# Clerk Synchronization Services Overview

This directory contains services that handle synchronization between Clerk (authentication provider) and PocketBase (database). It ensures data consistency between these two systems.

## Key Files

- `syncService.ts` - Core functions for syncing users, organizations, and memberships
- `reconciliation.ts` - Functions for running full or partial data reconciliation
- `webhook-handler.ts` - Handler for processing Clerk webhook events
- `onBoardingHelper.ts` - Helpers for user onboarding processes
- `syncMiddleware.ts` - Middleware for sync operations

## Key Concepts

- **Data Synchronization**: Keeping Clerk and PocketBase data in sync
- **Webhooks**: Processing real-time events from Clerk
- **Reconciliation**: Scheduled processes to ensure data consistency
- **Onboarding**: Steps for new user and organization setup

## Best Practices

- Handle errors gracefully and provide detailed logs
- Use proper typing for all data structures
- Maintain idempotent operations for reliability
- Implement retries for transient failures

## Do's and Don'ts

### Do

- Use the established sync functions for user and organization operations
- Handle webhook events according to their types
- Consider data consistency in all operations
- Log important sync operations for debugging

### Don't

- Create direct database updates that bypass sync services
- Remove error handling in sync operations
- Mix sync logic with presentation logic
- Introduce circular dependencies between sync functions

## For AI Assistants

When working with this directory:

- Understand that `syncService.ts` contains the core sync functions
- Be aware of the data flow between Clerk and PocketBase
- Note that webhooks drive most synchronization operations
- Remember that reconciliation is used for periodic full sync
- Consider the direction of sync (Clerk to PocketBase, not vice versa)
