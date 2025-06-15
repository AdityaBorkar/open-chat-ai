import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schemas/index';

export const client = new Pool({
	connectionString: process.env.SERVER_DB_URL as string,
});

export const db = drizzle(client, { schema });
