# Fortooling

--
api :

- <https://api.fortooling.forhives.fr/_/>
- See our vaultwarden for password and credentials

## Dev

## how to run the project

`bun install`
`bun run dev`
`ngrok http 3000`

We get the ngrok url , and we setup this one in the webhook list from clerk
-> we need to change every webhook secret / endpoint for every webhook locally needed

for example, we can have :

- <https://8a82-90-12-63-1.ngrok-free.app/api/webhook/clerk/organization>
- <https://8a82-90-12-63-1.ngrok-free.app/api/webhook/clerk/user>
- <https://8a82-90-12-63-1.ngrok-free.app/api/webhook/clerk/...>

# QR/NFC Equipment Management System

A SaaS platform for managing equipment inventory and tracking using QR codes and NFC technology.

## Project Structure

The project follows a modular structure with clear separation of concerns:

### Models Organization

All models are centralized in the `/models` directory, combining types and validation schemas in a cohesive location:

```
/models
  /pocketbase                  # PocketBase related models
    /base.model.ts             # Base types, schemas and utilities
    /collections.model.ts      # Collection name constants
    /equipment.model.ts        # Equipment specific types and schemas
    /index.ts                  # Re-exports for easier imports
  # Other model categories can be added here
```

Each model file follows a consistent pattern:

1. Type definitions section (interfaces, types)
2. Schema definitions section (Zod validation schemas)
3. Helper functions (if needed)

This approach offers several benefits:

- **Colocation** - Types and their validation schemas are kept together
- **Discoverability** - Easy to find both the type and its validation in one place
- **Maintainability** - Changes to a model only require editing a single file
- **Consistency** - Consistent naming convention with `.model.ts` suffix

### Services

Services use the centralized models:

```
/app/actions/services
  /pocketbase
    /api_client       # Base API client
    /equipment_service.ts  # Equipment specific service
    # Other services
```

This structure ensures:

- No type duplication (DRY principle)
- Clear separation of concerns
- Easy maintenance and refactoring
- Type safety across the application
- Logical grouping of related code
