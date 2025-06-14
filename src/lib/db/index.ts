import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';

import * as schema from './schema';

// Create the database connection
const client = new PGlite('./data/database.db');

// Export the drizzle database instance
export const db = drizzle(client, { schema });

// Export the client for raw SQL queries if needed
export { client };
