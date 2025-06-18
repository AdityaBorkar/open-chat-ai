// async function _applyMigration(
// 	migrationSql: string,
// 	targetVersion: string,
// 	checksum: string,
// ): Promise<void> {
// 	// Security validation
// 	if (!validateMigrationSql(migrationSql)) {
// 		throw new Error('Migration contains potentially unsafe SQL operations');
// 	}

// 	// Start transaction for atomic migration
// 	await client.query('BEGIN');

// 	try {
// 		// Apply migration SQL
// 		await client.query(migrationSql);

// 		// Record successful migration
// 		await recordSchemaVersion(targetVersion, checksum, migrationSql);

// 		// Commit transaction
// 		await client.query('COMMIT');

// 		console.log(`Successfully migrated to schema version ${targetVersion}`);
// 	} catch (error) {
// 		// Rollback on error
// 		await client.query('ROLLBACK');
// 		console.error('Migration failed, rolled back:', error);
// 		throw new Error(
// 			`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
// 		);
// 	}
// }

// // Security: Validate SQL for migrations (basic checks)
// function validateMigrationSql(sql: string): boolean {
// 	const dangerousPatterns = [
// 		/drop\s+database/i,
// 		/truncate\s+table/i,
// 		/delete\s+from.*without.*where/i,
// 		/grant\s+/i,
// 		/revoke\s+/i,
// 		/create\s+user/i,
// 		/alter\s+user/i,
// 		/--.*$/gm, // SQL comments
// 		/\/\*[\s\S]*?\*\//g, // Block comments
// 	];

// 	return !dangerousPatterns.some((pattern) => pattern.test(sql));
// }

// // Record schema version after successful migration
// async function recordSchemaVersion(
// 	version: string,
// 	checksum: string,
// 	migrationSql?: string,
// ): Promise<void> {
// 	await client.query(
// 		`
// 		INSERT INTO schema_versions (version, checksum, migration_sql)
// 		VALUES ($1, $2, $3)
// 	`,
// 		[version, checksum, migrationSql || ''],
// 	);
// }
