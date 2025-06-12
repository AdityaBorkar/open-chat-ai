import { useAtom } from 'jotai';
import { usePathname, useRouter } from 'next/navigation';
import type { HTMLAttributes } from 'react';
import { TbLayoutSidebar, TbPlus, TbSearch } from 'react-icons/tb';

import { sidebarAtom } from '@/components/pages/sidebar/atoms';
import { cn } from '@/lib/utils';

const onValidKeyPress =
	(callback: () => void) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
		if (e.key === 'Space' || e.key === 'Enter') {
			callback();
		}
	};

export function Minibar() {
	const [{ open }, setSidebar] = useAtom(sidebarAtom);

	function toggleSidebar() {
		setSidebar((prev) => ({ ...prev, open: !prev.open }));
	}

	function openCommandK() {
		// TODO: IMPLEMENT
		console.log('openCommandK');
	}

	const pathname = usePathname();
	const router = useRouter();
	function openNewChat() {
		router.push('/');
	}

	return (
		<div
			className={cn(
				'group absolute top-2.5 left-4 z-50 flex flex-row gap-x-1 rounded-lg border border-transparent p-0.5',
				'not-data-[open=true]:border-border/50 not-data-[open=true]:bg-bg-tertiary',
			)}
			data-open={open}
		>
			<MinibarButton icon={TbLayoutSidebar} onClick={toggleSidebar} />
			<MinibarButton
				className="group-data-[open=true]:hidden"
				icon={TbSearch}
				onClick={openCommandK}
			/>
			<MinibarButton
				className="group-data-[open=true]:hidden"
				disabled={pathname === '/'}
				icon={TbPlus}
				onClick={openNewChat}
			/>
		</div>
	);
}

function MinibarButton({
	icon: Icon,
	onClick,
	className,
	...props
}: HTMLAttributes<HTMLButtonElement> & {
	icon: React.ElementType;
	disabled?: boolean;
	onClick: () => void;
}) {
	return (
		<button
			className={cn(
				'rounded-md p-1.5 hover:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-50',
				className,
			)}
			onKeyDown={onValidKeyPress(onClick)}
			onMouseDown={onClick}
			type="button"
			{...props}
		>
			<Icon className="pointer-events-none size-5" />
		</button>
	);
}
