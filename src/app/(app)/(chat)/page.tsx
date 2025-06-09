'use client';

import type { PGlite } from '@electric-sql/pglite';
import { MessageSquare } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
	TbArrowUp,
	TbBrain,
	TbChevronDown,
	TbGlobe,
	TbLayoutGrid,
	TbMicrophone,
	TbPaperclip,
	TbUser,
} from 'react-icons/tb';

interface Message {
	id: number;
	content: string;
	role: 'user' | 'assistant';
	timestamp: string;
}

interface Chat {
	id: number;
	title: string;
	created_at: string;
}

export default function NewChatPage() {
	const [db, setDb] = useState<PGlite | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [chats, setChats] = useState<Chat[]>([]);

	const [currentChatId, setCurrentChatId] = useState<number | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
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
		<div className="relative flex h-full flex-1 flex-col">
			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-6">
				{currentChatId ? (
					<div className="mx-auto max-w-4xl space-y-6">
						{messages.map((message) => (
							<div
								className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
								key={message.id}
							>
								<div
									className={`max-w-3xl rounded-lg px-4 py-3 ${
										message.role === 'user'
											? 'bg-blue-600 text-white'
											: 'border border-gray-200 bg-white text-gray-900'
									}`}
								>
									<div className="whitespace-pre-wrap">{message.content}</div>
									<div
										className={`mt-2 text-xs ${
											message.role === 'user'
												? 'text-blue-100'
												: 'text-gray-500'
										}`}
									>
										{new Date(message.timestamp).toLocaleTimeString()}
									</div>
								</div>
							</div>
						))}
						{isLoading && (
							<div className="flex justify-start">
								<div className="max-w-xs rounded-lg border border-gray-200 bg-white px-4 py-3">
									<div className="flex space-x-1">
										<div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
										<div
											className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
											style={{ animationDelay: '0.1s' }}
										></div>
										<div
											className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
											style={{ animationDelay: '0.2s' }}
										></div>
									</div>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>
				) : (
					<div className="flex h-full items-center justify-center">
						<div className="text-center">
							<MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
							<h2 className="mb-2 font-medium text-gray-600 text-xl">
								Welcome to AI Chat
							</h2>
							<p className="text-gray-500">
								Select a chat from the sidebar or start a new conversation
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Input Area */}
			<div>Scroll to bottom</div>
			<div className="absolute bottom-0 left-[calc(50%-16rem)] mx-auto w-[32rem] rounded-t-2xl border border-border/10 bg-bg-secondary/20">
				<div className="mx-2 mt-2 rounded-t-lg border border-border/10 bg-bg-secondary/20 backdrop-blur-2xl ">
					<div className="flex space-x-4">
						<input
							className="flex-1 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
							disabled={isLoading}
							onChange={(e) => setInputMessage(e.target.value)}
							onKeyPress={(e) =>
								e.key === 'Enter' && !e.shiftKey && sendMessage()
							}
							placeholder="Type your message..."
							type="text"
							value={inputMessage}
						/>
					</div>
					<div className="flex flex-row gap-2 px-2 py-2 text-sm">
						<div className="rounded-lg bg-bg-secondary px-3 py-1.5">
							Model Selection
							<TbChevronDown className="ml-2 inline-block size-4" />
							<div className="inline-block">
								<TbUser className="-mt-0.5 mr-1 inline-block size-4" />
								Personas
							</div>
						</div>
						<div className="rounded-full border border-border/10 bg-bg-secondary px-3 py-1">
							<TbGlobe className="-mt-0.5 mr-1 inline-block size-4" />
							Search
						</div>
						<div className="rounded-full border border-border/10 bg-bg-secondary px-3 py-1">
							<TbBrain className="-mt-0.5 mr-1 inline-block size-4" />
							Think
						</div>
						<div className="rounded-full border border-border/10 bg-bg-secondary px-3 py-1">
							<TbBrain className="-mt-0.5 mr-1 inline-block size-4" />
							Code Interpreter
						</div>
						<div className="rounded-full border border-border/10 bg-bg-secondary px-3 py-1">
							<TbPaperclip className="-mt-0.5 mr-1 inline-block size-4" />
							Attach
						</div>
						<div className="rounded-full border border-border/10 bg-bg-secondary px-3 py-1">
							<TbLayoutGrid className="-mt-0.5 mr-1 inline-block size-4" />
							Projects
						</div>
						<div className="rounded-full border border-border/10 bg-bg-secondary px-3 py-1">
							<TbBrain className="-mt-0.5 mr-1 inline-block size-4" />
							Connections
						</div>
						<div className="rounded-full border border-border/10 bg-bg-secondary px-3 py-1">
							<TbBrain className="-mt-0.5 mr-1 inline-block size-4" />
							MCPs
						</div>
						{/* DeepSearch / DeeperSearch */}
						{/* Create Images */}
						{/* Create Video */}
						{/* Create Music */}
						{/* Create Code Container */}
						{/* Create Document */}
						{/* Create Presentation */}
						{/* Create Spreadsheet */}
						{/* Voice Mode */}
						<div className="grow"></div>
						<TbMicrophone className="size-5 text-white" />
						<div className="rounded-full bg-pink-800 p-1.5">
							<TbArrowUp className="size-5 text-white" />
						</div>
						<div className="w-full flex-1" />
						<div>Voice Mode / Chat Mode / Create Mode</div>
						{/* Enter */}
						{/* Alt + Enter */}
						{/* Ctrl + Enter */}
					</div>
					<div>Thinking Budgets, System Instructions</div>
				</div>
			</div>
		</div>
	);
}

// Attachments:
// YouTube Video
// Record Audio
// Camera / Webcam
// Share Screen

// Stream (Gemini) - LIVE CHAT
