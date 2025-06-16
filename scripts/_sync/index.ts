// * Commands:
// "_sync check" -> check all files
// "_sync studio" -> Visualize Graph
// "_sync publish --new" -> generate a new migration
// "_sync publish --update" -> update the existing latest migration
// "_sync rollback -v 1.0.0" -> Cancel the version propagation

// * Remember:
// SQL generation is managed by your ORM and ORM Adapter
// Migrations are calculated by the ORM Adapter (try to shift to ORM)
// _sync.worksWithVersion(latest_version) -> This line is important for Skew Protection. Explore this case more meticulously.


interface SchemaVersionData {
	version: string;
	description?: string;
	sql: string;
	migrationSql?: string;
	previousVersion?: string;
}

async function generateSchemaSQL(): Promise<string> {
	try {
		// Use drizzle-kit to generate SQL schema
		execSync(
			'bunx drizzle-kit generate --dialect=postgresql --schema=./src/lib/db/schemas/schema.ts --out=./temp-schema',
			{
				stdio: 'pipe',
			},
		);

		// Read the generated SQL files
		const files = execSync('find ./temp-schema -name "*.sql" | sort', {
			encoding: 'utf8',
		})
			.trim()
			.split('\n');
		let combinedSQL = '';

		for (const file of files) {
			if (file.trim()) {
				const content = readFileSync(file, 'utf8');
				combinedSQL += `-- ${file}\n${content}\n\n`;
			}
		}

		// Clean up temp directory
		execSync('rm -rf ./temp-schema');

		return combinedSQL.trim();
	} catch (error) {
		console.error(
			'Error generating schema SQL with drizzle-kit, falling back to introspection:',
			error,
		);

		// Fallback to introspection method
		const introspectionQuery = `
			SELECT
				'CREATE TABLE ' || schemaname||'.'||tablename || ' (' ||
				array_to_string(
					array_agg(
						column_name || ' ' || data_type ||
						case when character_maximum_length is not null
							then '(' || character_maximum_length || ')'
							else ''
						end ||
						case when is_nullable = 'NO' then ' NOT NULL' else '' end
					), ', '
				) || ');' as ddl
			FROM information_schema.tables t
			JOIN information_schema.columns c ON c.table_name = t.tablename
			WHERE t.schemaname = 'public'
			GROUP BY schemaname, tablename
			ORDER BY tablename;
		`;

		const result = await client.unsafe(introspectionQuery);
		return result.map((row: any) => row.ddl).join('\n\n');
	}
}

async function getCurrentVersion(): Promise<string | null> {
	try {
		const result = await db
			.select({ version: schemaVersions.version })
			.from(schemaVersions)
			.where(sql`${schemaVersions.isActive} = true`)
			.limit(1);

		return result[0]?.version || null;
	} catch (error) {
		console.log('No schema versions table found, starting fresh');
		return null;
	}
}

async function getNextVersion(currentVersion: string | null): Promise<string> {
	if (!currentVersion) return '1.0.0';

	const [major, minor, patch] = currentVersion.split('.').map(Number);
	return `${major}.${minor}.${patch + 1}`;
}


async function generateMigrationSQL(
	fromVersion: string | null,
	toVersion: string,
	currentSQL: string,
): Promise<string | null> {
	if (!fromVersion) return null;

	try {
		const previousSchema = await db
			.select({ sql: schemaVersions.sql })
			.from(schemaVersions)
			.where(sql`${schemaVersions.version} = ${fromVersion}`)
			.limit(1);

		if (!previousSchema[0]) return null;

		// Simple diff logic - in production, use proper schema diffing
		const prevSQL = previousSchema[0].sql;
		if (prevSQL === currentSQL) return null;

		// Generate basic migration SQL (this is simplified)
		return `-- Migration from ${fromVersion} to ${toVersion}\n-- Add new tables/columns\n${currentSQL}`;
	} catch (error) {
		console.error('Error generating migration SQL:', error);
		return null;
	}
}
