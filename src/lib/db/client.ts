import 'client-only'; // !  BUG - This is not working as expected

import type { PGlite } from '@electric-sql/pglite';
import { PGliteWorker } from '@electric-sql/pglite/worker';
import { drizzle, type PgliteDatabase } from 'drizzle-orm/pglite';

import * as schema from './schemas/index';

const worker =
	typeof window !== 'undefined' &&
	new window.Worker('/workers/db.worker.js', {
		name: 'db-worker',
		type: 'module',
	});

if (worker) {
	worker.onerror = (_err) => {};
}

export const client = (worker &&
	new PGliteWorker(worker)) as unknown as PGliteWorker;

export const db = (worker &&
	// @ts-expect-error - Type error
	drizzle(client, { schema })) as unknown as PgliteDatabase<
	typeof schema & { $client: PGlite }
>;

export { useDatabase } from './client/_useDatabase';
