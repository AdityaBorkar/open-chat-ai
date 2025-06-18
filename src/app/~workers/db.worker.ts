import { IdbFs, PGlite } from '@electric-sql/pglite';
import { worker } from '@electric-sql/pglite/worker';

worker({
	async init() {
		const pg = new PGlite({
			fs: new IdbFs('converse-ai'),
			relaxedDurability: true,
		});
		// await pg.waitReady; // We are not waiting here because we want the main thread to do work faster.

		// TODO: Perform Sync

		return pg;
	},
});
