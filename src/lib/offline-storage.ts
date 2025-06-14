'use client';

import { type DBSchema, type IDBPDatabase, openDB } from 'idb';

// Database schema for offline storage
interface OfflineDBSchema extends DBSchema {
	conversations: {
		key: string;
		value: {
			id: string;
			title: string;
			model: string;
			provider: string;
			createdAt: string;
			updatedAt: string;
			isArchived: boolean;
			isPinned: boolean;
			folderId?: string;
			systemPrompt?: string;
			settings?: Record<string, any>;
			tags?: string[];
			lastSynced?: string;
			pendingSync?: boolean;
		};
		indexes: {
			'by-updated': string;
			'by-pending-sync': boolean;
		};
	};
	messages: {
		key: string;
		value: {
			id: string;
			conversationId: string;
			role: 'user' | 'assistant' | 'system';
			content: string;
			createdAt: string;
			updatedAt: string;
			attachments?: any[];
			metadata?: Record<string, any>;
			parentMessageId?: string;
			lastSynced?: string;
			pendingSync?: boolean;
		};
		indexes: {
			'by-conversation': string;
			'by-created': string;
			'by-pending-sync': boolean;
		};
	};
	pendingRequests: {
		key: string;
		value: {
			id: string;
			url: string;
			method: string;
			headers: Record<string, string>;
			body?: string;
			timestamp: number;
			retryCount: number;
			maxRetries: number;
		};
		indexes: {
			'by-timestamp': number;
		};
	};
	offlineSettings: {
		key: string;
		value: {
			key: string;
			value: any;
			updatedAt: string;
		};
	};
}

class OfflineStorage {
	private db: IDBPDatabase<OfflineDBSchema> | null = null;
	private dbName = 't3-chat-offline';
	private dbVersion = 1;

	async init(): Promise<void> {
		if (typeof window === 'undefined') return;

		try {
			this.db = await openDB<OfflineDBSchema>(this.dbName, this.dbVersion, {
				upgrade(db) {
					// Conversations store
					if (!db.objectStoreNames.contains('conversations')) {
						const conversationStore = db.createObjectStore('conversations', {
							keyPath: 'id',
						});
						conversationStore.createIndex('by-updated', 'updatedAt');
						conversationStore.createIndex('by-pending-sync', 'pendingSync');
					}

					// Messages store
					if (!db.objectStoreNames.contains('messages')) {
						const messageStore = db.createObjectStore('messages', {
							keyPath: 'id',
						});
						messageStore.createIndex('by-conversation', 'conversationId');
						messageStore.createIndex('by-created', 'createdAt');
						messageStore.createIndex('by-pending-sync', 'pendingSync');
					}

					// Pending requests store
					if (!db.objectStoreNames.contains('pendingRequests')) {
						const pendingStore = db.createObjectStore('pendingRequests', {
							keyPath: 'id',
						});
						pendingStore.createIndex('by-timestamp', 'timestamp');
					}

					// Settings store
					if (!db.objectStoreNames.contains('offlineSettings')) {
						db.createObjectStore('offlineSettings', {
							keyPath: 'key',
						});
					}
				},
			});

			console.log('Offline database initialized');
		} catch (error) {
			console.error('Failed to initialize offline database:', error);
		}
	}

	private async ensureDB(): Promise<IDBPDatabase<OfflineDBSchema>> {
		if (!this.db) {
			await this.init();
		}
		if (!this.db) {
			throw new Error('Failed to initialize database');
		}
		return this.db;
	}

	// Conversation methods
	async saveConversation(
		conversation: OfflineDBSchema['conversations']['value'],
	): Promise<void> {
		const db = await this.ensureDB();
		await db.put('conversations', {
			...conversation,
			pendingSync: true,
			updatedAt: new Date().toISOString(),
		});
	}

	async getConversation(
		id: string,
	): Promise<OfflineDBSchema['conversations']['value'] | undefined> {
		const db = await this.ensureDB();
		return await db.get('conversations', id);
	}

	async getAllConversations(): Promise<
		OfflineDBSchema['conversations']['value'][]
	> {
		const db = await this.ensureDB();
		return await db.getAllFromIndex('conversations', 'by-updated');
	}

	async deleteConversation(id: string): Promise<void> {
		const db = await this.ensureDB();
		const tx = db.transaction(['conversations', 'messages'], 'readwrite');

		// Delete conversation
		await tx.objectStore('conversations').delete(id);

		// Delete associated messages
		const messagesIndex = tx.objectStore('messages').index('by-conversation');
		const messages = await messagesIndex.getAllKeys(id);
		for (const messageId of messages) {
			await tx.objectStore('messages').delete(messageId);
		}

		await tx.done;
	}

	// Message methods
	async saveMessage(
		message: OfflineDBSchema['messages']['value'],
	): Promise<void> {
		const db = await this.ensureDB();
		await db.put('messages', {
			...message,
			pendingSync: true,
			updatedAt: new Date().toISOString(),
		});
	}

	async getMessage(
		id: string,
	): Promise<OfflineDBSchema['messages']['value'] | undefined> {
		const db = await this.ensureDB();
		return await db.get('messages', id);
	}

	async getMessagesByConversation(
		conversationId: string,
	): Promise<OfflineDBSchema['messages']['value'][]> {
		const db = await this.ensureDB();
		const messages = await db.getAllFromIndex(
			'messages',
			'by-conversation',
			conversationId,
		);
		return messages.sort(
			(a, b) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		);
	}

