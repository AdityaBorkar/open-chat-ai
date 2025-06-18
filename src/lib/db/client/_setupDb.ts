import { client } from '@/lib/db/client';
import type { clientSchemaVersions } from '@/lib/db/schemas';

export async function _setupDb({ name }: { name: string }) {
	const LOGS_PREFIX = `[DB:${name}]`;
	console.log(LOGS_PREFIX, 'Setting up DB');

	// Wait for client to be ready
	await client.waitReady;
	console.log(LOGS_PREFIX, 'Ready:', client.ready); // ! BUG: Returns `false`

	// Check current schema version
	const current = (await client
		.query(
			`SELECT * FROM client_schema_versions ORDER BY "createdAt" DESC LIMIT 1;`,
		)
		.then((res) => res.rows[0])
		.catch((err) => {
			console.log(LOGS_PREFIX, 'Error fetching schema:', err.toString());
			return null;
		})) as null | typeof clientSchemaVersions.$inferSelect;
	console.log(LOGS_PREFIX, 'Current Schema Version:', current?.version);

	// ! TEMPORARY
	if (current?.version) return;

	// Get Latest Schema
	const url = current
		? `/api/sync/schema/migration?name=${name}&from=${current.version}`
		: `/api/sync/schema?name=${name}`;
	const latest = (await fetch(url)
		.then((res) => res.json())
		.catch((err) => {
			console.error(LOGS_PREFIX, 'Error fetching schema:', err);
			return null;
		})) as typeof clientSchemaVersions.$inferSelect | null;
	if (!latest) {
		console.log(LOGS_PREFIX, 'No latest schema found', latest);
		return;
	}

	// If no updates
	if (current?.version === latest.version) {
		console.log(LOGS_PREFIX, 'Schema already up to date');
		return;
	}

	// TODO: Ask consent to update the schema
	// TODO: Push all local changes to the server before migration
	// TODO: Write Logic to counter edge cases during migration of data

	// Execute Updates
	console.log(
		LOGS_PREFIX,
		current?.version
			? `Upgrading schema from ${current.version} to ${latest.version}`
			: `Setting up schema ${latest.version}`,
	);

	const commands: (
		| string
		| { query: string; params: (string | number | boolean | null | Date)[] }
	)[] = latest.sql.split('--> statement-breakpoint');
	commands.push({
		params: [
			latest.checksum,
			JSON.stringify(latest.snapshot),
			latest.sql,
			latest.tag,
			latest.version,
			latest.createdAt,
			latest.isRolledBack,
		],
		query:
			'INSERT INTO client_schema_versions (checksum, snapshot, sql, tag, version, "createdAt", "isRolledBack") VALUES ($1, $2, $3, $4, $5, $6, $7);',
	});
	const errors: string[] = [];
	for await (const command of commands) {
		const query = typeof command === 'string' ? command : command.query;
		const params = typeof command === 'string' ? [] : command.params;
		client
			.query(query, params)
			.then()
			.catch((err) => errors.push(err.toString()));
	}
	if (errors.length) {
		console.error(LOGS_PREFIX, 'Schema Execution Failed');
		console.error(LOGS_PREFIX, errors.join('\n'));
		throw new Error('Schema Execution Failed');
	}
	console.log(LOGS_PREFIX, 'Schema Executed Successfully');
}
