'use client';

import dynamic from 'next/dynamic';

import Background from '@/components/Background';
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
	// const { open } = useAtomValue(sidebarAtom);
	return (
		<Background>
			<div className="flex h-screen flex-row">
				<Sidebar />
				<div className={cn('grow')}>{children}</div>
			</div>
		</Background>
	);
}
