import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';

import { _setupDb } from '@/lib/db/client/_setupDb';
import { _syncData } from '@/lib/db/client/_syncData';
import { tryCatch } from '@/lib/tryCatch';

const DATABASE_NAME = 'client-postgres';

type DatabaseStatus = 'initializing' | 'open' | 'error';
type SyncStatus = 'not-started' | 'in-progress' | 'in-sync' | 'error';

interface DatabaseState {
	dbStatus: DatabaseStatus;
	error: Error | null;
}

// Global state management for database
let dbState: DatabaseState = { dbStatus: 'initializing', error: null };
let listeners: (() => void)[] = [];
let initPromise: Promise<void> | null = null;

function notifyListeners() {
	listeners.forEach((callback) => callback());
}

function updateDbState(newState: Partial<DatabaseState>) {
	dbState = { ...dbState, ...newState };
	notifyListeners();
}

async function initializeDatabase() {
	if (initPromise) {
		return initPromise;
	}

	initPromise = (async () => {
		try {
			updateDbState({ dbStatus: 'initializing', error: null });

			const _PerfStart = performance.now();
			const { error } = await tryCatch(_setupDb({ name: DATABASE_NAME }));
			const _PerfEnd = performance.now();

			if (error) {
				updateDbState({ dbStatus: 'error', error });
			} else {
				updateDbState({ dbStatus: 'open', error: null });
			}
		} catch (err) {
			updateDbState({
				dbStatus: 'error',
				error:
					err instanceof Error
						? err
						: new Error('Database initialization failed'),
			});
		}
	})();

	return initPromise;
}

// External store for database state
const databaseStore = {
	getServerSnapshot: () => dbState,
	getSnapshot: (): DatabaseState => dbState,
	subscribe: (callback: () => void) => {
		listeners.push(callback);

		// Start initialization if not already started
		if (!initPromise) {
			initializeDatabase();
		}

		return () => {
			listeners = listeners.filter((l) => l !== callback);
		};
	},
};

export function useDatabase() {
	const [sync, setSync] = useState<{ status: SyncStatus; error: Error | null }>(
		{
			error: null,
			status: 'not-started',
		},
	);

	const db = useSyncExternalStore(
		databaseStore.subscribe,
		databaseStore.getServerSnapshot,
		databaseStore.getSnapshot,
	);

	useEffect(() => {
		if (db.dbStatus !== 'open') {
			setSync({ error: null, status: 'not-started' });
			return;
		}

		let cancelled = false;

		async function syncData() {
			if (cancelled) {
				return;
			}

			setSync({ error: null, status: 'in-progress' });

			const { error } = await tryCatch(_syncData());

			if (!cancelled) {
				const status = error ? 'error' : 'in-sync';
				setSync({ error, status });
			}
		}

		syncData();

		return () => {
			cancelled = true;
		};
	}, [db.dbStatus]);

	return useMemo(
		() => ({
			dbStatus: db.dbStatus,
			error: db.error || sync.error,
			isPending: db.dbStatus !== 'open' || sync.status === 'in-progress',
			isReady: db.dbStatus === 'open' && sync.status === 'in-sync',
			syncStatus: sync.status,
		}),
		[db, sync],
	);
}
