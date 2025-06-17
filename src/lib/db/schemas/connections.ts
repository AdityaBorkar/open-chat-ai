import { boolean, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { _SYNC_COLUMNS } from './utils/_sync';

export const connections = pgTable('connections', {
	config: jsonb('config').notNull(),
	enabled: boolean('enabled').notNull().default(true),
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	provider: text('provider').notNull(),
	..._SYNC_COLUMNS,
});
