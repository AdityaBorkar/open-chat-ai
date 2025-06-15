import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dbCredentials: { url: process.env.SERVER_DB_URL as string },
	dialect: 'postgresql',
	out: './drizzle',
	schema: './src/lib/db/schemas/index.ts',
	strict: true,
	verbose: true,
});

// TODO: Generate local schema (with specific tables)
