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
