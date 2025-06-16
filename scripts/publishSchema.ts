import { schemaVersions } from '@/lib/db/schemas';
import { client, db } from '@/lib/db/server';
import { calculateChecksum } from './_sync/calculateChecksum';
import { getSchema } from './_sync/drizzle/getSchema';

async function _sync_public_new(): Promise<void> {
	try {
		// Generate Latest Schema
		const { sql, tag } = await getSchema();
		const checksum = calculateChecksum(sql);

		// Get Active Version
		// const latest = await getCurrentVersion();
		// if (latest.checksum === checksum) {
		// 	throw new Error('Same checksum');
		// }

		const version = tag;

		// Insert new schema version
		await db.insert(schemaVersions).values({
			checksum,
			isActive: true,
			sql,
			version: tag,
		});

		return { checksum, sql };

		console.log(`Schema version ${first_tag} published successfully`);
	} catch (error) {
		console.error('Error publishing schema:', error);
		throw error;
	} finally {
		await client.end();
	}
}

_sync_public_new();
