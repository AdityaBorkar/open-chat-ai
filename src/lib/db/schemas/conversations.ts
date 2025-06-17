import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { folders } from './folders';
import { _SYNC_COLUMNS } from './utils/_sync';

export const conversations = pgTable('conversations', {
	folderId: uuid('folderId').references(() => folders.id, {
		onDelete: 'set null',
	}),
	id: uuid('id').primaryKey().defaultRandom(),
	isArchived: boolean('isArchived').notNull().default(false),
	isPinned: boolean('isPinned').notNull().default(false),
	sharedLinkId: uuid('sharedLinkId'),
	tags: text('tags').array(),
	title: text('title').notNull(),
	type: text('type').notNull().default('chat'),
	..._SYNC_COLUMNS,
});
