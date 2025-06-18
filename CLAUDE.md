# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Core Development:**
```bash
bun dev                    # Start development server with Turbopack
bun run dev:start-db      # Start PostgreSQL service
bun run typecheck         # Run TypeScript checking
bun run lint              # Run ESLint
bun run format           # Format code with Biome
```

**Database Operations:**
```bash
bun run db:generate       # Generate Drizzle migrations
bun run db:push          # Push schema changes to database
bun run db:studio        # Open Drizzle Studio GUI
bun run db:migrate       # Run database migrations
```

**Authentication:**
```bash
bun run auth:generate     # Generate Better Auth database schema
```

**Build & Deploy:**
```bash
bun run build            # Production build
bun run start            # Start production server
```

## Architecture Overview

T3 Chat is an **offline-first AI chat application** built with Next.js 15 that enables conversations with multiple AI providers. Key architectural decisions:

### **Hybrid Database Architecture**
- **Server-side**: PostgreSQL with Drizzle ORM
- **Client-side**: PGlite (PostgreSQL in browser) for offline functionality
- **Synchronization**: Custom sync system between client and server databases
- **Web Workers**: Handle database operations in background threads

### **Authentication System**
- **Better Auth** with multiple providers (Google OAuth, Passkey/WebAuthn)
- **Anonymous users** supported with account linking capability
- **Session management** with 7-day expiration
- User data transfer when upgrading anonymous to authenticated accounts

### **AI Provider Integration**
- **Multi-provider support**: OpenRouter, OpenAI, Google Gemini, Groq, Cohere, Fireworks, Hugging Face, Ollama
- **Cost tracking** and rate limiting built-in
- **API key management** with encryption
- Provider abstraction in `src/ai/` directory

### **Key Directories**
- `src/app/(app)/` - Main protected application routes
- `src/app/(landing-pages)/` - Public marketing pages  
- `src/app/api/` - API routes for chat, auth, sync operations
- `src/lib/db/` - Database clients, schemas, and utilities
- `src/lib/auth/` - Better Auth configuration
- `src/ai/` - AI provider integrations and utilities
- `src/mutations/` - Database mutation functions

### **State Management**
- **Jotai** for client-side state management
- **Server Components** for data fetching where possible
- **React 19** with concurrent features

### **Offline-First Design**
- Service worker handles offline functionality
- PGlite enables full database operations offline
- Data synchronization when connection restored
- Background processing with Web Workers

## Development Notes

- Uses **Bun** as package manager and runtime
- **Biome** for formatting and basic linting (replaces Prettier/ESLint partially)
- **Turbopack** for fast development builds
- **TypeScript strict mode** enabled
- **Tailwind CSS v4** with custom design tokens
- Environment variables validated with Zod in `env.ts`

## Database Schema Management

The application maintains schemas for both server and client databases:
- Authentication tables (users, sessions, accounts)
- Core chat tables (conversations, messages, folders)
- Configuration tables (api-keys, models, presets, projects, prompts)
- Sync tables for data synchronization

When modifying schemas, run both `bun run db:generate` and `bun run auth:generate` as needed.