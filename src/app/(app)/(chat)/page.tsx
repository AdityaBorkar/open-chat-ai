'use client';

import type { PGlite } from '@electric-sql/pglite';
import { useEffect, useRef, useState } from 'react';
import {
	TbArrowUp,
	TbBrain,
	TbCopy,
	TbGitBranch,
	TbGlobe,
	TbInfoCircle,
	TbMicrophone,
	TbPaperclip,
	TbPencil,
	TbRefresh,
	TbTools,
	TbUser,
} from 'react-icons/tb';

import TypingIndicator from '@/components/pages/chat/assistant/TypingIndicator';
import { Header } from '@/components/pages/chat/Header';
import Placeholder from '@/components/pages/chat/Placeholder';
import ScrollToBottom from '@/components/pages/chat/ScrollToBottom';
import { cn } from '@/lib/utils';

export default function NewChatPage() {
	const [db, setDb] = useState<PGlite | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [chats, setChats] = useState<Chat[]>([]);

	const [currentChatId, setCurrentChatId] = useState<number | null>(null);
	const [messages, setMessages] = useState<Message[]>([
		{
			content: 'Hello, how are you?',
			id: 1,
			role: 'user',
			timestamp: new Date().toISOString(),
		},

		{
			content: 'I am fine, thank you!',
			id: 2,
			role: 'assistant',
			timestamp: new Date().toISOString(),
		},
	]);
	const [inputMessage, setInputMessage] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Load messages for current chat
	useEffect(() => {
		if (!db || !currentChatId) return;

		const loadMessages = async () => {
			const result = await db.query(
				'SELECT * FROM messages WHERE chat_id = $1 ORDER BY timestamp ASC',
				[currentChatId],
			);
			setMessages(result.rows as Message[]);
		};

		loadMessages();
	}, [db, currentChatId]);

	// Scroll to bottom when messages change
	// useEffect(() => {
	// 	messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	// });

	const createNewChat = async (firstMessage: string) => {
		if (!db) return null;

		const title =
			firstMessage.length > 30
				? firstMessage.substring(0, 30) + '...'
				: firstMessage;
		const result = await db.query(
			'INSERT INTO chats (title) VALUES ($1) RETURNING id',
			[title],
		);

		const newChatId = (result.rows[0] as any).id;
		const newChat = {
			created_at: new Date().toISOString(),
			id: newChatId,
			title,
		};

		setChats((prev) => [newChat, ...prev]);
		setCurrentChatId(newChatId);

		return newChatId;
	};

	const deleteChat = async (chatId: number) => {
		if (!db) return;

		await db.query('DELETE FROM chats WHERE id = $1', [chatId]);
		setChats((prev) => prev.filter((chat) => chat.id !== chatId));

		if (currentChatId === chatId) {
			setCurrentChatId(null);
			setMessages([]);
		}
	};

	const sendMessage = async () => {
		if (!inputMessage.trim() || !db) return;

		setIsLoading(true);
		const userMessage = inputMessage.trim();
		setInputMessage('');

		let chatId = currentChatId;

		// Create new chat if none selected
		if (!chatId) {
			chatId = await createNewChat(userMessage);
			if (!chatId) return;
		}

		// Add user message to database
		await db.query(
			'INSERT INTO messages (chat_id, content, role) VALUES ($1, $2, $3)',
			[chatId, userMessage, 'user'],
		);

		// Simulate AI response (replace with actual AI call)
		const aiResponse = `This is a simulated AI response to: "${userMessage}". In a real implementation, you would call your AI service here.`;

		setTimeout(async () => {
			// Add AI response to database
			await db.query(
				'INSERT INTO messages (chat_id, content, role) VALUES ($1, $2, $3)',
				[chatId, aiResponse, 'assistant'],
			);

			// Reload messages
			const result = await db.query(
				'SELECT * FROM messages WHERE chat_id = $1 ORDER BY timestamp ASC',
				[chatId],
			);
			setMessages(result.rows as Message[]);
			setIsLoading(false);
		}, 1000);

		// Reload messages to show user message immediately
		const result = await db.query(
			'SELECT * FROM messages WHERE chat_id = $1 ORDER BY timestamp ASC',
			[chatId],
		);
		setMessages(result.rows as Message[]);
	};

	return (
		<div className="relative flex h-full flex-1 flex-col bg-bg-tertiary/30">
			<Header />

			{/* <aside>Document Outline</aside> */}
			{/* Artifacts */}
			{/* Bookmarks / Notes  */}

			{/* Messages */}
			<main className="flex-1 overflow-y-auto p-6">
				<div className="mx-auto w-[48rem] space-y-6">
					{messages.length === 0 && <Placeholder />}
					{messages.map((message) => (
						<div
							className={cn(
								'group',
								message.role === 'user' && 'ml-auto w-fit',
								message.role === 'assistant' && 'ml-0',
							)}
							key={message.id}
						>
							<div
								className={cn(
									'max-w-3xl whitespace-pre-wrap rounded-lg px-4 py-3 text-base text-text-primary',
									message.role === 'user' && 'bg-pink-400/10 ',
								)}
							>
								{message.content}
							</div>
							<div
								className={cn(
									'mt-2 flex flex-row justify-end gap-2 opacity-0 group-hover:opacity-100',
									message.role === 'assistant' && 'flex-row-reverse',
								)}
							>
								{message.role === 'assistant' && (
									<div className="ml-auto flex flex-row gap-2">
										<div>Model User</div>
										<div>Tokens Speed</div>
										<div>Tokens Used</div>
										<div>Time Taken</div>
									</div>
								)}
								<TbInfoCircle />
								<TbRefresh />
								<TbGitBranch />
								<TbPencil />
								<TbCopy />
							</div>
						</div>
					))}
					{isLoading && <TypingIndicator />}
					<div ref={messagesEndRef} />
				</div>
			</main>

			<div className="absolute bottom-2 left-[calc(50%-24rem)] mx-auto w-[48rem]">
				<ScrollToBottom />
				<div className="rounded-4xl border border-border/40 bg-bg-primary/75 backdrop-blur-2xl">
					<div className="flex space-x-4">
						{/* (ALT + #) Assign Chat Folder */}
						{/* (ALT + M) Start / End Transcribe */}
						{/* (ALT + ENTER) Focus on Chat */}
						{/* (DELETE) Delete Chat */}
						{/* (F2) Rename Chat*/}
						<textarea
							className={cn(
								'field-sizing-content max-h-64 min-h-24 flex-1 resize-none px-4 pt-3 pb-2 placeholder:text-text-secondary/50',
								'focus:border-transparent focus:outline-none',
							)}
							disabled={isLoading}
							onChange={(e) => setInputMessage(e.target.value)}
							onKeyPress={(e) =>
								e.key === 'Enter' && !e.shiftKey && sendMessage()
							}
							placeholder="Type your message..."
							value={inputMessage}
						></textarea>
						{/* (!) create-model-persona */}
						{/* (@) attach/prompt/chat-thread/project/data-source */}
						{/* (~) MCP - NOT VISIBLE IN MESSAGE */}
						{/* (Tab-Space) Search / Think */}
					</div>
					<div className="flex flex-row items-center gap-1 border-border/20 border-t px-4 pt-4 text-sm text-text-tertiary">
						{/* CTRL + / */}
						{/* CTRL + ALT + / */}
						<div className="rounded-full border border-border/10 bg-bg-secondary px-3 py-1 font-semibold text-text-secondary">
							Chat
						</div>
						<span>with</span>
						{/* <div>Chat with</div> */}
						{/* <div>Edit with</div> */}
						{/* <div>Create with</div> */}
						{/* Create Images */}
						{/* Create Video */}
						{/* Create Music */}
						{/* Create Code Container */}
						{/* Create Document */}
						{/* Create Presentation */}
						{/* Create Spreadsheet */}
						{/* <div>Talk to</div> */}
						{/* <div>Go Live with</div> */}
						{/* <div>Assist using</div> */}
						<div className="rounded-full border border-border/10 bg-bg-secondary px-3 py-1 font-semibold text-text-secondary">
							{/* Multi Model */}
							{/* Group Chat */}
							Gemini 2.5 Pro (Exp)
							{/* <TbChevronDown className="ml-2 inline-block size-4" /> */}
							{/* <div>Auto</div> */}
						</div>
						<div>as {/* as a / as an / as the */}</div>
						<div className="0 rounded-full border border-border/10 bg-bg-secondary px-4 py-1 opacity-50">
							<TbUser className="-mt-0.5 -ml-0.5 mr-1 inline-block size-4" />
							Persona
						</div>
						<div className="grow" />
						<div className="rounded-full bg-pink-400/10 p-2">
							<TbMicrophone className="size-4 text-white/50" />
						</div>
						<div className="ml-1 rounded-full bg-pink-800 p-2">
							<TbArrowUp className="size-4 text-white" />
						</div>
						{/* Enter */}
						{/* Alt + Enter */}
						{/* Ctrl + Enter */}
					</div>
					<div className="flex w-full flex-row items-center gap-2 px-4 pt-2 pb-4 text-sm">
						<div className="rounded-full border border-border/10 bg-bg-secondary px-3 py-1">
							<TbPaperclip className="-mt-0.5 -ml-1 mr-1.5 inline-block size-4" />
							Attach
							{/* Local Files, Drive Files, Projects */}
						</div>
						<div className="rounded-full border border-border/10 bg-bg-secondary px-3 py-1 opacity-50">
							<TbGlobe className="-mt-0.5 -ml-1 mr-1.5 inline-block size-4" />
							Search
						</div>
						<div className="rounded-full border border-border/10 bg-bg-secondary px-3 py-1 opacity-50">
							<TbBrain className="-mt-0.5 -ml-1 mr-1.5 inline-block size-4" />
							Think
							{/* Think / Research */}
						</div>
						{/* <div className="rounded-full border border-border/10 bg-bg-secondary px-3 py-1">
							<TbBrain className="-mt-0.5 mr-1 inline-block size-4" />
							Code Interpreter
						</div> */}
						<div className="rounded-full border border-border/10 bg-bg-secondary px-3 py-1 opacity-50">
							<TbTools className="-mt-0.5 -ml-1 mr-1.5 inline-block size-4" />
							MCPs
						</div>
						{/* Function Calling & MCP */}
					</div>
				</div>
			</div>
			{/* <div>Token Count, Thinking Budgets, System Instructions, Memories and Personalized Information</div> */}
		</div>
	);
}

// Attachments:
// YouTube Video
// Record Audio
// Camera / Webcam
// Share Screen

// Stream (Gemini) - LIVE CHAT
