# Stores Directory Overview

This directory contains Zustand stores for global state management across the application. These stores provide a lightweight alternative to React Context for sharing state between components.
We need to avoid all the React context use. so we use Zustand stores when it's needed (we avoid props drilling with this strategie)

## Key Concepts

- **Zustand Stores**: Lightweight state management with hooks
- **Global State**: Shared application state across components
- **Persistence**: Optionally persisted state using middleware
- **Type Safety**: TypeScript interfaces for store state and actions

## Best Practices

- Keep stores focused on specific domains
- Use TypeScript interfaces for store state and actions, avoid duplicate with types already defined in other layers ( models / types )
- Follow the established patterns for store creation
- Separate actions from state in the store definition

## Do's and Don'ts

### Do

- Create domain-specific stores with clear boundaries
- Use selectors for accessing specific parts of state
- Add TypeScript interfaces for store state
- Document complex state structures or actions

### Don't

- Create overlapping stores with duplicate state
- Put transient UI state in global stores
- Create stores with overly complex state shapes
- Bypass stores for cross-component communication

## For AI Assistants

When working with this directory:

- Understand that Zustand is the preferred state management solution
- Note that stores expose both state and actions
- Be aware of the convention to use selectors for state access
- Remember that stores can use middleware for persistence
- Follow the established patterns for new stores
- Consider that stores should be used where React props would be cumbersome
