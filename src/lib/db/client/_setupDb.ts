import type { Results } from '@electric-sql/pglite';

import { client } from '@/lib/db/client';
import { _initDbSchema } from './schema/_initDbSchema';

export async function _setupDb({ name }: { name: string }) {
	try {
		const LOGS_PREFIX = `[DB:${name}]`;
		await client.waitReady;
		console.log(LOGS_PREFIX, 'Ready:', client.ready);
		await _initDbSchema();

		// Check current schema version
		const {
			rows: [current],
		} = (await client.query(`
			SELECT version, applied_at, checksum
			FROM schema_versions
			ORDER BY applied_at DESC
			LIMIT 1
		`)) as Results<{
			version: string;
			applied_at: string;
			checksum: string;
		}>;
		console.log(
			LOGS_PREFIX,
			'Current Schema:',
			JSON.stringify(current, null, 2),
		);

		// Get Latest Schema
		const url = `/api/sync/schema?name=${name}${current ? `&from=${current.version}` : ''}`;
		const latest = await fetch(url)
			.then((res) => res.json())
			.catch((err) => {
				console.error(LOGS_PREFIX, 'Error fetching schema:', err);
				return null;
			});
		console.log(LOGS_PREFIX, 'Latest Schema:', JSON.stringify(latest, null, 2));
		if (!latest) return;

		// Initialize Schema (first time)
		if (latest.sql && latest.version) {
			console.log(LOGS_PREFIX, `Setting up schema ${latest.version}`);
			// TODO: Apply Migration
		}

		// Upgrade Schema (if needed)
		if (latest.sql && latest.fromVersion && latest.toVersion) {
			console.log(
				LOGS_PREFIX,
				`Upgrading schema from ${latest.fromVersion} to ${latest.toVersion}`,
			);
			// TODO: Apply Migration
			// 	await applyMigration(
			// 		latestSchema.migrationSql,
			// 		latestSchema.version,
			// 		latestSchema.checksum,
			// 	);
		}
	} catch (error) {
		console.error('Database setup failed:', error);
		throw error;
	}
}
