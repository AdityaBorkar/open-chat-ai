# Better Auth + Drizzle Setup

This project now includes Better Auth for authentication and Drizzle ORM for database operations.

## Setup Steps

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-here-min-32-chars
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 2. Generate Database Migration

```bash
bun run db:generate
```

### 3. Create Database Directory

```bash
mkdir -p data
```

### 4. Run the Application

```bash
bun dev
```

The database will be automatically created in `./data/database.db` when the app starts.

## Database Schema

The setup includes the following tables:

### Authentication Tables (Better Auth)
- `user` - User accounts
- `session` - User sessions
- `account` - OAuth accounts
- `verification` - Email verification tokens

### Application Tables
- `folders` - Chat folders/categories
- `conversations` - Chat conversations
- `messages` - Chat messages
- `apiKeys` - User API keys (encrypted)
- `projects` - User projects
- `prompts` - User prompt templates

## Available Scripts

- `bun run db:generate` - Generate migration files from schema
- `bun run db:push` - Push schema changes to database
- `bun run db:studio` - Open Drizzle Studio (database GUI)

## Usage Examples

### Server-side Authentication

```typescript
import { requireUser } from '@/lib/auth-server';

export default async function Page() {
  const user = await requireUser(); // Throws if not authenticated
  return <div>Hello {user.name}</div>;
}
```

### Client-side Authentication

```typescript
'use client';
import { useAuth } from '@/lib/auth-client';

export default function Component() {
  const { user, signIn, signOut, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <button onClick={() => signIn('email', 'password')}>Sign In</button>;

  return (
    <div>
      <p>Welcome {user.name}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Database Queries

```typescript
import { conversationQueries } from '@/lib/db/queries';

// Get user's conversations
const conversations = await conversationQueries.getByUserId(userId);

// Create new conversation
const newConvo = await conversationQueries.create({
  title: 'New Chat',
  userId: user.id,
  type: 'chat',
});
```

## Authentication Flow

1. **Email/Password**: Users can sign up with email and password
2. **OAuth**: Support for Google and GitHub OAuth
3. **Email Verification**: Optional email verification for new accounts
4. **Session Management**: Automatic session handling and refresh

## Database Features

- **Local Storage**: Uses PGlite for client-side PostgreSQL database
- **Type Safety**: Full TypeScript support with Drizzle ORM
- **Migrations**: Automatic schema migrations
- **Relationships**: Proper foreign keys and cascading deletes
- **Offline Support**: Works offline with local database