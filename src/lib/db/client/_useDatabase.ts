import { useEffect, useMemo, useState } from 'react';

import { _setupDb } from '@/lib/db/client/_setupDb';
import { _syncData } from '@/lib/db/client/_syncData';

const DATABASE_NAME = 'client-postgres';

type DatabaseStatus = 'open' | 'migrating' | 'closed' | 'error';
type SyncStatus = 'not-started' | 'in-progress' | 'in-sync' | 'error';

interface DatabaseState {
	dbStatus: DatabaseStatus;
	syncStatus: SyncStatus;
	error: Error | null;
}

export function useDatabase({ userId }: { userId?: string }) {
	const [state, setState] = useState<DatabaseState>({
		dbStatus: 'closed',
		error: null,
		syncStatus: 'not-started',
	});

	// Database setup effect with cleanup
	useEffect(() => {
		let isCancelled = false;

		setState((prev) => ({ ...prev, dbStatus: 'migrating' }));

		// TODO: Add a AbortController
		_setupDb({ name: DATABASE_NAME })
			.then(() => {
				if (!isCancelled) {
					setState((prev) => ({ ...prev, dbStatus: 'open' }));
				}
			})
			.catch((error) => {
				if (!isCancelled) {
					setState((prev) => ({ ...prev, dbStatus: 'error', error }));
				}
			});

		return () => {
			isCancelled = true;
		};
	}, []);

	// Data sync effect with cleanup
	useEffect(() => {
		if (!userId) {
			setState((prev) => ({ ...prev, syncStatus: 'not-started' }));
			return;
		}

		let isCancelled = false;

		setState((prev) => ({ ...prev, syncStatus: 'in-progress' }));

		// TODO: Add a AbortController
		_syncData()
			.then(() => {
				if (!isCancelled) {
					setState((prev) => ({ ...prev, syncStatus: 'in-sync' }));
				}
			})
			.catch((error) => {
				if (!isCancelled) {
					setState((prev) => ({ ...prev, error, syncStatus: 'error' }));
				}
			});

		return () => {
			isCancelled = true;
		};
	}, [userId]);

	return useMemo(
		() => ({
			...state,
			isPending: !(state.syncStatus === 'in-sync' && state.dbStatus === 'open'),
		}),
		[state],
	);
}
