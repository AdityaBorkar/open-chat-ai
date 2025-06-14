import {
	boolean,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core';

// Better-auth required tables
export const user = pgTable('user', {
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('emailVerified').notNull().default(false),
	id: uuid('id').primaryKey().defaultRandom(),
	image: text('image'),
	name: text('name').notNull(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const session = pgTable('session', {
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	expiresAt: timestamp('expiresAt').notNull(),
	id: text('id').primaryKey(),
	ipAddress: text('ipAddress'),
	token: text('token').notNull().unique(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
	userAgent: text('userAgent'),
	userId: uuid('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
	accessToken: text('accessToken'),
	accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
	accountId: text('accountId').notNull(),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	id: uuid('id').primaryKey().defaultRandom(),
	idToken: text('idToken'),
	password: text('password'),
	providerId: text('providerId').notNull(),
	refreshToken: text('refreshToken'),
	refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
	scope: text('scope'),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
	userId: uuid('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
});

export const verification = pgTable('verification', {
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	expiresAt: timestamp('expiresAt').notNull(),
	id: uuid('id').primaryKey().defaultRandom(),
	identifier: text('identifier').notNull(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
	value: text('value').notNull(),
});

// Chat application tables
export const folders = pgTable('folders', {
	color: text('color').notNull().default('#6366f1'),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
	userId: uuid('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
});

export const conversations = pgTable('conversations', {
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	folderId: uuid('folderId').references(() => folders.id, {
		onDelete: 'set null',
	}), // 'chat' | 'create' | 'talk' | 'live' | 'assist'
	id: uuid('id').primaryKey().defaultRandom(),
	isArchived: boolean('isArchived').notNull().default(false),
	isPinned: boolean('isPinned').notNull().default(false),
	model: text('model').notNull().default('gpt-4'),
	provider: text('provider').notNull().default('openai'),
	settings: jsonb('settings'),
	systemPrompt: text('systemPrompt'),
	tags: text('tags').array(),
	title: text('title').notNull(), // model settings like temperature, etc.
	type: text('type').notNull().default('chat'),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
	userId: uuid('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
});

export const messages = pgTable('messages', {
	attachments: jsonb('attachments'),
	content: text('content').notNull(),
	conversationId: uuid('conversationId')
		.notNull()
		.references(() => conversations.id, { onDelete: 'cascade' }), // 'user' | 'assistant' | 'system' | 'tool'
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	id: uuid('id').primaryKey().defaultRandom(), // files, images, etc.
	metadata: jsonb('metadata'), // token count, model info, etc.
	parentMessageId: uuid('parentMessageId'),
	role: text('role').notNull(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const apiKeys = pgTable('apiKeys', {
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	id: uuid('id').primaryKey().defaultRandom(),
	isActive: boolean('isActive').notNull().default(true), // 'openai', 'anthropic', 'google', etc.
	keyHash: text('keyHash').notNull(), // encrypted API key
	lastUsed: timestamp('lastUsed'), // user-friendly name
	name: text('name'),
	provider: text('provider').notNull(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
	userId: uuid('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
});

export const projects = pgTable('projects', {
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	description: text('description'),
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(), // 'active' | 'completed' | 'on-hold'
	settings: jsonb('settings'),
	status: text('status').notNull().default('active'),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
	userId: uuid('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
});

export const prompts = pgTable('prompts', {
	category: text('category').notNull().default('general'),
	content: text('content').notNull(),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	description: text('description'),
	id: uuid('id').primaryKey().defaultRandom(),
	isPublic: boolean('isPublic').notNull().default(false),
	isStarred: boolean('isStarred').notNull().default(false),
	tags: text('tags').array(),
	title: text('title').notNull(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
	usageCount: integer('usageCount').notNull().default(0),
	userId: uuid('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
});

// New schemas
export const personas = pgTable('personas', {
	avatar: text('avatar'),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	description: text('description'),
	id: uuid('id').primaryKey().defaultRandom(),
	instructions: text('instructions').notNull(),
	isDefault: boolean('isDefault').notNull().default(false),
	name: text('name').notNull(),
	tags: text('tags').array(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
	userId: uuid('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
});

export const modelPresets = pgTable('modelPresets', {
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	description: text('description'),
	id: uuid('id').primaryKey().defaultRandom(),
	isDefault: boolean('isDefault').notNull().default(false),
	model: text('model').notNull(),
	name: text('name').notNull(),
	provider: text('provider').notNull(),
	settings: jsonb('settings').notNull(), // temperature, maxTokens, etc.
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
	userId: uuid('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
});

export const connections = pgTable('connections', {
	config: jsonb('config').notNull(),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	description: text('description'),
	id: uuid('id').primaryKey().defaultRandom(),
	isActive: boolean('isActive').notNull().default(true),
	lastUsed: timestamp('lastUsed'),
	name: text('name').notNull(),
	type: text('type').notNull(), // 'database', 'api', 'service', etc.
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
	userId: uuid('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
});

export const mcps = pgTable('mcps', {
	config: jsonb('config').notNull(),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	description: text('description'),
	id: uuid('id').primaryKey().defaultRandom(),
	isEnabled: boolean('isEnabled').notNull().default(true),
	name: text('name').notNull(),
	type: text('type').notNull(), // 'filesystem', 'database', 'api', etc.
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
	userId: uuid('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	version: text('version'),
});

export const sharedLinks = pgTable('sharedLinks', {
	conversationId: uuid('conversationId')
		.notNull()
		.references(() => conversations.id, { onDelete: 'cascade' }),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	expiresAt: timestamp('expiresAt'),
	id: uuid('id').primaryKey().defaultRandom(),
	isPublic: boolean('isPublic').notNull().default(false),
	maxViews: integer('maxViews'),
	password: text('password'), // hashed password for protected links
	slug: text('slug').notNull().unique(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
	userId: uuid('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	viewCount: integer('viewCount').notNull().default(0),
});

export const uploadedAttachments = pgTable('uploadedAttachments', {
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	fileName: text('fileName').notNull(),
	fileSize: integer('fileSize').notNull(),
	fileType: text('fileType').notNull(),
	id: uuid('id').primaryKey().defaultRandom(),
	metadata: jsonb('metadata'), // dimensions, duration, etc.
	path: text('path').notNull(), // storage path
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
	uploadedAt: timestamp('uploadedAt').notNull().defaultNow(),
	userId: uuid('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
});

export const settingsConfig = pgTable('settingsConfig', {
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	id: uuid('id').primaryKey().defaultRandom(),
	settings: jsonb('settings').notNull(), // all user settings as JSON
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
	userId: uuid('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
		.unique(), // one settings record per user
});

export const modelsConfig = pgTable('modelsConfig', {
	config: jsonb('config').notNull(), // model-specific configuration
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	id: uuid('id').primaryKey().defaultRandom(),
	isEnabled: boolean('isEnabled').notNull().default(true),
	model: text('model').notNull(),
	provider: text('provider').notNull(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
	userId: uuid('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
});

// Type exports for TypeScript
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;
export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;
export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;
export type Folder = typeof folders.$inferSelect;
export type NewFolder = typeof folders.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Prompt = typeof prompts.$inferSelect;
export type NewPrompt = typeof prompts.$inferInsert;
export type Persona = typeof personas.$inferSelect;
export type NewPersona = typeof personas.$inferInsert;
export type ModelPreset = typeof modelPresets.$inferSelect;
export type NewModelPreset = typeof modelPresets.$inferInsert;
export type Connection = typeof connections.$inferSelect;
export type NewConnection = typeof connections.$inferInsert;
export type Mcp = typeof mcps.$inferSelect;
export type NewMcp = typeof mcps.$inferInsert;
export type SharedLink = typeof sharedLinks.$inferSelect;
export type NewSharedLink = typeof sharedLinks.$inferInsert;
export type UploadedAttachment = typeof uploadedAttachments.$inferSelect;
export type NewUploadedAttachment = typeof uploadedAttachments.$inferInsert;
export type SettingsConfig = typeof settingsConfig.$inferSelect;
export type NewSettingsConfig = typeof settingsConfig.$inferInsert;
export type ModelsConfig = typeof modelsConfig.$inferSelect;
export type NewModelsConfig = typeof modelsConfig.$inferInsert;
