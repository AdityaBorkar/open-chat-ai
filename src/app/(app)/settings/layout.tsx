'use client';

import { useRouter } from 'next/navigation';
import { useHotkeys } from 'react-hotkeys-hook';
import { TbArrowLeft } from 'react-icons/tb';

import { Navigation } from '@/components/pages/settings/Navigation';
import { Sidebar } from '@/components/pages/settings/Sidebar';
import { Button } from '@/components/ui/Button';
import { Link } from '@/components/ui/Link';

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	useHotkeys('esc', () => router.push('/chat'));

	return (
		<div className="mx-auto max-w-[72rem]">
			<div className="mt-2 mb-4 flex flex-row items-center justify-between gap-4 px-6 py-4">
				<Link href="/chat">
					<TbArrowLeft className="inline-block size-5" />
					Back to Chat
				</Link>
				<div className="grow" />
				<Button>
					Theme
					{/* <ThemeToggle /> */}
				</Button>
				<Button>Sign out</Button>
			</div>

			<div className=" grid grid-cols-[20rem_1fr] gap-16">
				{/* Sidebar */}
				<Sidebar />

				<div>
					{/* Navigation Tabs */}
					<Navigation />

					{/* Main Content */}
					<main className="py-8">{children}</main>
				</div>
			</div>
		</div>
	);
}
