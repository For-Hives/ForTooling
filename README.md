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

### Types Organization

All types are centralized in the `/types` directory to avoid duplication and maintain DRY principles:

```
/types
  /pocketbase         # PocketBase related types
    /base.ts          # Base types (BaseRecord, ListResult, etc.)
    /collections.ts   # Collection name constants
    /equipment.ts     # Equipment specific types
    /index.ts         # Re-exports for easier imports
  # Other type categories can be added here
```

### Validation Schemas

Zod validation schemas are centralized in the `/schemas` directory:

```
/schemas
  /pocketbase         # PocketBase related schemas
    /base.ts          # Base schemas and utility functions
    /equipment.ts     # Equipment specific schemas
    /index.ts         # Re-exports for easier imports
  # Other schema categories can be added here
```

### Services

Services use the centralized types and schemas:

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
