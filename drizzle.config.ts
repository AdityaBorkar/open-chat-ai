import { defineConfig } from 'drizzle-kit';

// Electric-SQL configuration with cloud and local sync support
export default defineConfig({
	// Primary database configuration for Electric-SQL cloud sync
	dbCredentials: {
		url:
			process.env.ELECTRIC_DATABASE_URL ||
			process.env.DATABASE_URL ||
			'postgresql://electric:electric@localhost:5432/electric',
	},
	dialect: 'postgresql',
	out: './drizzle',
	schema: './src/lib/db/schema.ts',
	strict: true,

	// Electric-SQL specific configuration
	verbose: true,

	// Support for multiple environments
	...(process.env.NODE_ENV === 'development' && {
		// Local development with PGlite
		dbCredentials: {
			url: 'file:./data/database.db', // PGlite local storage
		},
		// Enable migrations for local development
		migrations: {
			prefix: 'supabase',
		},
	}),

	// Production Electric Cloud configuration
	...(process.env.NODE_ENV === 'production' && {
		dbCredentials: {
			url: process.env.ELECTRIC_DATABASE_URL!,
		},
		// Electric Cloud specific settings
		tablesFilter: process.env.ELECTRIC_TABLES_FILTER
			? process.env.ELECTRIC_TABLES_FILTER.split(',')
			: undefined,
	}),
});

// Alternative configuration for local-only Electric sync (optional)
export const localConfig = defineConfig({
	dbCredentials: {
		url: 'file:./data/local-electric.db',
	},
	dialect: 'postgresql', // PGlite uses Postgres dialect
	out: './drizzle/local',
	schema: './src/lib/db/schema.ts',
	verbose: true,
});

// Cloud sync configuration (optional)
export const cloudConfig = defineConfig({
	dbCredentials: {
		url: process.env.ELECTRIC_DATABASE_URL!,
	},
	dialect: 'postgresql',
	out: './drizzle/cloud',
	schema: './src/lib/db/schema.ts',
	strict: true,
	tablesFilter: process.env.ELECTRIC_TABLES_FILTER?.split(','),
	verbose: true,
});
