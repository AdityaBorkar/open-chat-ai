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
	tag: text('tag').notNull(),
	version: smallserial('version').primaryKey(),
});

export const clientMetadata = pgTable('client_metadata', {
	key: text('key').notNull().primaryKey(),
	value: text('value').notNull(),
});

export const clientLocalChanges = pgTable('client_local_changes', {
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	data: jsonb('data').notNull(),
	operation: text('operation').notNull(),
	table: text('table').notNull(),
});
