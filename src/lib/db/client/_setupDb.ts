import { client } from '@/lib/db/client';
import type { clientSchemaVersions } from '@/lib/db/schemas';

export async function _setupDb({ name }: { name: string }) {
	const _LogsPrefix = `[DB:${name}]`;

	// Check current schema version
	const current = (await client
		.query(
			`SELECT * FROM client_schema_versions ORDER BY "createdAt" DESC LIMIT 1;`,
		)
		.then((res) => res.rows[0])
		.catch((_err) => {
			return null;
		})) as null | typeof clientSchemaVersions.$inferSelect;

	// ! TEMPORARY
	if (current?.version) {
		return;
	}

	// Get Latest Schema
	const url = current
		? `/api/sync/schema/migration?name=${name}&from=${current.version}`
		: `/api/sync/schema?name=${name}`;
	const latest = (await fetch(url)
		.then((res) => res.json())
		.catch((_err) => {
			return null;
		})) as typeof clientSchemaVersions.$inferSelect | null;
	if (!latest) {
		return;
	}

	// If no updates
	if (current?.version === latest.version) {
		return;
	}

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
	if (errors.length > 0) {
		throw new Error('Schema Execution Failed');
	}
}
