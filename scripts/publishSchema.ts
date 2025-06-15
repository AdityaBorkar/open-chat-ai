import { defineConfig } from 'drizzle-kit';

// TODO: Generate local schema (with specific tables) using some kind of markup or comments or notes or metadata. think about it.

// READ JOURNAL
// TODO: GENERATE SCHEMA SQL (NEW)
// TODO: STORE IN DB -> MIGRATION SQL, SNAPSHOT, VERSION

const generateSchemaConfig = defineConfig({
	dbCredentials: { url: process.env.SERVER_DB_URL as string },
	dialect: 'postgresql',
	out: './drizzle',
	schema: './src/lib/db/schemas/index.ts',
	strict: true,
	verbose: true,
});
