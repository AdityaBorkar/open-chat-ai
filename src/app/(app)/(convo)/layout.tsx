'use client';

import Background from '@/components/Background';
import { Sidebar } from '@/components/pages/sidebar/Sidebar';
import { cn } from '@/lib/utils';

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
