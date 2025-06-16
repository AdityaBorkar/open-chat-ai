import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { anonymous, oneTap } from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';

import * as schema from '../db/schemas/_auth';
import { db } from '../db/server';

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: 'pg', schema }),
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
				// Handle anonymous user data transfer when linking to a real account
				console.log('Linking anonymous user to real account:', {
					anonymousUser,
					newUser,
				});
				// You can implement custom logic here like transferring cart items, preferences, etc.
			},
		}),
		oneTap(),
	],
	session: {
		// cookieCache: {
		// 	enabled: true,
		// 	maxAge: 60 * 60, // 1 hour
		// },
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	// user: {
	// 	additionalFields: {
	// 		bio: {
	// 			required: false,
	// 			type: 'string',
	// 		},
	// 		username: {
	// 			required: false,
	// 			type: 'string',
	// 		},
	// 	},
	// },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
