import { and, desc, eq } from 'drizzle-orm';

import { db } from './index';
import type {
	NewApiKey,
	NewConnection,
	NewConversation,
	NewFolder,
	NewMcp,
	NewMessage,
	NewModelPreset,
	NewModelsConfig,
	NewPersona,
	NewProject,
	NewPrompt,
	NewSettingsConfig,
	NewSharedLink,
	NewUploadedAttachment,
} from './schema';
import {
	apiKeys,
	connections,
	conversations,
	folders,
	mcps,
	messages,
	modelPresets,
	modelsConfig,
	personas,
	projects,
	prompts,
	settingsConfig,
	sharedLinks,
	uploadedAttachments,
} from './schema';

// Conversation queries
export const conversationQueries = {
	async create(data: NewConversation) {
		return db.insert(conversations).values(data).returning();
	},

	async delete(id: string) {
		return db.delete(conversations).where(eq(conversations.id, id));
	},

	async getById(id: string) {
		return db
			.select()
			.from(conversations)
			.where(eq(conversations.id, id))
			.limit(1);
	},
	async getByUserId(userId: string) {
		return db
			.select()
			.from(conversations)
			.where(eq(conversations.userId, userId))
			.orderBy(desc(conversations.updatedAt));
	},

	async getWithMessages(conversationId: string) {
		const conversation = await db
			.select()
			.from(conversations)
			.where(eq(conversations.id, conversationId))
			.limit(1);

		if (!conversation.length) return null;

		const messageList = await db
			.select()
			.from(messages)
			.where(eq(messages.conversationId, conversationId))
			.orderBy(messages.createdAt);

		return {
			...conversation[0],
			messages: messageList,
		};
	},

	async update(id: string, data: Partial<NewConversation>) {
		return db
			.update(conversations)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(conversations.id, id))
			.returning();
	},
};

// Message queries
export const messageQueries = {
	async create(data: NewMessage) {
		return db.insert(messages).values(data).returning();
	},

	async delete(id: string) {
		return db.delete(messages).where(eq(messages.id, id));
	},
	async getByConversationId(conversationId: string) {
		return db
			.select()
			.from(messages)
			.where(eq(messages.conversationId, conversationId))
			.orderBy(messages.createdAt);
	},

	async update(id: string, data: Partial<NewMessage>) {
		return db
			.update(messages)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(messages.id, id))
			.returning();
	},
};

// Folder queries
export const folderQueries = {
	async create(data: NewFolder) {
		return db.insert(folders).values(data).returning();
	},

	async delete(id: string) {
		return db.delete(folders).where(eq(folders.id, id));
	},
	async getByUserId(userId: string) {
		return db
			.select()
			.from(folders)
			.where(eq(folders.userId, userId))
			.orderBy(desc(folders.createdAt));
	},

	async update(id: string, data: Partial<NewFolder>) {
		return db
			.update(folders)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(folders.id, id))
			.returning();
	},
};

// API Key queries
export const apiKeyQueries = {
	async create(data: NewApiKey) {
		return db.insert(apiKeys).values(data).returning();
	},

	async delete(id: string) {
		return db.delete(apiKeys).where(eq(apiKeys.id, id));
	},

	async getByProvider(userId: string, provider: string) {
		return db
			.select()
			.from(apiKeys)
			.where(and(eq(apiKeys.userId, userId), eq(apiKeys.provider, provider)))
			.limit(1);
	},
	async getByUserId(userId: string) {
		return db
			.select()
			.from(apiKeys)
			.where(eq(apiKeys.userId, userId))
			.orderBy(desc(apiKeys.createdAt));
	},

	async update(id: string, data: Partial<NewApiKey>) {
		return db
			.update(apiKeys)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(apiKeys.id, id))
			.returning();
	},
};

// Project queries
export const projectQueries = {
	async create(data: NewProject) {
		return db.insert(projects).values(data).returning();
	},

	async delete(id: string) {
		return db.delete(projects).where(eq(projects.id, id));
	},
	async getByUserId(userId: string) {
		return db
			.select()
			.from(projects)
			.where(eq(projects.userId, userId))
			.orderBy(desc(projects.updatedAt));
	},

	async update(id: string, data: Partial<NewProject>) {
		return db
			.update(projects)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(projects.id, id))
			.returning();
	},
};

