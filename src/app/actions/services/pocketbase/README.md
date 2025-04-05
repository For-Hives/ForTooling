# PocketBase API Client Architecture

This directory contains a structured API client for PocketBase, designed to provide type-safe, validated data access with clean abstractions.

## Directory Structure

```
pocketbase/
├── api_client/               # Core API client components
│   ├── types.ts              # TypeScript interfaces for all models
│   ├── schemas.ts            # Zod validation schemas
│   ├── client.ts             # PocketBase client and utilities
│   ├── base_service.ts       # Generic CRUD operations
│   └── index.ts              # Re-exports and utilities
├── organization_service.ts   # Organization-specific operations
├── app_user_service.ts       # User-specific operations
├── equipment_service.ts      # Equipment-specific operations
└── index.ts                  # Re-exports all services
```

## Key Features

1. **Type Safety**: Full TypeScript interfaces for all PocketBase models.
2. **Validation**: Zod schemas for request and response validation.
3. **Error Handling**: Consistent error handling with detailed error messages.
4. **Modularity**: Each collection has its own service with specific methods.
5. **DRY Code**: Common operations are abstracted into the BaseService.
6. **Singleton Pattern**: Services are implemented as singletons for efficient reuse.

## Usage Examples

### Finding a User by Clerk ID

```typescript
import { findUserByClerkId } from '@/app/actions/services/pocketbase'

const user = await findUserByClerkId('clerk_123')
if (user) {
	// User exists in PocketBase
	console.log(user.name)
}
```

### Creating or Updating an Organization

```typescript
import { createOrUpdateOrganizationByClerkId } from '@/app/actions/services/pocketbase'

const org = await createOrUpdateOrganizationByClerkId('clerk_org_123', {
	name: 'My Organization',
	email: 'org@example.com',
	phone: '123-456-7890',
	// ... other fields
})
```

### Searching for Equipment

```typescript
import { searchEquipment } from '@/app/actions/services/pocketbase'

const items = await searchEquipment(organizationId, 'drill')
console.log(`Found ${items.length} items matching 'drill'`)
```

## Implementation Notes

### BaseService

The `BaseService` provides generic CRUD operations for any collection:

- `getById`: Fetch a single record by ID
- `getList`: Get a paginated list of records
- `create`: Create a new record
- `update`: Update an existing record
- `delete`: Delete a record
- `getCount`: Count records matching a filter

### Service-specific Methods

Each collection-specific service adds custom methods relevant to that entity:

- Organization: `findByClerkId`, `createOrUpdateByClerkId`
- AppUser: `findByClerkId`, `linkToOrganization`, `getByOrganization`
- Equipment: `findByQrNfcCode`, `findByOrganization`, `search`

### Validation

All data is validated using Zod schemas:

- Input validation before sending to PocketBase
- Output validation after receiving from PocketBase

### Error Handling

Errors are handled consistently across the entire API client:

- PocketBase errors are converted to a standard format
- Validation errors include detailed information about what failed
- Common error handling with the `handlePocketBaseError` utility

## Best Practices

1. Always use exported functions rather than direct service instances
2. Use the specific service methods rather than generic CRUD when possible
3. Handle errors appropriately in your calling code
4. Use the validation utilities to ensure data integrity
