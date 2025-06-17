import 'client-only';

import { PGliteWorker } from '@electric-sql/pglite/worker';
// import { drizzle } from 'drizzle-orm/pglite';
import { useEffect, useState } from 'react';

import { _setupDb } from '@/lib/db/client/_setupDb';
import { _syncData } from '@/lib/db/client/_syncData';
// import * as schema from './schemas/index';

export const client = new PGliteWorker(
	new Worker(new URL('./db-worker.ts', import.meta.url), {
		name: 'pglite-worker',
		type: 'module',
	}),
	{
		dataDir: 'idb://converse-ai',
		id: 'converse-ai-db',
		meta: {
			appName: 'T3 Chat',
			version: '1.0.0',
		},
	},
);

// export const db = drizzle(client, { schema });

// ----

const DATABASE_NAME = 'client-postgres';

type DatabaseStatus = 'open' | 'migrating' | 'closed' | 'error';
type SyncStatus = 'not-started' | 'in-progress' | 'in-sync' | 'error';
export function useDatabase({ userId }: { userId?: string }) {
	const [isPending, setIsPending] = useState(true);
	const [dbStatus, setDbStatus] = useState<DatabaseStatus>('closed');
	const [syncStatus, setSyncStatus] = useState<SyncStatus>('not-started');
	const [error, setError] = useState<Error | null>(null);
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

	useEffect(() => {
		setDbStatus('migrating');
		_setupDb({ name: DATABASE_NAME })
			.then(() => {
				setDbStatus('open');
			})
			.catch((err) => {
				setError(err);
				setDbStatus('error');
				setIsPending(false);
			});
	}, []);

	useEffect(() => {
		if (!userId) return;
		setSyncStatus('in-progress');
		_syncData()
			.then(() => {
				setSyncStatus('in-sync');
			})
			.catch((err) => {
				setError(err);
				setSyncStatus('error');
			});
	}, [userId]);

	useEffect(() => {
		if (dbStatus === 'open' && syncStatus === 'in-sync') {
			setIsPending(false);
		} else {
			setIsPending(true);
		}
	}, [dbStatus, syncStatus]);

	return { dbStatus, error, isLeader, isPending, syncStatus };
}
