import {
	boolean,
	jsonb,
	pgTable,
	smallserial,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';

import { session, user } from '@/lib/db/schemas/_auth';

export const syncSessions = pgTable('sync_sessions', {
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	schemaVersion: text('schemaVersion')
		.notNull()
		.references(() => schemaVersions.version),
	sessionId: text('sessionId')
		.notNull()
		.references(() => session.id, { onDelete: 'cascade' }),
	userId: text('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
});

// Schema versioning table
export const schemaVersions = pgTable('schema_versions', {
	checksum: text('checksum').notNull(),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	isRolledBack: boolean('isRolledBack').notNull().default(false),
	sql: text('sql').notNull(),
	sql_json: jsonb('sql_json').notNull(),
	version: smallserial('version').primaryKey(),
});

// export const schemaVersions = pgTable('schema_versions', {
// 	createdAt: timestamp('createdAt').notNull().defaultNow(),
// 	rolledBack: boolean('rolledBack').notNull().default(false),
// 	snapshot: jsonb('snapshot').notNull(), // ! THIS TEXT-LIMIT IS NOT ADEQUATE FOR THE SQL
// 	sql: text('sql').notNull(), // ! THIS TEXT-LIMIT IS NOT ADEQUATE FOR THE SQL
// 	version: text('version').notNull().primaryKey(),
// });
