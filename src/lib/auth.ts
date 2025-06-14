import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from './db';
import * as schema from './db/schema';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			account: schema.account,
			session: schema.session,
			user: schema.user,
			verification: schema.verification,
		},
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		},
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
	},
	user: {
		additionalFields: {
			bio: {
				required: false,
				type: 'string',
			},
			username: {
				required: false,
				type: 'string',
			},
		},
	},
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
