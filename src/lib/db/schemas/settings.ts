import { jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { _SYNC_COLUMNS } from './utils/_sync';

export const settingsConfig = pgTable('settingsConfig', {
	config: jsonb('config').notNull(),
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	..._SYNC_COLUMNS,
});
