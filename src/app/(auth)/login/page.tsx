'use client';

import { redirect } from 'next/navigation';
import { useState } from 'react';

import Background from '@/components/Background';
import { Button } from '@/components/ui/Button';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { signIn, useSession } from '@/lib/auth/client';
import { tryCatch } from '@/lib/tryCatch';

type SigningInState = {
	error: Error | null;
	provider: string | null;
	isPending: boolean;
};

// TODO: Offline Support, Passkeys, Multiple Sessions, hCAPTCHA, ?force=signout

export default function LoginPage() {
	const { online } = useNetworkStatus();
	const { session } = useSession();
	if (session.data?.user && !session.data?.user.isAnonymous) {
		redirect('/');
	}

	const [signingIn, setSigningIn] = useState<SigningInState>({
		error: null,
		isPending: false,
		provider: null,
	});

	// const onSuccess = useCallback(() => {
	// 	console.log('onSuccess');
	// 	// TODO: Store credentials
	// 	redirect('/');
	// }, []);

	const handleGoogleSignIn = async () => {
		// TODO: Handle offline login
		if (!online) {
			return;
		}

		const provider = 'google';
		setSigningIn({ error: null, isPending: true, provider });
		const { error } = await tryCatch(signIn.social({ provider: 'google' }));
		setSigningIn({ error, isPending: false, provider });
	};

	const handleGuestSignIn = async () => {
		if (session.data?.user.isAnonymous) {
			redirect('/');
		}

		// TODO: Handle offline login
		if (!online) {
			return;
		}

		const provider = 'guest';
		setSigningIn({ error: null, isPending: true, provider });
		const { error } = await tryCatch(signIn.anonymous({}));
		setSigningIn({ error, isPending: false, provider });
	};

	// useEffect(() => {
	// 	if (online) {
	// 		oneTap({ fetchOptions: { onSuccess } });
	// 	}
	// }, [online, onSuccess]);

	return (
		<div className="flex h-screen w-screen items-center justify-center">
			{session.isPending ? (
				<Background>Loading...</Background>
			) : (
				<div className="mx-auto flex w-md flex-col gap-4 rounded-xl border border-border/20 px-6 py-4">
					<div className="mb-6 text-center font-semibold text-xl">Login</div>

					<Button
						className="data-[not-allowed=true]:cursor-not-allowed"
						data-not-allowed={signingIn.isPending || !online}
						disabled={signingIn.provider === 'google' && signingIn.isPending}
						onClick={handleGoogleSignIn}
						variant="shadow"
					>
						{signingIn.provider === 'google' && signingIn.isPending
							? 'Signing in...'
							: 'Sign in with Google'}
					</Button>

					<Button
						className="data-[not-allowed=true]:cursor-not-allowed"
						data-not-allowed={signingIn.isPending || !online}
						disabled={signingIn.provider === 'guest' && signingIn.isPending}
						onClick={handleGuestSignIn}
						variant="shadow"
					>
						{signingIn.provider === 'guest' && signingIn.isPending
							? 'Signing in...'
							: 'Continue as Guest'}
					</Button>
				</div>
			)}
		</div>
	);
}