	async deleteMessage(id: string): Promise<void> {
		const db = await this.ensureDB();
		await db.delete('messages', id);
	}

	// Pending requests methods
	async addPendingRequest(
		request: Omit<OfflineDBSchema['pendingRequests']['value'], 'id'>,
	): Promise<string> {
		const db = await this.ensureDB();
		const id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		await db.put('pendingRequests', {
			...request,
			id,
		});
		return id;
	}

	async getPendingRequests(): Promise<
		OfflineDBSchema['pendingRequests']['value'][]
	> {
		const db = await this.ensureDB();
		return await db.getAllFromIndex('pendingRequests', 'by-timestamp');
	}

	async removePendingRequest(id: string): Promise<void> {
		const db = await this.ensureDB();
		await db.delete('pendingRequests', id);
	}

	async incrementRetryCount(id: string): Promise<void> {
		const db = await this.ensureDB();
		const request = await db.get('pendingRequests', id);
		if (request) {
			request.retryCount += 1;
			await db.put('pendingRequests', request);
		}
	}

	// Settings methods
	async setSetting(key: string, value: any): Promise<void> {
		const db = await this.ensureDB();
		await db.put('offlineSettings', {
			key,
			updatedAt: new Date().toISOString(),
			value,
		});
	}

	async getSetting(key: string): Promise<any> {
		const db = await this.ensureDB();
		const setting = await db.get('offlineSettings', key);
		return setting?.value;
	}

	// Sync status methods
	async markConversationSynced(id: string): Promise<void> {
		const db = await this.ensureDB();
		const conversation = await db.get('conversations', id);
		if (conversation) {
			conversation.pendingSync = false;
			conversation.lastSynced = new Date().toISOString();
			await db.put('conversations', conversation);
		}
	}

	async markMessageSynced(id: string): Promise<void> {
		const db = await this.ensureDB();
		const message = await db.get('messages', id);
		if (message) {
			message.pendingSync = false;
			message.lastSynced = new Date().toISOString();
			await db.put('messages', message);
		}
	}

	async getPendingSyncItems(): Promise<{
		conversations: OfflineDBSchema['conversations']['value'][];
		messages: OfflineDBSchema['messages']['value'][];
	}> {
		const db = await this.ensureDB();

		const conversations = await db.getAllFromIndex(
			'conversations',
			'by-pending-sync',
			true,
		);
		const messages = await db.getAllFromIndex(
			'messages',
			'by-pending-sync',
			true,
		);

		return { conversations, messages };
	}

	// Utility methods
	async clearAllData(): Promise<void> {
		const db = await this.ensureDB();
		const tx = db.transaction(
			['conversations', 'messages', 'pendingRequests', 'offlineSettings'],
			'readwrite',
		);

		await Promise.all([
			tx.objectStore('conversations').clear(),
			tx.objectStore('messages').clear(),
			tx.objectStore('pendingRequests').clear(),
			tx.objectStore('offlineSettings').clear(),
		]);

		await tx.done;
		console.log('All offline data cleared');
	}

	async getStorageStats(): Promise<{
		conversationCount: number;
		messageCount: number;
		pendingRequestCount: number;
		storageSize?: number;
	}> {
		const db = await this.ensureDB();

		const [conversationCount, messageCount, pendingRequestCount] =
			await Promise.all([
				db.count('conversations'),
				db.count('messages'),
				db.count('pendingRequests'),
			]);

		let storageSize: number | undefined;
		try {
			if ('storage' in navigator && 'estimate' in navigator.storage) {
				const estimate = await navigator.storage.estimate();
				storageSize = estimate.usage;
			}
		} catch (error) {
			console.log('Storage estimate not available:', error);
		}

		return {
			conversationCount,
			messageCount,
			pendingRequestCount,
			storageSize,
		};
	}

	// Export/Import methods for backup
	async exportData(): Promise<{
		conversations: OfflineDBSchema['conversations']['value'][];
		messages: OfflineDBSchema['messages']['value'][];
		settings: OfflineDBSchema['offlineSettings']['value'][];
		exportedAt: string;
	}> {
		const db = await this.ensureDB();

		const [conversations, messages, settings] = await Promise.all([
			db.getAll('conversations'),
			db.getAll('messages'),
			db.getAll('offlineSettings'),
		]);

		return {
			conversations,
			exportedAt: new Date().toISOString(),
			messages,
			settings,
		};
	}

	async importData(data: {
		conversations: OfflineDBSchema['conversations']['value'][];
		messages: OfflineDBSchema['messages']['value'][];
		settings: OfflineDBSchema['offlineSettings']['value'][];
	}): Promise<void> {
		const db = await this.ensureDB();
		const tx = db.transaction(
			['conversations', 'messages', 'offlineSettings'],
			'readwrite',
		);

		// Import conversations
		for (const conversation of data.conversations) {
			await tx.objectStore('conversations').put(conversation);
		}

		// Import messages
		for (const message of data.messages) {
			await tx.objectStore('messages').put(message);
		}

		// Import settings
		for (const setting of data.settings) {
			await tx.objectStore('offlineSettings').put(setting);
		}

		await tx.done;
		console.log('Data imported successfully');
	}
}

// Create singleton instance
export const offlineStorage = new OfflineStorage();

// Initialize offline storage
export async function initOfflineStorage(): Promise<void> {
	if (typeof window !== 'undefined') {
		await offlineStorage.init();
	}
}

export default offlineStorage;
