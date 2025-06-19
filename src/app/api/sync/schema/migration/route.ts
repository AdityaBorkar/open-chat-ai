import { ArkErrors, type } from 'arktype';
import { type NextRequest, NextResponse } from 'next/server';

// TODO: Cache Requests for 7 days, if returns 200 (ISR)
// TODO: Cache Requests for 24hrs, if returns 404 (ISR)
// TODO: Protect Request using Rate Limit to avoid DDoS

// ! WORK ON THIS ENTIRE API ENDPOINT

const schema = type({
	from: 'number',
	name: 'string',
	to: 'number | null',
});

export async function GET(request: NextRequest) {
	// Request Validation
	const { searchParams } = new URL(request.url);
	const data = schema({
		from: searchParams.get('from')
			? Number.parseInt(searchParams.get('from') ?? '0')
			: null, // TODO: ARKTYPE SUPPORT
		name: searchParams.get('name'),
		to: searchParams.get('to')
			? Number.parseInt(searchParams.get('to') ?? '0')
			: null, // TODO: ARKTYPE SUPPORT
	});
	if (data instanceof ArkErrors) {
		return NextResponse.json({ error: data }, { status: 400 });
	}
	const { from, to } = data;
	if (from === to) {
		const error = 'from and to cannot be the same';
		return NextResponse.json({ error }, { status: 400 });
	}
	if (to && from > to) {
		const error = 'from must be older than to';
		return NextResponse.json({ error }, { status: 400 });
	}

	// TODO: "from" / "to" are invalid
	// TODO: "from" is older than "to"
	const record = { version: from };
	return NextResponse.json(record);
	// const { record, sql } = await generateMigrationSql(from, to);
	// return NextResponse.json({ fromVersion: from, record, sql, toVersion: to });
}

// async function generateMigrationSql(
// 	fromV: string,
// 	toV?: string,
// ): Promise<string | null> {
// 	try {
// 		// TODO: if toV is not provided, get the latest version
// 		// Get all versions between fromVersion and toVersion (inclusive of toVersion)
// 		const versions = await db
// 			.select({
// 				createdAt: clientSchemaVersions.createdAt,
// 				migrationSql: clientSchemaVersions.sql,
// 				version: clientSchemaVersions.version,
// 			})
// 			.from(clientSchemaVersions)
// 			.orderBy(clientSchemaVersions.createdAt);

// 		// Find the indices of fromVersion and toVersion
// 		const fromIndex = versions.findIndex((v) => v.version === fromV);
// 		const toIndex = versions.findIndex((v) => v.version === toV);

// 		if (fromIndex === -1) {
// 			throw new Error(`From version ${fromV} not found`);
// 		}
// 		if (toIndex === -1) {
// 			throw new Error(`To version ${toV} not found`);
// 		}
// 		if (fromIndex >= toIndex) {
// 			throw new Error(
// 				`From version ${fromV} must be older than to version ${toV}`,
// 			);
// 		}

// 		// Collect migration SQL from fromVersion+1 to toVersion
// 		const migrationSqls: string[] = [];
// 		for (let i = fromIndex + 1; i <= toIndex; i++) {
// 			const migrationSql = versions[i].migrationSql;
// 			if (migrationSql) {
// 				migrationSqls.push(
// 					`-- Migration to ${versions[i].version}\n${migrationSql}`,
// 				);
// 			}
// 		}

// 		if (migrationSqls.length === 0) {
// 			return null;
// 		}

// 		return migrationSqls.join('\n\n');
// 	} catch (error) {
// 		console.error('Error getting migration SQL:', error);
// 		throw error;
// 	}
// }
