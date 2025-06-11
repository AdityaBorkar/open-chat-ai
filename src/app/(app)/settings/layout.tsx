'use client';

import { useRouter } from 'next/navigation';
import { useHotkeys } from 'react-hotkeys-hook';
import { TbArrowLeft } from 'react-icons/tb';

import { Navigation } from '@/components/pages/settings/Navigation';
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

			<div className="flex h-[90vh] rounded-3xl ">
				{/* Navigation */}
				<Navigation />

				{/* Main Content */}
				<main className="flex-1 overflow-auto rounded-r-3xl border border-border/30 border-l-0 py-8 pl-8">
					{children}
				</main>
			</div>
		</div>
	);
}
