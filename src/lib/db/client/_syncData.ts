interface SyncResponse {
	data: Record<string, any[]>;
	lastSyncTimestamp: string;
	userId: string;
}

// Sync user data from server
export async function _syncData({ userId }: { userId: string }): Promise<void> {
	try {
		const syncData =
			await makeAuthenticatedRequest<SyncResponse>('/api/sync/data');

		// Start transaction for atomic data sync
		await client.query('BEGIN');

		try {
			// Clear existing user data (or implement incremental sync)
			await client.query('DELETE FROM conversations WHERE user_id = $1', [
				syncData.userId,
			]);
			await client.query(
				'DELETE FROM messages WHERE conversation_id IN (SELECT id FROM conversations WHERE user_id = $1)',
				[syncData.userId],
			);
			await client.query('DELETE FROM folders WHERE user_id = $1', [
				syncData.userId,
			]);

			// Insert synced data
			for (const [table, records] of Object.entries(syncData.data)) {
				if (records.length > 0) {
					const columns = Object.keys(records[0]);
					const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
					const columnNames = columns.join(', ');

					for (const record of records) {
						const values = columns.map((col) => record[col]);
						await client.query(
							`INSERT INTO ${table} (${columnNames}) VALUES (${placeholders})`,
							values,
						);
					}
				}
			}

			// Store sync timestamp
			await client.query(
				`
				INSERT INTO sync_metadata (key, value, updated_at)
				VALUES ('last_sync', $1, CURRENT_TIMESTAMP)
				ON CONFLICT (key)
				DO UPDATE SET value = $1, updated_at = CURRENT_TIMESTAMP
			`,
				[syncData.lastSyncTimestamp],
			);

			await client.query('COMMIT');
			console.log('User data synchronized successfully');
		} catch (error) {
			await client.query('ROLLBACK');
			console.error('Data sync failed, rolled back:', error);
			throw new Error(
				`Data synchronization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
			);
		}
	} catch (error) {
		console.error('Failed to sync user data:', error);
		throw new Error('Unable to sync user data. Please check your connection.');
	}
}
