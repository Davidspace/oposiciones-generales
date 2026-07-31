# Overview

LORMAN ACADEMIA is a Spanish language subscription-based educational platform specializing in TCAE (Técnico en Cuidados Auxiliares de Enfermería) exam preparation for the SAS Andalucía health system. The application is a full-stack web platform built with React and Express, featuring a modern landing page design with integrated payment processing through PayPal. The platform offers comprehensive study materials including video classes, PDFs, memory techniques, and extensive practice tests with over 200 questions per topic.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built using React 18 with TypeScript, utilizing a component-based architecture with the following key design decisions:

- **UI Framework**: Implements shadcn/ui components built on top of Radix UI primitives for accessibility and consistency
- **Styling**: Uses Tailwind CSS with a custom design system featuring CSS variables for theming support
- **State Management**: Leverages TanStack React Query for server state management and caching
- **Routing**: Implements wouter for lightweight client-side routing
- **Form Handling**: Uses React Hook Form with Zod validation for type-safe form management

The component structure follows a modern React patterns with custom hooks for shared logic like mobile detection and toast notifications.

## Backend Architecture
The server-side uses Express.js with TypeScript in ESM format, designed as a RESTful API:

- **Framework**: Express.js server with middleware for JSON parsing and request logging
- **Database Integration**: Configured for PostgreSQL using Drizzle ORM with migration support
- **Session Management**: Implements connect-pg-simple for PostgreSQL-backed sessions
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

## Data Storage Solutions
The application uses a hybrid storage approach:

- **Primary Database**: PostgreSQL configured through Neon serverless for scalability
- **ORM**: Drizzle ORM with TypeScript support for type-safe database operations
- **Schema Management**: Centralized schema definitions in shared directory with Zod validation
- **Development Storage**: In-memory storage implementation for development and testing

The user schema includes basic authentication fields (id, username, password) with UUID primary keys.

## Authentication and Authorization
Currently implements a basic user authentication system:

- **User Model**: Simple username/password authentication with UUID identifiers
- **Storage Interface**: Abstracted storage layer allowing for easy switching between implementations
- **Security**: Prepared for session-based authentication with PostgreSQL session storage

## External Dependencies

### Payment Processing
- **PayPal SDK**: Integration with PayPal Server SDK for subscription and payment processing
- **Environment Support**: Configurable for both sandbox and production environments
- **Order Management**: Handles order creation and capture workflows

### Database Services
- **Neon Database**: PostgreSQL serverless database provider for production
- **Drizzle Kit**: Database migration and schema management tools

### UI and Styling
- **Radix UI**: Comprehensive accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Inter font family for typography

### Development Tools
- **Vite**: Build tool and development server with React plugin support
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast bundling for production builds
- **Replit Integration**: Development environment optimizations for Replit platform

The application is designed for deployment on Replit with specific optimizations for the platform's development and hosting environment.