import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { TbPlus, TbSearch } from 'react-icons/tb';

import { sidebarAtom } from '@/components/pages/sidebar/atoms';
import { Minibar } from '@/components/pages/sidebar/Minibar';
import { ResizeHandle } from '@/components/pages/sidebar/ResizeHandle';
import { ConversationSection } from '@/components/pages/sidebar/sections/Conversation';
import { LibrarySection } from '@/components/pages/sidebar/sections/Library';
import { UserInfo } from '@/components/pages/sidebar/UserInfo';
import { Link } from '@/components/ui/Link';
import { cn } from '@/lib/utils';

enum SidebarSection {
	CONVERSATIONS = 'conversations',
	LIBRARY = 'library',
}

export function Sidebar() {
	const { open, width } = useAtomValue(sidebarAtom);
	const [section, setSection] = useState(SidebarSection.CONVERSATIONS);

	return (
		<>
			<Minibar />

			<div
				className={cn('flex flex-col pt-4 pl-4', open ? 'flex' : 'hidden w-0')}
				style={{ width: `${width}px` }}
			>
				<div className="mb-3 px-4 py-1 text-center font-semibold text-base text-text-primary">
					OpenConverse
				</div>

				<div className="group my-2 flex w-full flex-row items-center gap-2">
					<Link
						className={cn(
							'grow rounded-full bg-pink-800 px-2 transition-all duration-200 hover:bg-pink-900',
						)}
						href="/"
					>
						<TbPlus className="-mt-0.5 inline-block size-5" />
						<span className="ml-1 group-has-[&_input:focus]:hidden group-has-[&_input:not(:placeholder-shown)]:hidden">
							New Conversation
						</span>
					</Link>
					<div className="relative">
						<input
							className={cn(
								'block rounded-full border border-border/50 py-1.5 pr-2 pl-7 text-base tracking-tight',
								'hover:bg-bg-secondary focus:outline-none',
								'not-placeholder-shown:w-full placeholder-shown:w-0 focus:w-full',
								'not-placeholder-shown:pl-8 focus:pl-8',
							)}
							placeholder="Search chats"
						/>
						<TbSearch className="pointer-events-none absolute top-2 left-2.5 inline-block size-4.5" />
					</div>
				</div>

				<div className="grid grid-cols-2 gap-1 rounded-full border border-border/20 bg-bg-secondary/50 p-0.5 text-center">
					<SectionItem
						isActive={section === SidebarSection.CONVERSATIONS}
						onClick={() => setSection(SidebarSection.CONVERSATIONS)}
					>
						Conversations
					</SectionItem>
					<SectionItem
						isActive={section === SidebarSection.LIBRARY}
						onClick={() => setSection(SidebarSection.LIBRARY)}
					>
						Library
					</SectionItem>
				</div>

				{section === SidebarSection.CONVERSATIONS ? (
					<ConversationSection />
				) : (
					<LibrarySection />
				)}

				{/*
				! `Activity` component returns error:
					Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined.
					You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
				 */}
				{/* <Activity
					mode={section === SidebarSection.CONVERSATIONS ? 'visible' : 'hidden'}
				>
					<ConversationSection />
				</Activity>
				<Activity
					mode={section === SidebarSection.CONFIG ? 'visible' : 'hidden'}
				>
					<ConfigSection />
				</Activity> */}

				<UserInfo className="my-2" />
			</div>

			{open && <ResizeHandle />}
		</>
	);
}

function SectionItem({
	children,
	onClick,
	isActive,
}: {
	children: React.ReactNode;
	onClick: () => void;
	isActive: boolean;
}) {
	return (
		<button
			className={cn(
				'rounded-full px-2 py-1 font-medium text-sm ',
				isActive
					? 'bg-bg-tertiary text-text-secondary'
					: 'text-text-secondary/50 hover:bg-bg-tertiary/50 hover:text-text-secondary/75',
			)}
			onClick={onClick}
			type="button"
		>
			{children}
		</button>
	);
}
