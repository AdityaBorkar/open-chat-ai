import 'client-only';

import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { useEffect, useState } from 'react';

import { _syncData } from '@/lib/db/client/_syncData';
import { _setupDb } from './client/_setupDb';
import * as schema from './schemas/index';

export const client = new PGlite('idb://converse-ai');

export const db = drizzle(client, { schema });

// ----

const DATABASE_NAME = 'client-postgres';

type DatabaseStatus = 'open' | 'migrating' | 'closed' | 'error';
type SyncStatus = 'not-started' | 'in-progress' | 'in-sync' | 'error';
export function useDatabase({ userId }: { userId?: string }) {
	const [isPending, setIsPending] = useState(true);
	const [dbStatus, setDbStatus] = useState<DatabaseStatus>('closed');
	const [syncStatus, setSyncStatus] = useState<SyncStatus>('not-started');
	const [error, setError] = useState<Error | null>(null);

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
		if (userId && dbStatus === 'open') {
			setSyncStatus('in-progress');
			_syncData({ userId })
				.then(() => {
					setSyncStatus('in-sync');
				})
				.catch((err) => {
					setError(err);
					setSyncStatus('error');
				});
		}
	}, [userId, dbStatus]);

	useEffect(() => {
		if (dbStatus === 'open' && syncStatus === 'in-sync') {
			setIsPending(false);
		} else {
			setIsPending(true);
		}
	}, [dbStatus, syncStatus]);

	return { dbStatus, error, isPending, syncStatus };
}
