import { boolean, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { _SYNC_COLUMNS } from './utils/_sync';

export const mcps = pgTable('mcps', {
	config: jsonb('config').notNull(),
	description: text('description').notNull(),
	enabled: boolean('enabled').notNull().default(true),
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	..._SYNC_COLUMNS,
});
