import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { _SYNC_COLUMNS } from './utils/_sync';

export const folders = pgTable('folders', {
	color: text('color').notNull().default('#6366f1'),
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	..._SYNC_COLUMNS,
});
