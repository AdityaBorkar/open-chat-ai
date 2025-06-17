import { file } from 'bun';

export async function getSchema({
	DRIZZLE_OUT_PATH,
}: {
	DRIZZLE_OUT_PATH: string;
}) {
	// Get Journal
	const journal = await file(`${DRIZZLE_OUT_PATH}/meta/_journal.json`).json();

	// File Validation
	if (journal.version !== '7') {
		throw new Error('Journal version is not supported');
	}
	if (journal.dialect !== 'postgresql') {
		throw new Error('Dialect is not supported');
	}
	// TODO: arktype validate `journal`

	// Get Migrations
	const migrations = journal.entries;
	if (migrations.length === 0) {
		throw new Error('No migrations found');
	}
	if (migrations.length > 1) {
		// ! TEMPORARY WORKAROUND
		throw new Error('Multiple migrations found');
	}

	// Get Latest Migration
	const latest_migration = migrations[migrations.length - 1];
	if (latest_migration.version !== '7') {
		throw new Error('Latest migration version is not supported');
	}
	const { tag } = latest_migration;
	const sql = await file(`${DRIZZLE_OUT_PATH}/${tag}.sql`).text();
	return { sql, tag };
}
