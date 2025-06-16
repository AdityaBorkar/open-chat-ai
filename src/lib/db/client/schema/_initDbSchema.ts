import { client } from '@/lib/db/client';

export async function _initDbSchema() {
	// TODO: GENERATE DURING BUILD
	await client.query(`
        CREATE TABLE IF NOT EXISTS schema_versions (
            id SERIAL PRIMARY KEY,
            version VARCHAR(50) NOT NULL,
            checksum VARCHAR(64) NOT NULL,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            migration_sql TEXT
        )
    `);
	await client.query(`
        CREATE TABLE IF NOT EXISTS sync_metadata (
            key VARCHAR(50) PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
}
