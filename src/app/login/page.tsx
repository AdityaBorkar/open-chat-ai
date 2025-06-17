'use client';

import { redirect, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { Link } from '@/components/ui/Link';
import { oneTap, signIn, useSession } from '@/lib/auth/client';

export default function LoginPage() {
	const searchParams = useSearchParams();
	const isForceLogin = searchParams.get('force') === 'true';
	if (isForceLogin) {
		// TODO: Clear Cookies / Local Storage & Force Logout
	}

	const { data } = useSession();
	if (data && !data.user.isAnonymous) redirect('/');

	useEffect(() => {
		if (!data) autoAuth();
		async function autoAuth() {
			// Check if conditional UI is supported
			// if (
			// 	window.PublicKeyCredential?.isConditionalMediationAvailable &&
			// 	(await window.PublicKeyCredential.isConditionalMediationAvailable())
			// ) {
			// 	await signIn.passkey({ autoFill: true });
			// }

			await oneTap({
				onPromptNotification(notification) {
					console.log('One Tap prompt notification:', notification);
				},
			});
		}
	}, [data]);

	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="mx-auto flex w-md flex-col gap-4 rounded-xl border border-border/20 px-6 py-4 ">
				<div className="mb-6 text-center font-semibold text-xl">Login</div>
				{/* <Button onClick={() => signIn.passkey()}>Sign in with Passkey</Button> */}
				<Button
					onClick={() =>
						// TODO: Catch and show errors
						signIn.social({
							callbackURL: '/',
							provider: 'google',
						})
					}
				>
					Sign in with Google
				</Button>
				{/* <Button>Sign in with Apple</Button> */}
				{/* <Button>Sign in with Microsoft</Button> */}
				<Link href="/">Continue as Guest</Link>
			</div>
		</div>
	);
}
