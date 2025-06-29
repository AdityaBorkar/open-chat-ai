import { clientSchemaVersions } from '@/lib/db/schemas/index';
import { client, db } from '@/lib/db/server';
import { getSchema } from './_sync/drizzle/getSchema';
import { calculateChecksum } from './_sync/utils/calculateChecksum';

const DRIZZLE_OUT_PATH = './drizzle/server';

async function _syncPublicNew(): Promise<void> {
	try {
		// Generate Latest Schema
		const { sql, tag } = await getSchema({ DRIZZLE_OUT_PATH });
		const snapshot = '{}';
		const checksum = calculateChecksum(sql);

		// Get Active Version
		// const latest = await getCurrentVersion();
		// if (latest.checksum === checksum) {
		// 	throw new Error('Same checksum');
		// }

		// Insert new schema version
		await db
			.insert(clientSchemaVersions)
			.values({ checksum, snapshot, sql, tag });
	} finally {
		await client.end();
	}
}

_syncPublicNew()
	.then(() => {
		console.log('done');
	})
	.catch((error) => {
		console.error(error);
	});

// import fs from 'node:fs/promises'

// import { readMigrationFiles } from 'drizzle-orm/migrator'

// const file = './src/db/migrations/export.json'

// async function main() {
//   const content = JSON.stringify(
//     readMigrationFiles({
//       migrationsFolder: './src/db/migrations'
//     }),
//     null,
//     0
//   )

//   // Replace `CREATE TABLE` with `CREATE TABLE IF NOT EXISTS`
//   const updatedContent = content.replace(/CREATE TABLE/g, 'CREATE TABLE IF NOT EXISTS')

//   await fs.writeFile(`${file}`, updatedContent, {
//     flag: 'w'
//   })
// }

// if (require.main === module) {
//   main()
// }
