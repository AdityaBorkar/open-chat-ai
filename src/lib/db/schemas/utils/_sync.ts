import { boolean, smallint, text, timestamp } from 'drizzle-orm/pg-core';

import { user } from '../_auth';

export const _SYNC_COLUMNS = {
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	isDeleted: boolean('isDeleted').notNull().default(false),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
	userId: text('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	version: smallint('version').notNull().default(1),
};
