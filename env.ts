import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	client: {
		// NEXT_PUBLIC_BETTER_AUTH_URL: z.string().min(1), // Commented out for build
	},
	emptyStringAsUndefined: true,
	// runtimeEnv: process.env,
	experimental__runtimeEnv: process.env,
	server: {
		DATABASE_URL: z.string().url(),
		OPEN_AI_API_KEY: z.string().min(1),
	},
});
