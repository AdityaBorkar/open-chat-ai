import { migrate } from 'drizzle-orm/pglite/migrator';

import { client, db } from './index';

async function main() {
	console.log('Running migrations...');

	try {
		await migrate(db, { migrationsFolder: './drizzle' });
		console.log('Migrations completed successfully!');
	} catch (error) {
		console.error('Migration failed:', error);
		process.exit(1);
	}

	await client.close();
}

main();
