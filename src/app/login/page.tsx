'use client';

import { redirect, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { signIn, useSession } from '@/lib/auth/client';

export default function LoginPage() {
	const searchParams = useSearchParams();
	const isForceLogin = searchParams.get('force') === 'true';
	if (isForceLogin) {
		// TODO: Clear Cookies / Local Storage & Force Logout
	}

	const auth = useSession();
	if (auth.data && !auth.data.user.isAnonymous) redirect('/');

	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="mx-auto flex w-md flex-col gap-4 rounded-xl border border-border/20 px-6 py-4 ">
				<div className="mb-6 text-center font-semibold text-xl">Login</div>
				{/* <Button onClick={() => signIn.passkey()}>Sign in with Passkey</Button> */}
				<Button onClick={() => signIn.social({ provider: 'google' })}>
					Sign in with Google
				</Button>
				{/* <Button>Sign in with Apple</Button> */}
				{/* <Button>Sign in with Microsoft</Button> */}
			</div>
		</div>
	);
}