// Prompt queries
export const promptQueries = {
	async create(data: NewPrompt) {
		return db.insert(prompts).values(data).returning();
	},

	async delete(id: string) {
		return db.delete(prompts).where(eq(prompts.id, id));
	},
	async getByUserId(userId: string) {
		return db
			.select()
			.from(prompts)
			.where(eq(prompts.userId, userId))
			.orderBy(desc(prompts.createdAt));
	},

	async getStarred(userId: string) {
		return db
			.select()
			.from(prompts)
			.where(and(eq(prompts.userId, userId), eq(prompts.isStarred, true)))
			.orderBy(desc(prompts.createdAt));
	},

	async toggleStar(id: string) {
		const prompt = await db
			.select()
			.from(prompts)
			.where(eq(prompts.id, id))
			.limit(1);

		if (!prompt.length) return null;

		return db
			.update(prompts)
			.set({
				isStarred: !prompt[0].isStarred,
				updatedAt: new Date(),
			})
			.where(eq(prompts.id, id))
			.returning();
	},

	async update(id: string, data: Partial<NewPrompt>) {
		return db
			.update(prompts)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(prompts.id, id))
			.returning();
	},
};

// Persona queries
export const personaQueries = {
	async create(data: NewPersona) {
		return db.insert(personas).values(data).returning();
	},

	async delete(id: string) {
		return db.delete(personas).where(eq(personas.id, id));
	},

	async getByUserId(userId: string) {
		return db
			.select()
			.from(personas)
			.where(eq(personas.userId, userId))
			.orderBy(desc(personas.updatedAt));
	},

	async getDefault(userId: string) {
		return db
			.select()
			.from(personas)
			.where(and(eq(personas.userId, userId), eq(personas.isDefault, true)))
			.limit(1);
	},

	async setDefault(id: string, userId: string) {
		// First, unset all defaults for the user
		await db
			.update(personas)
			.set({ isDefault: false, updatedAt: new Date() })
			.where(eq(personas.userId, userId));

		// Then set the new default
		return db
			.update(personas)
			.set({ isDefault: true, updatedAt: new Date() })
			.where(eq(personas.id, id))
			.returning();
	},

	async update(id: string, data: Partial<NewPersona>) {
		return db
			.update(personas)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(personas.id, id))
			.returning();
	},
};

// Model Preset queries
export const modelPresetQueries = {
	async create(data: NewModelPreset) {
		return db.insert(modelPresets).values(data).returning();
	},

	async delete(id: string) {
		return db.delete(modelPresets).where(eq(modelPresets.id, id));
	},

	async getByUserId(userId: string) {
		return db
			.select()
			.from(modelPresets)
			.where(eq(modelPresets.userId, userId))
			.orderBy(desc(modelPresets.updatedAt));
	},

	async getDefault(userId: string) {
		return db
			.select()
			.from(modelPresets)
			.where(
				and(eq(modelPresets.userId, userId), eq(modelPresets.isDefault, true)),
			)
			.limit(1);
	},

	async update(id: string, data: Partial<NewModelPreset>) {
		return db
			.update(modelPresets)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(modelPresets.id, id))
			.returning();
	},
};

// Connection queries
export const connectionQueries = {
	async create(data: NewConnection) {
		return db.insert(connections).values(data).returning();
	},

	async delete(id: string) {
		return db.delete(connections).where(eq(connections.id, id));
	},

	async getActive(userId: string) {
		return db
			.select()
			.from(connections)
			.where(
				and(eq(connections.userId, userId), eq(connections.isActive, true)),
			)
			.orderBy(desc(connections.lastUsed));
	},

	async getByUserId(userId: string) {
		return db
			.select()
			.from(connections)
			.where(eq(connections.userId, userId))
			.orderBy(desc(connections.updatedAt));
	},

	async update(id: string, data: Partial<NewConnection>) {
		return db
			.update(connections)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(connections.id, id))
			.returning();
	},

	async updateLastUsed(id: string) {
		return db
			.update(connections)
			.set({ lastUsed: new Date(), updatedAt: new Date() })
			.where(eq(connections.id, id))
			.returning();
	},
};

// MCP queries
export const mcpQueries = {
	async create(data: NewMcp) {
		return db.insert(mcps).values(data).returning();
	},

	async delete(id: string) {
		return db.delete(mcps).where(eq(mcps.id, id));
	},

	async getByUserId(userId: string) {
		return db
			.select()
			.from(mcps)
			.where(eq(mcps.userId, userId))
			.orderBy(desc(mcps.updatedAt));
	},

	async getEnabled(userId: string) {
		return db
			.select()
			.from(mcps)
			.where(and(eq(mcps.userId, userId), eq(mcps.isEnabled, true)))
			.orderBy(desc(mcps.updatedAt));
	},

	async toggleEnabled(id: string) {
		const mcp = await db.select().from(mcps).where(eq(mcps.id, id)).limit(1);
		if (!mcp.length) return null;

		return db
			.update(mcps)
			.set({ isEnabled: !mcp[0].isEnabled, updatedAt: new Date() })
			.where(eq(mcps.id, id))
			.returning();
	},

	async update(id: string, data: Partial<NewMcp>) {
		return db
			.update(mcps)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(mcps.id, id))
			.returning();
	},
};

