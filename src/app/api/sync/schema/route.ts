import { type NextRequest, NextResponse } from 'next/server';

import { client } from '@/lib/db/server';

// TODO: Cache Requests for 1 day, if returns 200

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const fromVersion = searchParams.get('fromVersion');
	const toVersion = searchParams.get('toVersion');

	if (!toVersion) {
		const error = 'Missing toVersion';
		return NextResponse.json({ error }, { status: 400 });
	}
	if (fromVersion === toVersion) {
		const error = 'fromVersion and toVersion cannot be the same';
		return NextResponse.json({ error }, { status: 400 });
	}

	if (fromVersion) {
		const migrationSql = getMigrationSql(fromVersion, toVersion);
		return NextResponse.json({ fromVersion, migrationSql, toVersion });
	}

	const sql = getSchemaSql(toVersion);
	return NextResponse.json({ sql, version: toVersion });
}

async function getSchemaSql(version: string) {
	const { rows } = await client.query(
		`SELECT * FROM schema_versions WHERE version = '${version}'`,
	);
	if (rows.length === 0) {
		throw new Error(`Schema version ${version} not found`);
	}
	if (rows.length > 1) {
		throw new Error(`Multiple schema versions found for ${version}`);
	}
	return rows[0].sql;
}

function getMigrationSql(
	fromVersion: string,
	toVersion: string,
): string | null {
	// TODO: GET ALL VERSIONS BETWEEN FROM AND TO
	// TODO: GET THE SQL FOR EACH VERSION
	// TODO: CALCULATE THE SQL FOR THE MIGRATION
	// TODO: RETURN THE SQL
	return null;
}
