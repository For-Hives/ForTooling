# App Directory Overview

This directory follows the Next.js App Router structure and contains the main application routes, page components, and server actions.

## Directory Structure

- `(application)/` - Protected routes requiring authentication
- `(marketing)/` - Public routes for marketing and public pages
- `actions/` - Server actions for data operations
- `api/` - API routes including webhooks
- `globals.css` - Global CSS styles

## Key Concepts

- Routes are organized by access level using route groups (`(application)` and `(marketing)`)
- (application) is used for the main app part (/app(\*))
- (marketing) is used only for the front end marketing / business part (/(\*))
- Server components are used by default for better performance and security
- Server actions handle data mutations with proper authorization checks
- API routes handle webhooks and external integrations

## Best Practices

- Keep page components lightweight and focused on layout
- Move complex logic to server actions
- Use client components only when interactivity is needed
- Follow the security patterns established for data access

## Do's and Don'ts

### Do

- Use server components by default
- Add authorization checks to all secure routes and actions
- Handle errors appropriately in server actions
- Use the established middleware for security enforcement

### Don't

- Expose sensitive data in client components
- Bypass the security middleware for protected operations
- Create duplicative API routes for similar functionality
- Add heavy logic to page components

## For AI Assistants

When working with this directory:

- Always respect the division between public and protected routes
- Ensure new server actions use the security middleware
- Be aware that the app uses organization-based multi-tenancy
- Follow the file naming conventions established in each subdirectory
