import Link from 'next/link';
import { TbPin, TbTrash } from 'react-icons/tb';

import Title from '@/components/pages/sidebar/Title';

const list = [
	{
		created_at: '2021-01-01',
		id: 'aasda2232x',
		title: 'How many rs in the word strawberry? Tell me!!',
		type: 'chat',
	},
	{
		created_at: '2021-01-01',
		id: 'aasda222x',
		title: 'how to integrate webflow with shippo',
		type: 'talk',
	},
	{
		created_at: '2021-01-01',
		id: 'aasda222xa',
		title: 'Can I have a cup of coffee? Please AI, make me one.',
		type: 'chat',
	},
	{
		created_at: '2021-01-01',
		id: 'aasdxa',
		title: 'What is the capital of France?',
		type: 'chat',
	},
] as const;

export function ConversationSection() {
	const doNotGroupChats = true;
	// const _folders = [
	// 	{ color: 'blue', id: '1', name: 'Default' },
	// 	{ color: 'green', id: '2', name: 'Work' },
	// ];
	const pinned_list = list;
	const convo_list = doNotGroupChats
		? [{ list, title: 'All Conversations' }]
		: [
				{ list, title: 'Today' },
				{ list, title: 'Yesterday' },
				{ list, title: 'Last Week' },
				{ list, title: 'Last Month' },
				{ list, title: 'Earlier' },
			];

	// TODO: Context Menu - Rename, Pin, Branch, Add to Project, Move to Folder, Share, Export, Archive, Delete

	return (
		<div className="contents">
			<Title icon={TbPin}>Pinned</Title>
			{pinned_list.map((convo) => (
				<ConvoItem convo={convo} key={convo.id} />
			))}
			{/* <Title icon={TbFolder}>Folders</Title>
			{folders.map((folder) => (
				<FolderItem folder={folder} key={folder.id} />
			))} */}
			<div className="flex-1 overflow-y-auto">
				{convo_list.map((convo) => (
					<div className="mb-2 contents" key={convo.title}>
						<Title>{convo.title}</Title>
						{convo.list.map((chat) => (
							<ConvoItem convo={chat} key={chat.id} />
						))}
					</div>
				))}
			</div>
		</div>
	);
}

// function FolderItem({ folder }: { folder: Partial<Folder> }) {
// 	const conversations = chats;
// 	return (
// 		<details className="group relative">
// 			<summary className="mx-1 block rounded-md px-3 py-2 font-medium text-base text-text-tertiary hover:bg-bg-secondary group-open:font-medium group-open:text-text-primary">
// 				<Icon className="inline-block group-open:hidden" icon={TbFolder} />
// 				<Icon className="hidden group-open:inline-block" icon={TbFolderOpen} />
// 				<span>{folder.name}</span>
// 			</summary>
// 			<div className="ml-2 flex flex-col gap-1">
// 				{conversations.map((conversation) => (
// 					<ConvoItem convo={conversation} key={conversation.id} />
// 				))}
// 			</div>
// 		</details>
// 	);
// }

function ConvoItem({ convo }: { convo: Partial<Conversation> }) {
	return (
		<Link
			className="group relative mx-1 block text-clip rounded-lg px-2 py-2 font-medium text-base text-text-primary hover:bg-white/30"
			href={`/convo/${convo.id}`}
			key={convo.id}
			prefetch={false}
		>
			<div className="overflow-hidden text-clip whitespace-nowrap bg-gradient-to-r from-[60%] from-text-primary to-transparent bg-clip-text text-transparent">
				{convo.title}
			</div>
			<div className="invisible absolute top-1.75 right-1 flex flex-row rounded-lg bg-white/50 backdrop-blur-xs group-hover:visible">
				<button
					className="size-6 rounded-md text-[#515151] hover:bg-bg-tertiary"
					type="button"
				>
					<TbPin className="mx-auto size-3.5" />
				</button>
				<button
					className="size-6 rounded-md text-[#515151] hover:bg-bg-tertiary"
					type="button"
				>
					<TbTrash className="mx-auto size-3.5" />
				</button>
			</div>
		</Link>
	);
}

// function _Icon({
// 	icon: Icon,
// 	className,
// }: {
// 	icon: IconType;
// 	className?: string;
// }) {
// 	return <Icon className={cn('-mt-1 mr-1.5 inline-block size-4', className)} />;
// }
