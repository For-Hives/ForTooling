# Equipment Actions Overview

This directory contains server actions specific to equipment management functionality. These actions provide the business logic for equipment-related operations in the application.

## Key Files

- Server action files for equipment operations (create, update, delete, etc.)

## Key Concepts

- **Server Actions**: Functions for equipment-related data operations
- **Validation**: Input validation for equipment operations
- **Security**: Authorization checks for equipment access
- **Business Logic**: Specific rules for equipment management

## Best Practices

- Use the secured PocketBase services for data operations
- Implement proper validation for all inputs
- Follow the established patterns for server actions
- Handle errors appropriately with specific messages

## Do's and Don'ts

### Do

- Use secured services for all data operations
- Validate inputs with Zod before processing
- Handle errors with appropriate status codes
- Follow the established patterns for equipment actions

### Don't

- Bypass security checks or validation
- Implement business logic that belongs in the UI
- Create redundant actions for similar operations
- Expose sensitive data in responses

## For AI Assistants

When working with this directory:

- Understand that these actions handle equipment-specific operations
- Note that all actions should use secured services
- Be aware of the business rules for equipment management
- Follow the established patterns for error handling
- Remember that equipment is organization-specific and requires proper isolation
