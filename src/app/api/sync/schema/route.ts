import { type } from 'arktype';
import { desc, sql } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { schemaVersions } from '@/lib/db/schemas';
import { db } from '@/lib/db/server';

// TODO: Cache Requests for 24hrs, if returns 200 (ISR)
// TODO: Protect Request using Rate Limit to avoid DDoS
// TODO: Improve API Semantics by separating "getSchema" and "generateMigrationSql"

const schema = type(
	{
		from: 'string',
		name: 'string',
		'to?': 'string',
	},
	'|',
	{
		name: 'string',
	},
);

export async function GET(request: NextRequest) {
	// Request Validation
	const { searchParams } = new URL(request.url);
	const name = searchParams.get('name');
	const from = searchParams.get('from');
	const to = searchParams.get('to');
	const data = schema({ from, name, to });
	if ('error' in data) {
		return NextResponse.json({ error: data.error }, { status: 400 });
	}

	// Return Latest Schema
	if (!from || !to) {
		const { sql, version } = await getSchema(null);
		return NextResponse.json({ sql, version });
	}

	// Return Migration SQL
	if (from === to) {
		const error = 'from and to cannot be the same';
		return NextResponse.json({ error }, { status: 400 });
	}
	// TODO: "from" / "to" are invalid
	// TODO: "from" is older than "to"
	const sql = await generateMigrationSql(from, to);
	return NextResponse.json({ fromVersion: from, sql, toVersion: to });
}

async function getSchema(version: string | null) {
	const [result] = await db
		.select()
		.from(schemaVersions)
		.where(version ? sql`${schemaVersions.version} = ${version}` : undefined)
		.orderBy(desc(schemaVersions.createdAt))
		.limit(1);
	if (!result) {
		throw new Error(`Schema version ${version} not found`);
	}
	return result;
}

// TODO: Work on this one
async function generateMigrationSql(
	fromV: string,
	toV?: string,
): Promise<string | null> {
	try {
		// TODO: if toV is not provided, get the latest version
		// Get all versions between fromVersion and toVersion (inclusive of toVersion)
		const versions = await db
			.select({
				createdAt: schemaVersions.createdAt,
				migrationSql: schemaVersions.migrationSql,
				version: schemaVersions.version,
			})
			.from(schemaVersions)
			.orderBy(schemaVersions.createdAt);

		// Find the indices of fromVersion and toVersion
		const fromIndex = versions.findIndex((v) => v.version === fromV);
		const toIndex = versions.findIndex((v) => v.version === toV);

		if (fromIndex === -1) {
			throw new Error(`From version ${fromV} not found`);
		}
		if (toIndex === -1) {
			throw new Error(`To version ${toV} not found`);
		}
		if (fromIndex >= toIndex) {
			throw new Error(
				`From version ${fromV} must be older than to version ${toV}`,
			);
		}

		// Collect migration SQL from fromVersion+1 to toVersion
		const migrationSqls: string[] = [];
		for (let i = fromIndex + 1; i <= toIndex; i++) {
			const migrationSql = versions[i].migrationSql;
			if (migrationSql) {
				migrationSqls.push(
					`-- Migration to ${versions[i].version}\n${migrationSql}`,
				);
			}
		}

		if (migrationSqls.length === 0) {
			return null;
		}

		return migrationSqls.join('\n\n');
	} catch (error) {
		console.error('Error getting migration SQL:', error);
		throw error;
	}
}
