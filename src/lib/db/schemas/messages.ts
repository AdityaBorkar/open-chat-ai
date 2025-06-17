import { jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { conversations } from './conversations';
import { _SYNC_COLUMNS } from './utils/_sync';

export const messages = pgTable('messages', {
	attachments: jsonb('attachments'),
	content: text('content').notNull(),
	conversationId: uuid('conversationId')
		.notNull()
		.references(() => conversations.id, { onDelete: 'cascade' }), // 'user' | 'assistant' | 'system' | 'tool'
	id: uuid('id').primaryKey().defaultRandom(), // files, images, etc.
	metadata: jsonb('metadata'), // token count, model info, etc.
	parentMessageId: uuid('parentMessageId'),
	role: text('role').notNull(),
	..._SYNC_COLUMNS,
});
