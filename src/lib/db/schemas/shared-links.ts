import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { conversations } from './conversations';
import { _SYNC_COLUMNS } from './utils/_sync';

export const sharedLinks = pgTable('sharedLinks', {
	conversationId: uuid('conversationId')
		.notNull()
		.references(() => conversations.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expiresAt'),
	id: uuid('id').primaryKey().defaultRandom(),
	isPublic: boolean('isPublic').notNull().default(false),
	password: text('password'),
	slug: text('slug').notNull().unique(),
	..._SYNC_COLUMNS,
});
