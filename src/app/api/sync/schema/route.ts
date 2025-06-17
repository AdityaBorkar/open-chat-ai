import { type } from 'arktype';
import { desc, sql } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { clientSchemaVersions } from '@/lib/db/schemas';
import { db } from '@/lib/db/server';

// TODO: Cache Requests for 7 days, if returns 200 (ISR)
// TODO: Cache Requests for 24hrs, if returns 404 (ISR)
// TODO: Protect Request using Rate Limit to avoid DDoS

const schema = type({
	name: 'string',
	'version?': 'number',
});

export async function GET(request: NextRequest) {
	// Request Validation
	const { searchParams } = new URL(request.url);
	const name = searchParams.get('name');
	const version = searchParams.get('version');
	const data = schema({ name, version });
	if ('error' in data) {
		return NextResponse.json({ error: data.error }, { status: 400 });
	}

	// Return Schema
	const record = await getSchema(version);
	return NextResponse.json(record);
}

async function getSchema(version: string | null) {
	const [record] = await db
		.select()
		.from(clientSchemaVersions)
		.where(
			version ? sql`${clientSchemaVersions.version} = ${version}` : undefined,
		)
		.orderBy(desc(clientSchemaVersions.createdAt))
		.limit(1);
	if (!record) {
		throw new Error(`Schema version ${version} not found`);
	}
	return record;
}
