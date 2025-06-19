import process from 'node:process';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { anonymous, oneTap } from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';

import * as schema from '../db/schemas/_auth';
import { db } from '../db/server';

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: 'pg', schema }),
	fetchOptions: {
		// @ts-expect-error `context` is not typed
		async onError(context) {
			const { response } = context;
			if (response.status === 429) {
				const _retryAfter = response.headers.get('X-Retry-After');
			}
		},
	},
	plugins: [
		passkey({
			authenticatorSelection: {
				residentKey: 'preferred',
				userVerification: 'preferred',
			},
			origin: process.env.NEXT_PUBLIC_URL as string,
			rpID: process.env.NEXT_PUBLIC_URL as string,
			rpName: 'Converse AI',
			// advanced
			// schema
		}),
		anonymous({
			emailDomainName: process.env.NEXT_PUBLIC_DOMAIN,
			onLinkAccount: async ({ anonymousUser, newUser }) => {
				console.log('onLinkAccount', anonymousUser, newUser);
				// You can implement custom logic here like transferring cart items, preferences, etc.
			},
		}),
		oneTap(),
	],
	rateLimit: {
		max: 100, // time window in seconds
		// storage: 'secondary-storage',
		window: 60, // max requests in the window
	},
	// TODO: Add Redis
	// secondaryStorage: {
	// 	delete: async (key) => {
	// 		await redis.del(key);
	// 	},
	// 	get: async (key) => {
	// 		const value = await redis.get(key);
	// 		return value ? value : null;
	// 	},
	// 	set: async (key, value, ttl) => {
	// 		if (ttl) await redis.set(key, value, { EX: ttl });
	// 		// or for ioredis:
	// 		// if (ttl) await redis.set(key, value, 'EX', ttl)
	// 		else await redis.set(key, value);
	// 	},
	// },
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 60 * 60, // 1 hour
		},
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
