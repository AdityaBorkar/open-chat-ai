import { boolean, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const schemaVersions = pgTable('schema_versions', {
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	rolledBack: boolean('rolledBack').notNull().default(false),
	snapshot: jsonb('snapshot').notNull(), // ! THIS TEXT-LIMIT IS NOT ADEQUATE FOR THE SQL
	sql: text('sql').notNull(), // ! THIS TEXT-LIMIT IS NOT ADEQUATE FOR THE SQL
	version: text('version').notNull().primaryKey(),
});
