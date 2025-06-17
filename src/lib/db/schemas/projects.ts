import { jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { _SYNC_COLUMNS } from './utils/_sync';

export const projects = pgTable('projects', {
	config: jsonb('config').notNull(),
	description: text('description').notNull(),
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(), // 'active' | 'completed' | 'on-hold'
	..._SYNC_COLUMNS,
});
