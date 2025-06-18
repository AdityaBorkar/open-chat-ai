import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dbCredentials: { url: process.env.SERVER_DB_URL as string },
	dialect: 'postgresql',
	// driver: 'pglite',
	migrations: {
		schema: 'public',
		table: 'drizzle_migrations',
	},
	out: './drizzle/server',
	schema: './src/lib/db/schemas/index.ts',
	strict: true,
});

// const local = defineConfig({
// 	// dbCredentials: { url: process.env.SERVER_DB_URL as string },
// 	dialect: 'postgresql',
// 	// migrations: {
// 	// 	schema: 'public',
// 	// 	table: 'drizzle_migrations',
// 	// },
// 	out: './drizzle/local',
// 	schema: './src/lib/db/schemas/index.ts',
// 	strict: true,
// });
