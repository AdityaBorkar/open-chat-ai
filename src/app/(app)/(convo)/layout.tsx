'use client';

import { useAtomValue } from 'jotai';
import dynamic from 'next/dynamic';

import { sidebarAtom } from '@/app/(app)/atoms';
import { cn } from '@/lib/utils';

const Sidebar = dynamic(
	() => import('@/components/pages/sidebar/Sidebar').then((mod) => mod.Sidebar),
	{ ssr: false },
);

export default function ChatLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { open } = useAtomValue(sidebarAtom);
	return (
		<div className="flex h-screen flex-row">
			<Sidebar />
			<div
				className={cn(
					'grow border bg-bg-tertiary/30',
					open
						? 'my-2 mr-4 rounded-2xl border-border/50'
						: 'm-0 border-border/0',
				)}
			>
				{children}
			</div>
		</div>
	);
}
