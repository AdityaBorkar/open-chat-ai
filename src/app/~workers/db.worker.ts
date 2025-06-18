import { PGlite } from '@electric-sql/pglite';
import { worker } from '@electric-sql/pglite/worker';

worker({
	async init() {
		console.log('init');
		return new PGlite({
			dataDir: 'idb://converse-ai',
			relaxedDurability: true,
		});
	},
});
