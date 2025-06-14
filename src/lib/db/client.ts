import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';

import * as schema from './schemas/index';

// Create the database connection
export const client = new PGlite('./data/database.db');

// Export the drizzle database instance
export const db = drizzle(client, { schema });
