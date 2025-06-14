import { redirect, useSearchParams } from 'next/navigation';

export default function LoginPage() {
	const searchParams = useSearchParams();
	const isForceLogin = searchParams.get('force') === 'true';
	if (isForceLogin) {
		// TODO: Clear Cookies / Local Storage
	}

	const user = useUser();

	if (user) redirect('/');
	return <div>Login</div>;
}
