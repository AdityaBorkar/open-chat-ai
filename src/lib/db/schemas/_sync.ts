import {
	boolean,
	jsonb,
	pgTable,
	smallserial,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';

export const clientSchemaVersions = pgTable('client_schema_versions', {
	checksum: text('checksum').notNull(),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	isRolledBack: boolean('isRolledBack').notNull().default(false),
	snapshot: jsonb('snapshot').notNull(), // ! THIS TEXT-LIMIT IS NOT ADEQUATE FOR THE SQL
	sql: text('sql').notNull(), // ! THIS TEXT-LIMIT IS NOT ADEQUATE FOR THE SQL
	version: smallserial('version').primaryKey(),
});

export const clientMetadata = pgTable('client_metadata', {
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	lastSyncedAt: timestamp('lastSyncedAt'),
	lastSyncedChecksum: text('lastSyncedChecksum'),
	lastSyncedVersion: smallserial('lastSyncedVersion'),
	serverVersion: text('serverVersion'),
});
