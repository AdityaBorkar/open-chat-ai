import { clientSchemaVersions } from '@/lib/db/schemas';
import { client, db } from '@/lib/db/server';
import { getSchema } from './_sync/drizzle/getSchema';
import { calculateChecksum } from './_sync/utils/calculateChecksum';

const DRIZZLE_OUT_PATH = './drizzle/server';

async function _sync_public_new(): Promise<void> {
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

		console.log(`Schema tag "${tag}" published successfully`);
	} catch (error) {
		console.error('Error publishing schema:', error);
		throw error;
	} finally {
		await client.end();
	}
}

_sync_public_new();
