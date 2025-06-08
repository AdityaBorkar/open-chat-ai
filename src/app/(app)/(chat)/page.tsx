'use client';

import { PGlite } from '@electric-sql/pglite';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';

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
	const [chats, setChats] = useState<Chat[]>([]);
	const [currentChatId, setCurrentChatId] = useState<number | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputMessage, setInputMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Initialize database
	useEffect(() => {
		const initDb = async () => {
			const database = new PGlite();

			// Create tables
			await database.exec(`
        CREATE TABLE IF NOT EXISTS chats (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

			setDb(database);
		};

		initDb();
	}, []);

	// Load chats
	useEffect(() => {
		if (!db) return;

		const loadChats = async () => {
			const result = await db.query(
				'SELECT * FROM chats ORDER BY created_at DESC',
			);
			setChats(result.rows as Chat[]);
		};

		loadChats();
	}, [db]);

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
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

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

	const selectChat = (chatId: number) => {
		setCurrentChatId(chatId);
	};

	return (
		<div className="flex h-screen ">
			{/* Left Sidebar - Chat History */}
			<div className="flex w-80 flex-col border-border border-r ">
				<div className="border-gray-200 border-b p-4">
					<Button
						className="flex w-full items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
						onClick={() => {
							setCurrentChatId(null);
							setMessages([]);
						}}
					>
						<MessageSquare size={20} />
						New Chat
					</Button>
				</div>
				<div>
					<input placeholder="Search chats" />
				</div>

				<div>Prompts</div>

				<div>Projects</div>
				{/* --------------------- */}

				<div>Chat Folders</div>

				<div>Pinned Chats</div>

				<div>Today</div>

				<div className="flex-1 overflow-y-auto">
					{chats.map((chat) => (
						<div
							className={`group flex cursor-pointer items-center justify-between border-gray-100 border-b p-3 hover:bg-gray-50 ${
								currentChatId === chat.id ? 'border-blue-200 bg-blue-50' : ''
							}`}
							key={chat.id}
							onClick={() => selectChat(chat.id)}
						>
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
							>
								<Trash2 className="text-red-500" size={16} />
							</button>
						</div>
					))}
				</div>
			</div>

			{/* Main Chat Area */}
			<div className="flex flex-1 flex-col">
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
								<MessageSquare
									className="mx-auto mb-4 text-gray-400"
									size={48}
								/>
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
				<div className="border-gray-200 border-t bg-white p-6">
					<div className="mx-auto max-w-4xl">
						<div className="flex space-x-4">
							<input
								className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
								disabled={isLoading}
								onChange={(e) => setInputMessage(e.target.value)}
								onKeyPress={(e) =>
									e.key === 'Enter' && !e.shiftKey && sendMessage()
								}
								placeholder="Type your message..."
								type="text"
								value={inputMessage}
							/>
							<button
								className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
								disabled={!inputMessage.trim() || isLoading}
								onClick={sendMessage}
							>
								<Send size={20} />
								Send
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
