import { useAtomValue } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { TbPlus, TbSearch } from 'react-icons/tb';

import { sidebarAtom } from '@/app/(app)/atoms';
import Logo from '@/assets/logo.svg';
import { ConversationSection } from '@/components/pages/sidebar/sections/Conversation';
import { LibrarySection } from '@/components/pages/sidebar/sections/Library';
import { Tabs } from '@/components/ui/Tabs';
import { cn } from '@/lib/utils';

enum SidebarSection {
	CONVERSATIONS = 'conversations',
	LIBRARY = 'library',
}

export function Sidebar() {
	const { open, width } = useAtomValue(sidebarAtom);
	const [_section, _setSection] = useState(SidebarSection.CONVERSATIONS);

	return (
		<>
			{/* <Minibar /> */}

			<div
				className={cn(
					'relative z-50 mx-6 my-4 flex flex-col rounded-3xl bg-white/25 shadow-[0px_0px_145px_0px_#0000000A] ring-2 ring-white/35',
					'px-3', // ! NOT STANDARD
					!open && 'hidden w-0',
				)}
				style={{
					width: `${width}px`,
				}}
			>
				<Image
					alt="OpenConverse"
					className="mt-4 mr-auto mb-4 ml-2 h-8 w-auto"
					src={Logo}
				/>
				<div className="group my-2 flex w-full flex-row items-center gap-2">
					<Link
						className={cn(
							'grow rounded-full py-3 text-center font-medium text-base text-white backdrop-blur-md',
							// 'transition-all duration-200'
							// 'border border-white/10',
							'bg-[#7D45E4]',
							'backdrop-blur-md',
						)}
						href="/"
						prefetch={false}
					>
						<span className="mr-2 group-has-[&_input:focus]:hidden group-has-[&_input:not(:placeholder-shown)]:hidden">
							New Conversation
						</span>
						<TbPlus className="-mt-0.5 inline-block size-4" />
					</Link>
					<div className="relative">
						<input
							className={cn(
								'block rounded-full border border-border/50 py-2.5 pr-2 pl-9 text-base tracking-tight',
								'hover:bg-bg-secondary focus:outline-none',
								'not-placeholder-shown:w-full placeholder-shown:w-0 focus:w-full',
								'not-placeholder-shown:pl-9 focus:pl-9',
							)}
							placeholder="Search chats"
						/>
						<TbSearch className="pointer-events-none absolute top-3 left-3.5 inline-block size-4.5" />
					</div>
				</div>
				<Tabs
					className="grid grid-cols-2 gap-1"
					items={[
						{ children: <ConversationSection />, label: 'Conversations' },
						{ children: <LibrarySection />, label: 'Folders' },
					]}
				/>
			</div>
		</>
	);
}
