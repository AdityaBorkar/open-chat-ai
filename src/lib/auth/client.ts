'use client';

import {
	anonymousClient,
	oneTapClient,
	passkeyClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL as string,
	plugins: [
		passkeyClient(),
		anonymousClient(),
		oneTapClient({
			autoSelect: false,
			cancelOnTapOutside: true,
			clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
			context: 'signin',
			promptOptions: {
				baseDelay: 1000,
				maxAttempts: 5,
			},
		}),
	],
});

export const {
	signIn,
	signOut,
	signUp,
	useSession,
	// getSession,
	// passkey,
	// oneTap,
} = authClient;

// interface AuthContextType {
// 	user: User | null;
// 	session: Session | null;
// 	isLoading: boolean;
// 	signIn: (email: string, password: string) => Promise<void>;
// 	signUp: (email: string, password: string, name: string) => Promise<void>;
// 	signOut: () => Promise<void>;
// 	signInWithGoogle: () => Promise<void>;
// 	signInWithGithub: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
// 	const [user, setUser] = useState<User | null>(null);
// 	const [session, setSession] = useState<Session | null>(null);
// 	const [isLoading, setIsLoading] = useState(true);

// 	useEffect(() => {
// 		const checkSession = async () => {
// 			try {
// 				const { data } = await authClient.getSession();
// 				if (data?.session && data?.user) {
// 					setSession(data.session);
// 					setUser(data.user);
// 				}
// 			} catch (error) {
// 				console.error('Session check failed:', error);
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		};

// 		checkSession();
// 	}, []);

// 	const signIn = async (email: string, password: string) => {
// 		const { data, error } = await authClient.signIn.email({
// 			email,
// 			password,
// 		});

// 		if (error) {
// 			throw new Error(error.message);
// 		}

// 		if (data?.session && data?.user) {
// 			setSession(data.session);
// 			setUser(data.user);
// 		}
// 	};

// 	const signUp = async (email: string, password: string, name: string) => {
// 		const { data, error } = await authClient.signUp.email({
// 			email,
// 			name,
// 			password,
// 		});

// 		if (error) {
// 			throw new Error(error.message);
// 		}

// 		if (data?.session && data?.user) {
// 			setSession(data.session);
// 			setUser(data.user);
// 		}
// 	};

// 	const signOut = async () => {
// 		await authClient.signOut();
// 		setSession(null);
// 		setUser(null);
// 	};

// 	const signInWithGoogle = async () => {
// 		await authClient.signIn.social({
// 			provider: 'google',
// 		});
// 	};

// 	const signInWithGithub = async () => {
// 		await authClient.signIn.social({
// 			provider: 'github',
// 		});
// 	};

// 	return (
// 		<AuthContext.Provider
// 			value={{
// 				isLoading,
// 				session,
// 				signIn,
// 				signInWithGithub,
// 				signInWithGoogle,
// 				signOut,
// 				signUp,
// 				user,
// 			}}
// 		>
// 			{children}
// 		</AuthContext.Provider>
// 	);
// }

// export function useAuth() {
// 	const context = useContext(AuthContext);
// 	if (!context) {
// 		throw new Error('useAuth must be used within an AuthProvider');
// 	}
// 	return context;
// }
