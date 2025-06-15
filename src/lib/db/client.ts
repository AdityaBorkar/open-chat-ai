import 'client-only';

import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { useEffect, useState } from 'react';

import { setupDatabase } from './client/setupDatabase';
import * as schema from './schemas/index';

export const client = new PGlite('idb://converse-ai');

export const db = drizzle(client, { schema });

export function useDatabase({ userId }: { userId?: string }) {
	const [isPending, setIsPending] = useState(true);
	const [status, setStatus] = useState<'open' | 'closed' | 'error'>('closed');
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		setupDatabase()
			.then(() => {
				setStatus('open');
				setIsPending(false);
			})
			.catch((err) => {
				setError(err);
				setStatus('error');
				setIsPending(false);
			});
	}, []);

	return { error, isPending, status };
}
