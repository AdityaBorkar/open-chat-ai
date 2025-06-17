# PGlite Multi-Tab Worker Implementation

This document explains how to properly implement PGlite multi-tab workers in Next.js.

## Overview

PGlite workers allow sharing a single database instance across multiple browser tabs, with automatic leader election to determine which tab manages the database.

## File Structure

```
src/lib/db/
├── client.ts        # Main client with PGliteWorker setup
├── db-worker.ts     # Worker implementation
└── client/
    ├── _setupDb.ts  # Database setup logic
    └── _syncData.ts # Data synchronization
```

## Implementation

### 1. Worker File (`src/lib/db/db-worker.ts`)

```typescript
import { PGlite } from '@electric-sql/pglite';
import { OpfsAhpFS } from '@electric-sql/pglite/opfs-ahp';
import { worker } from '@electric-sql/pglite/worker';

worker({
	async init(options) {
		const client = new PGlite({
			dataDir: options?.dataDir || 'idb://converse-ai',
			fs: new OpfsAhpFS('./converse-ai'),
			relaxedDurability: true,
		});
		return client;
	},
});
```

### 2. Client Setup (`src/lib/db/client.ts`)

```typescript
import { PGliteWorker } from '@electric-sql/pglite/worker';

export const client = new PGliteWorker(
	new Worker(new URL('./db-worker.ts', import.meta.url), {
		type: 'module',
		name: 'pglite-worker'
	}),
	{
		dataDir: 'idb://converse-ai',
		id: 'converse-ai-db',
		meta: {
			appName: 'T3 Chat',
			version: '1.0.0'
		}
	}
);

export function useDatabase({ userId }: { userId?: string }) {
	const [isLeader, setIsLeader] = useState(false);

	useEffect(() => {
		// Subscribe to leader changes
		const unsubscribe = client.onLeaderChange(() => {
			setIsLeader(client.isLeader);
		});

		// Set initial leader state
		setIsLeader(client.isLeader);

		return unsubscribe;
	}, []);

	return { isLeader, /* other status */ };
}
```

### 3. Next.js Configuration (`next.config.ts`)

```typescript
const nextConfig: NextConfig = {
	async headers() {
		return [
			{
				headers: [
					{
						key: 'Cross-Origin-Embedder-Policy',
						value: 'require-corp',
					},
					{
						key: 'Cross-Origin-Opener-Policy',
						value: 'same-origin',
					},
				],
				source: '/(.*)',
			},
		];
	},
	serverExternalPackages: ['@electric-sql/pglite'],
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.output.globalObject = 'self';
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				path: false,
				crypto: false,
			};
		}
		return config;
	},
};
```

## Key Features

### Leader Election
- One tab becomes the "leader" and manages the database
- Other tabs are "followers" that proxy requests to the leader
- Automatic re-election when leader tab closes

### Configuration Options

| Option | Description | Example |
|--------|-------------|---------|
| `dataDir` | Database storage location | `'idb://my-app'` |
| `id` | Worker group identifier | `'my-app-db'` |
| `meta` | Additional metadata for worker | `{ version: '1.0' }` |

### Worker Events

```typescript
// Subscribe to leader changes
const unsubscribe = client.onLeaderChange(() => {
	console.log('Leader changed:', client.isLeader);
});

// Check current leader status
console.log('Is leader:', client.isLeader);
```

## Testing Multi-Tab Functionality

1. Start the development server: `bun run dev`
2. Navigate to `/test` to see the WorkerStatus component
3. Open multiple tabs to the same page
4. Observe leader election in action
5. Close the leader tab to see re-election

## Common Issues & Solutions

### Issue: Worker fails to load
**Solution**: Ensure worker file is in `src/` directory, not `public/`

### Issue: CORS errors
**Solution**: Add proper headers in `next.config.ts`:
```typescript
{
	key: 'Cross-Origin-Embedder-Policy',
	value: 'require-corp',
},
{
	key: 'Cross-Origin-Opener-Policy',
	value: 'same-origin',
}
```

### Issue: Module resolution errors
**Solution**: Configure webpack fallbacks for Node.js modules

### Issue: Leader election not working
**Solution**: Ensure all tabs use the same `id` in worker options

## Best Practices

1. **Worker Configuration**
   - Use descriptive worker names
   - Set appropriate timeouts
   - Handle initialization errors

2. **Error Handling**
   - Wrap database calls in try-catch
   - Implement retry logic for failed operations
   - Monitor leader election status

3. **Performance**
   - Use IndexedDB for persistent storage
   - Enable relaxed durability for better performance
   - Consider connection pooling for high-frequency operations

## Resources

- [PGlite Multi-tab Worker Documentation](https://pglite.dev/docs/multi-tab-worker)
- [Next.js Worker Configuration](https://nextjs.org/docs/app/api-reference/next-config-js/webpack)
- [OpfsAhpFS Documentation](https://pglite.dev/docs/filesystems#opfs-ahp)