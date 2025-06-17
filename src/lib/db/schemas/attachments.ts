import { integer, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { _SYNC_COLUMNS } from './utils/_sync';

export const uploadedAttachments = pgTable('uploadedAttachments', {
	fileData: jsonb('fileData'),
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	size: integer('size').notNull(),
	type: text('type').notNull(),
	url: text('url').notNull(),
	..._SYNC_COLUMNS,
});