// Shared Link queries
export const sharedLinkQueries = {
	async create(data: NewSharedLink) {
		return db.insert(sharedLinks).values(data).returning();
	},

	async delete(id: string) {
		return db.delete(sharedLinks).where(eq(sharedLinks.id, id));
	},

	async getBySlug(slug: string) {
		return db
			.select()
			.from(sharedLinks)
			.where(eq(sharedLinks.slug, slug))
			.limit(1);
	},

	async getByUserId(userId: string) {
		return db
			.select()
			.from(sharedLinks)
			.where(eq(sharedLinks.userId, userId))
			.orderBy(desc(sharedLinks.createdAt));
	},

	async incrementViewCount(id: string) {
		const link = await db
			.select()
			.from(sharedLinks)
			.where(eq(sharedLinks.id, id))
			.limit(1);

		if (!link.length) return null;

		return db
			.update(sharedLinks)
			.set({
				updatedAt: new Date(),
				viewCount: (link[0].viewCount || 0) + 1,
			})
			.where(eq(sharedLinks.id, id))
			.returning();
	},

	async update(id: string, data: Partial<NewSharedLink>) {
		return db
			.update(sharedLinks)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(sharedLinks.id, id))
			.returning();
	},
};

// Uploaded Attachment queries
export const uploadedAttachmentQueries = {
	async create(data: NewUploadedAttachment) {
		return db.insert(uploadedAttachments).values(data).returning();
	},

	async delete(id: string) {
		return db.delete(uploadedAttachments).where(eq(uploadedAttachments.id, id));
	},

	async getByType(userId: string, fileType: string) {
		return db
			.select()
			.from(uploadedAttachments)
			.where(
				and(
					eq(uploadedAttachments.userId, userId),
					eq(uploadedAttachments.fileType, fileType),
				),
			)
			.orderBy(desc(uploadedAttachments.uploadedAt));
	},

	async getByUserId(userId: string) {
		return db
			.select()
			.from(uploadedAttachments)
			.where(eq(uploadedAttachments.userId, userId))
			.orderBy(desc(uploadedAttachments.uploadedAt));
	},

	async update(id: string, data: Partial<NewUploadedAttachment>) {
		return db
			.update(uploadedAttachments)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(uploadedAttachments.id, id))
			.returning();
	},
};

// Settings Config queries
export const settingsConfigQueries = {
	async create(data: NewSettingsConfig) {
		return db.insert(settingsConfig).values(data).returning();
	},

	async getByUserId(userId: string) {
		return db
			.select()
			.from(settingsConfig)
			.where(eq(settingsConfig.userId, userId))
			.limit(1);
	},

	async upsert(userId: string, settings: Record<string, any>) {
		const existing = await db
			.select()
			.from(settingsConfig)
			.where(eq(settingsConfig.userId, userId))
			.limit(1);

		if (existing.length) {
			return db
				.update(settingsConfig)
				.set({ settings, updatedAt: new Date() })
				.where(eq(settingsConfig.userId, userId))
				.returning();
		} else {
			return db.insert(settingsConfig).values({ settings, userId }).returning();
		}
	},
};

// Models Config queries
export const modelsConfigQueries = {
	async create(data: NewModelsConfig) {
		return db.insert(modelsConfig).values(data).returning();
	},

	async delete(id: string) {
		return db.delete(modelsConfig).where(eq(modelsConfig.id, id));
	},

	async getByProvider(userId: string, provider: string) {
		return db
			.select()
			.from(modelsConfig)
			.where(
				and(
					eq(modelsConfig.userId, userId),
					eq(modelsConfig.provider, provider),
				),
			)
			.orderBy(desc(modelsConfig.updatedAt));
	},

	async getByUserId(userId: string) {
		return db
			.select()
			.from(modelsConfig)
			.where(eq(modelsConfig.userId, userId))
			.orderBy(desc(modelsConfig.updatedAt));
	},

	async getEnabled(userId: string) {
		return db
			.select()
			.from(modelsConfig)
			.where(
				and(eq(modelsConfig.userId, userId), eq(modelsConfig.isEnabled, true)),
			)
			.orderBy(desc(modelsConfig.updatedAt));
	},

	async toggleEnabled(id: string) {
		const config = await db
			.select()
			.from(modelsConfig)
			.where(eq(modelsConfig.id, id))
			.limit(1);

		if (!config.length) return null;

		return db
			.update(modelsConfig)
			.set({ isEnabled: !config[0].isEnabled, updatedAt: new Date() })
			.where(eq(modelsConfig.id, id))
			.returning();
	},

	async update(id: string, data: Partial<NewModelsConfig>) {
		return db
			.update(modelsConfig)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(modelsConfig.id, id))
			.returning();
	},
};
