import { boolean, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { _SYNC_COLUMNS } from './utils/_sync';

export const prompts = pgTable('prompts', {
	category: text('category').notNull().default('general'),
	content: text('content').notNull(),
	description: text('description'),
	id: uuid('id').primaryKey().defaultRandom(),
	isPublic: boolean('isPublic').notNull().default(false),
	name: text('name').notNull(),
	rank: integer('rank').notNull().default(0),
	..._SYNC_COLUMNS,
});
