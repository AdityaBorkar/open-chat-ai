'use client';

import {
	TbCopy,
	TbGitBranch,
	TbInfoCircle,
	TbPencil,
	TbRefresh,
} from 'react-icons/tb';

import TypingIndicator from '@/components/pages/convo/assistant/TypingIndicator';
import { Header } from '@/components/pages/convo/Header';
import ScrollToBottom from '@/components/pages/convo/ScrollToBottom';
import UserInput from '@/components/pages/convo/UserInput';
import { cn } from '@/lib/utils';

const MESSAGES = [
	{
		content: 'Hello, how are you?',
		id: '1',
		role: 'user',
		timestamp: new Date().toISOString(),
	},

	{
		content: 'I am fine, thank you!',
		id: '2',
		role: 'assistant',
		timestamp: new Date().toISOString(),
	},
] as const;

export default function ChatPage() {
	const messages = MESSAGES;
	const isLoading = false;

	// <div>Token Count, Thinking Budgets, System Instructions, Memories and Personalized Information</div>
	// Attachments:
	// YouTube Video
	// Record Audio
	// Camera / Webcam
	// Share Screen

	// Stream (Gemini) - LIVE CHAT

	return (
		<div className="relative h-full">
			<Header />

			<aside>Document Outline</aside>
			<aside>Artifacts / Bookmarks / Notes</aside>

			{/* Messages */}
			<main className="flex-1 overflow-y-auto p-6">
				<div className="mx-auto w-[48rem] space-y-6">
					{messages.map((message) => (
						<Message key={message.id} message={message} />
					))}
					{isLoading && <TypingIndicator />}
					{/* <div ref={messagesEndRef} /> */}
				</div>
			</main>

			<div className="absolute bottom-2 left-[calc(50%-24rem)] mx-auto w-[48rem]">
				<ScrollToBottom />
				<UserInput />
			</div>
		</div>
	);
}

function Message({ message }: { message: Message }) {
	return (
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
				<TbInfoCircle className="size-5" />
				<TbRefresh className="size-5" />
				<TbGitBranch className="size-5" />
				<TbPencil className="size-5" />
				<TbCopy className="size-5" />
			</div>
		</div>
	);
}
