import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { _SYNC_COLUMNS } from './utils/_sync';

export const apiKeys = pgTable('apiKeys', {
	id: uuid('id').primaryKey().defaultRandom(),
	key: text('key').notNull().unique(),
	name: text('name').notNull(),
	provider: text('provider').notNull(),
	status: boolean('status').notNull().default(true),
	..._SYNC_COLUMNS,
});
