'use client';

import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import {
	TbDatabase,
	TbFileText,
	TbLayoutGrid,
	TbLayoutSidebar,
	TbPlus,
	TbRobotFace,
	TbSearch,
} from 'react-icons/tb';

import Title from '@/components/pages/sidebar/Title';
import { Link } from '@/components/ui/Link';
import { cn } from '@/lib/utils';

interface Chat {
	id: number;
	title: string;
	created_at: string;
}

const SIDEBAR_DEFAULT_WIDTH = 260;
const SIDEBAR_MIN_WIDTH = 230;
const SIDEBAR_MAX_WIDTH = 500;

export default function ChatLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [chats] = useState<Chat[]>([
		{
			created_at: '2021-01-01',
			id: 'aasda2232x',
			title: 'Chat 1',
		},
	]);

	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
	const [isDragging, setIsDragging] = useState(false);
	const SidebarRef = useRef<HTMLDivElement>(null);

	// const [db, setDb] = useState<PGlite | null>(null);
	// Initialize database
	// useEffect(() => {
	// 	const initDb = async () => {
	// 		const database = new PGlite();

	// 		// Create tables
	// 		await database.exec(`
	//     CREATE TABLE IF NOT EXISTS chats (
	//       id SERIAL PRIMARY KEY,
	//       title TEXT NOT NULL,
	//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	//     );

	//     CREATE TABLE IF NOT EXISTS messages (
	//       id SERIAL PRIMARY KEY,
	//       chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
	//       content TEXT NOT NULL,
	//       role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
	//       timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	//     );
	//   `);

	// 		setDb(database);
	// 	};

	// 	initDb();
	// }, []);

	// // Load chats
	// useEffect(() => {
	// 	if (!db) return;

	// 	const loadChats = async () => {
	// 		const result = await db.query(
	// 			'SELECT * FROM chats ORDER BY created_at DESC',
	// 		);
	// 		setChats(result.rows as Chat[]);
	// 	};

	// 	loadChats();
	// }, [db]);

	const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!isDragging) return;

		const newWidth = Math.min(
			SIDEBAR_MAX_WIDTH,
			Math.max(SIDEBAR_MIN_WIDTH, e.clientX),
		);
		setSidebarWidth(newWidth);
	};

	const user = {
		avatarUrl: '/profile-image-temp.jpg',
		name: 'John Doe',
		plan: 'Free',
	};

	return (
		<div className="flex h-screen flex-row">
			<div
				className={cn(
					'absolute top-3.5 left-4 flex flex-row gap-x-1 rounded-md p-1',
					sidebarOpen ? '' : 'bg-bg-primary hover:bg-border/50',
				)}
			>
				<div className="rounded-md p-1.5 hover:bg-bg-secondary" tabIndex={0}>
					<TbLayoutSidebar
						className="size-5"
						onKeyDown={(e) => {
							if (e.key !== 'Tab') {
								setSidebarOpen((prev) => !prev);
							}
						}}
						onMouseDown={() => setSidebarOpen((prev) => !prev)}
					/>
				</div>
				<div
					className={cn(
						'rounded-md p-1.5 hover:bg-bg-secondary',
						sidebarOpen && 'hidden',
					)}
					tabIndex={0}
					// OPEN COMMAND-K
				>
					<TbSearch className="size-5" />
				</div>
				<div
					className={cn(
						'rounded-md p-1.5 hover:bg-bg-secondary',
						sidebarOpen && 'hidden',
					)}
					tabIndex={0}
				>
					{/* If on NEW CHAT screen, disable the button */}
					<TbPlus className="size-5" />
				</div>
			</div>

			<div
				className={cn(
					'flex flex-col py-4 pl-4',
					sidebarOpen ? 'flex' : 'hidden w-0',
				)}
				ref={SidebarRef}
				style={{ width: `${sidebarWidth}px` }}
			>
				<div className="mb-2 px-4 py-2 text-center font-semibold text-base text-text-primary">
					OpenChat AI
				</div>

				<div className="mt-2 mb-4 flex w-full flex-row gap-2">
					<Link className="w-full bg-pink-800" href="/">
						<TbPlus className="-mt-0.5 mr-2 inline-block size-5" />
						New Chat
					</Link>
					<div
						className="rounded-md px-2 py-1 hover:bg-bg-secondary"
						tabIndex={0}
					>
						<TbSearch className="inline-block size-4.5" />
						{/* <input
            className=" border border-border/50 px-4 py-2"
            placeholder="Search chats"
        /> */}
					</div>
				</div>

				<Link href="/data-sources" variant="compact">
					<TbDatabase className="-mt-0.5 mr-2 inline-block size-5" />
					Data Sources
				</Link>
				<Link href="/connections" variant="compact">
					<TbLayoutGrid className="-mt-0.5 mr-2 inline-block size-5" />
					Connections
				</Link>
				<Link href="/mcp" variant="compact">
					<TbLayoutGrid className="-mt-0.5 mr-2 inline-block size-5" />
					MCP
				</Link>
				<Link href="/projects" variant="compact">
					<TbLayoutGrid className="-mt-0.5 mr-2 inline-block size-5" />
					Projects
				</Link>
				<Link href="/agents" variant="compact">
					<TbRobotFace className="-mt-0.5 mr-2 inline-block size-5" />
					Agents
				</Link>
				<Link href="/prompts" variant="compact">
					<TbFileText className="-mt-0.5 mr-2 inline-block size-5" />
					Prompts
				</Link>

				<Title>Chat Folders</Title>

				<Title>Pinned Chats</Title>

				<Title>Today</Title>
				<div className="flex-1 overflow-y-auto">
					{chats.map((chat) => (
						<Link href={`/chat/${chat.id}`} key={chat.id} variant="compact">
							<div className="min-w-0 flex-1">
								<div className="truncate font-medium text-gray-900 text-sm">
									{chat.title}
								</div>
								<div className="text-gray-500 text-xs">
									{new Date(chat.created_at).toLocaleDateString()}
								</div>
							</div>
							<button
								className="rounded p-1 opacity-0 transition-all hover:bg-red-100 group-hover:opacity-100"
								onClick={(e) => {
									e.stopPropagation();
									deleteChat(chat.id);
								}}
								type="button"
							>
								<Trash2 className="text-red-500" size={16} />
							</button>
						</Link>
					))}
				</div>

				<Link
					className="my-2 flex items-center gap-x-3"
					href="/settings/account"
					variant="compact"
				>
					<div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-600">
						{user.avatarUrl && (
							<Image
								alt="User Avatar"
								className="rounded-full object-cover"
								height={32}
								src={user.avatarUrl}
								width={32}
							/>
						)}
					</div>
					<div className="text-sm text-text-primary leading-tight">
						<div className="font-semibold">{user.name}</div>
						<div>{user.plan}</div>
					</div>
				</Link>
			</div>

			{sidebarOpen && (
				<button
					aria-label="Resize Sidebar"
					className="group w-4 cursor-ew-resize"
					onDoubleClick={() => {
						setSidebarWidth(SIDEBAR_DEFAULT_WIDTH);
					}}
					onMouseDown={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setIsDragging(true);
					}}
					onMouseMove={handleMouseMove}
					onMouseUp={() => {
						setIsDragging(false);
					}}
					tabIndex={-1}
					type="button"
				>
					<div className="mx-auto hidden h-full w-1 cursor-ew-resize bg-text-primary/20 transition-all group-hover:block group-active:bg-text-primary/50" />
				</button>
			)}

			<div
				className={cn(
					'grow border bg-bg-primary',
					sidebarOpen
						? 'my-3 mr-4 rounded-xl border-border/50'
						: 'm-0 border-border/0',
				)}
			>
				{children}
			</div>
		</div>
	);
}
