import { client } from '@/lib/db/client';

// Schema version tracking
interface SchemaVersion {
	version: string;
	appliedAt: string;
	checksum: string;
}

interface SchemaResponse {
	version: string;
	checksum: string;
	migrationSql?: string;
	isUpgradeNeeded: boolean;
}

interface SyncResponse {
	data: Record<string, any[]>;
	lastSyncTimestamp: string;
	userId: string;
}

// Security: Validate SQL for migrations (basic checks)
function validateMigrationSql(sql: string): boolean {
	const dangerousPatterns = [
		/drop\s+database/i,
		/truncate\s+table/i,
		/delete\s+from.*without.*where/i,
		/grant\s+/i,
		/revoke\s+/i,
		/create\s+user/i,
		/alter\s+user/i,
		/--.*$/gm, // SQL comments
		/\/\*[\s\S]*?\*\//g, // Block comments
	];

	return !dangerousPatterns.some((pattern) => pattern.test(sql));
}

// Get current schema version from local database
async function getCurrentSchemaVersion(): Promise<SchemaVersion | null> {
	try {
		const result = await client.query(`
			SELECT version, applied_at, checksum
			FROM schema_versions
			ORDER BY applied_at DESC
			LIMIT 1
		`);

		if (result.rows.length === 0) return null;

		const row = result.rows[0] as {
			version: string;
			applied_at: string;
			checksum: string;
		};
		return {
			appliedAt: row.applied_at,
			checksum: row.checksum,
			version: row.version,
		};
	} catch (error) {
		// Table might not exist yet
		return null;
	}
}

// Create schema version tracking table if it doesn't exist
async function initializeSchemaVersioning(): Promise<void> {
	await client.query(`
		CREATE TABLE IF NOT EXISTS schema_versions (
			id SERIAL PRIMARY KEY,
			version VARCHAR(50) NOT NULL,
			checksum VARCHAR(64) NOT NULL,
			applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			migration_sql TEXT
		)
	`);
}

// Record schema version after successful migration
async function recordSchemaVersion(
	version: string,
	checksum: string,
	migrationSql?: string,
): Promise<void> {
	await client.query(
		`
		INSERT INTO schema_versions (version, checksum, migration_sql)
		VALUES ($1, $2, $3)
	`,
		[version, checksum, migrationSql || ''],
	);
}

// Make authenticated API request with error handling
async function makeAuthenticatedRequest<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<T> {
	const response = await fetch(endpoint, {
		...options,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			// Add authentication headers if available
			...options.headers,
		}, // Include cookies for session auth
	});

	if (!response.ok) {
		throw new Error(
			`API request failed: ${response.status} ${response.statusText}`,
		);
	}

	const data = await response.json();

	// Basic response validation
	if (!data || typeof data !== 'object') {
		throw new Error('Invalid API response format');
	}

	return data;
}

// Fetch latest schema version from server
async function fetchLatestSchemaVersion(): Promise<SchemaResponse> {
	try {
		return await makeAuthenticatedRequest<SchemaResponse>('/api/sync/schema');
	} catch (error) {
		console.error('Failed to fetch schema version:', error);
		throw new Error(
			'Unable to check for schema updates. Please check your connection.',
		);
	}
}

// Apply database migration
async function applyMigration(
	migrationSql: string,
	targetVersion: string,
	checksum: string,
): Promise<void> {
	// Security validation
	if (!validateMigrationSql(migrationSql)) {
		throw new Error('Migration contains potentially unsafe SQL operations');
	}

	// Start transaction for atomic migration
	await client.query('BEGIN');

	try {
		// Apply migration SQL
		await client.query(migrationSql);

		// Record successful migration
		await recordSchemaVersion(targetVersion, checksum, migrationSql);

		// Commit transaction
		await client.query('COMMIT');

		console.log(`Successfully migrated to schema version ${targetVersion}`);
	} catch (error) {
		// Rollback on error
		await client.query('ROLLBACK');
		console.error('Migration failed, rolled back:', error);
		throw new Error(
			`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
		);
	}
}

// Sync user data from server
async function syncUserData(): Promise<void> {
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

// Create sync metadata table
async function initializeSyncMetadata(): Promise<void> {
	await client.query(`
		CREATE TABLE IF NOT EXISTS sync_metadata (
			key VARCHAR(50) PRIMARY KEY,
			value TEXT NOT NULL,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`);
}

export async function setupDatabase() {
	await client.waitReady;

	try {
		// Initialize schema versioning
		await initializeSchemaVersioning();
		await initializeSyncMetadata();

		// Check current schema version
		const currentVersion = await getCurrentSchemaVersion();
		console.log('Current schema version:', currentVersion?.version || 'none');

		// Fetch latest schema version from server
		let latestSchema: SchemaResponse;
		try {
			latestSchema = await fetchLatestSchemaVersion();
		} catch (error) {
			console.warn(
				'Could not check for schema updates, continuing with current schema',
			);
			return;
		}

		// Check if upgrade is needed
		const needsUpgrade =
			!currentVersion ||
			currentVersion.version !== latestSchema.version ||
			currentVersion.checksum !== latestSchema.checksum;

		if (needsUpgrade && latestSchema.migrationSql) {
			console.log(
				`Upgrading schema from ${currentVersion?.version || 'none'} to ${latestSchema.version}`,
			);

			// Apply migration
			await applyMigration(
				latestSchema.migrationSql,
				latestSchema.version,
				latestSchema.checksum,
			);
		} else if (needsUpgrade && !latestSchema.migrationSql) {
			console.warn('Schema upgrade needed but no migration SQL provided');
		} else {
			console.log('Schema is up to date');
		}

		// Sync user data after successful schema upgrade
		if (needsUpgrade || shouldSyncData()) {
			await syncUserData();
		}
	} catch (error) {
		console.error('Database setup failed:', error);
		throw error;
	}
}

// Check if data sync is needed (e.g., based on last sync time)
function shouldSyncData(): boolean {
	// Implementation could check last sync timestamp
	// For now, always sync to ensure fresh data
	return true;
}
