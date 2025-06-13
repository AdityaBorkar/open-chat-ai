import type { IconType } from 'react-icons';
import {
	TbFolder,
	TbFolderOpen,
	TbMessage,
	TbPin,
	TbTrash,
} from 'react-icons/tb';

import Title from '@/components/pages/sidebar/Title';
import { Link } from '@/components/ui/Link';
import { cn } from '@/lib/utils';

const chats = [
	{
		created_at: '2021-01-01',
		id: 'aasda2232x',
		title: 'Chat 1',
		type: 'chat',
	},
	{
		created_at: '2021-01-01',
		id: 'aasda222x',
		title: 'Chat 2',
		type: 'talk',
	},
	{
		created_at: '2021-01-01',
		id: 'aasda222xa',
		title: 'Chat 3',
		type: 'chat',
	},
	{
		created_at: '2021-01-01',
		id: 'aasdxa',
		title: 'Chat 4',
		type: 'chat',
	},
] as const;

export function ConversationSection() {
	const doNotGroupChats = true;
	const folders = [
		{ color: 'blue', id: '1', name: 'Default' },
		{ color: 'green', id: '2', name: 'Work' },
	];
	const conversations = doNotGroupChats
		? [
				{
					chats, // : [...chats, ...chats, ...chats, ...chats, ...chats],
					title: 'All',
				},
			]
		: [
				{ chats: chats, title: 'Today' },
				{ chats: chats, title: 'Yesterday' },
				{ chats: chats, title: 'Last Week' },
				{ chats: chats, title: 'Last Month' },
				{ chats: chats, title: 'Earlier' },
			];

	// TODO: Context Menu - Rename, Pin, Branch, Add to Project, Move to Folder, Share, Export, Archive, Delete

	return (
		<div className="contents">
			<Title icon={TbPin}>Pinned</Title>
			{chats.map((chat) => (
				<ConversationItem chat={chat} key={chat.id} />
			))}
			<Title icon={TbFolder}>Folders</Title>
			{folders.map((folder) => (
				<FolderItem folder={folder} key={folder.id} />
			))}
			<div className="mt-2 flex-1 overflow-y-auto border-border/40 border-t pt-2 text-base">
				{conversations.map((conversation) => (
					<div className="mb-2 contents" key={conversation.title}>
						<Title>{conversation.title}</Title>
						{conversation.chats.map((chat) => (
							<ConversationItem chat={chat} key={chat.id} />
						))}
					</div>
				))}
			</div>
		</div>
	);
}

function FolderItem({ folder }: { folder: Partial<Folder> }) {
	const conversations = chats;
	return (
		<details className="group relative">
			<summary className="mx-1 block rounded-md px-3 py-2 font-medium text-base text-text-tertiary hover:bg-bg-secondary group-open:font-medium group-open:text-text-primary">
				<Icon className="inline-block group-open:hidden" icon={TbFolder} />
				<Icon className="hidden group-open:inline-block" icon={TbFolderOpen} />
				<span>{folder.name}</span>
			</summary>
			<div className="ml-2 flex flex-col gap-1">
				{conversations.map((conversation) => (
					<ConversationItem chat={conversation} key={conversation.id} />
				))}
			</div>
		</details>
	);
}

function ConversationItem({ chat }: { chat: Partial<Conversation> }) {
	// const deleteChat = (id: string) => {
	// 	console.log(id);
	// };
	return (
		<Link
			className="group relative mx-1 block px-3 py-2 font-medium text-base text-text-tertiary hover:bg-bg-secondary"
			href={`/chat/${chat.id}`}
			key={chat.id}
		>
			<Icon icon={TbMessage} />
			<span className="truncate">{chat.title}</span>
			<div className="absolute top-1 right-1 flex flex-row gap-1.5 opacity-0 group-hover:opacity-100">
				<button className="size-7 rounded-md bg-bg-tertiary/50" type="button">
					<TbPin className="mx-auto size-4 " />
				</button>
				<button className="size-7 rounded-md bg-bg-tertiary/50" type="button">
					<TbTrash className="mx-auto size-4 " />
				</button>
			</div>
		</Link>
	);
}

function Icon({
	icon: Icon,
	className,
}: {
	icon: IconType;
	className?: string;
}) {
	return <Icon className={cn('-mt-1 mr-1.5 inline-block size-4', className)} />;
}
