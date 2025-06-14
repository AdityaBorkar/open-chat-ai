'use client';

import { useState } from 'react';
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
import { Button } from '@/components/ui/Button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Link } from '@/components/ui/Link';
import { cn } from '@/lib/utils';

const MESSAGES = [
	{
		content: 'Hello, how are you?',
		id: '1',
		role: 'user',
		timestamp: new Date().toISOString(),
	},

	// {
	// 	content: 'I am fine, thank you!',
	// 	id: '2',
	// 	role: 'assistant',
	// 	timestamp: new Date().toISOString(),
	// },
] as const;

type ChatMessage = (typeof MESSAGES)[number];

export default function ChatPage() {
	const messages = MESSAGES;
	const isLoading = false;
	const [apiKey, _setApiKey] = useState('');
	const [_validationError, setValidationError] = useState('');
	const _handleLinkOAuth = () => {
		window.location.href = '/api/auth/openrouter';
	};
	const _handleValidateApiKey = async () => {
		try {
			const res = await fetch('/api/openrouter/validate-key', {
				body: JSON.stringify({ apiKey }),
				headers: { 'Content-Type': 'application/json' },
				method: 'POST',
			});
			if (!res.ok) throw new Error();
			setValidationError('');
			alert('API Key validated successfully!');
		} catch {
			setValidationError('Invalid API Key, please try again.');
		}
	};

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
				<ApiKeyNotConfigured />
			</main>

			<div className="absolute bottom-2 left-[calc(50%-24rem)] mx-auto w-[48rem]">
				<ScrollToBottom />
				<UserInput />
			</div>
		</div>
	);
}

// <CursorShadow size="md"> </CursorShadow>

function _ApiKeyExceededLimit() {
	return (
		<div>
			<div>
				You have exceeded your limit for{' '}
				<Link href="https://openrouter.ai/settings/keys">OpenRouter</Link>. (
				Used $ out of $.)
			</div>
			<div>
				<div>Switch Model (open model picker)</div>
				<div>Switch Provider (open provider picker)</div>
				<div>Learn More</div>
			</div>
		</div>
	);
}

function ApiKeyNotConfigured() {
	// TODO: Set Spend Limit

	const validationError = '';
	return (
		<div>
			<div className="mx-auto w-lg rounded-lg border border-border p-4 text-center">
				<div>"Gemini 2.5 Pro" requires an API Key to be configured.</div>
				<div className="mt-12 flex flex-row gap-2">
					<div>
						Switch Model (open model picker)
						{/* (Model Picker) */}
					</div>
					<Dialog>
						<DialogTrigger asChild>
							<Button>Connect API Key (open dialog)</Button>
						</DialogTrigger>
						<DialogContent className="w-84 rounded-4xl">
							<DialogHeader>
								<DialogTitle>Connect API Key</DialogTitle>
								<DialogDescription>
									You can connect your API Key from any of the following
									providers:
								</DialogDescription>
							</DialogHeader>
							<div className="flex flex-col gap-2">
								<Button>Google</Button>
								<Button>OpenRouter</Button>
							</div>
						</DialogContent>
					</Dialog>
				</div>
				<div>{/* Show Options - Google / OpenRouter */}</div>
			</div>
			<Dialog>
				<DialogTrigger asChild>
					<Button>Connect using OpenRouter</Button>
				</DialogTrigger>
				<DialogContent className="w-84 rounded-4xl">
					<DialogHeader>
						<DialogTitle>Connect to OpenRouter</DialogTitle>
						<DialogDescription>
							Your API Key shall securely be stored on your device.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-2">
						<Button
							className="w-full"
							// onClick={handleLinkOAuth}
							variant="shadow"
						>
							Link OpenRouter via OAuth
						</Button>
						<Button
							className="w-full"
							// onClick={handleLinkOAuth}
							variant="shadow"
						>
							Configure API Key
							{/* <div className="flex flex-col space-y-2">
							<input
								className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
								// onChange={(e) => setApiKey(e.target.value)}
								placeholder="Enter API Key"
								type="text"
								// value={apiKey}
							/>
							<Button
								className="w-full"
								// onClick={handleValidateApiKey}
								variant="default"
							>
								Validate API Key
							</Button>
						</div> */}
						</Button>
					</div>
					{validationError && (
						<p className="text-red-500 text-sm">{validationError}</p>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

function Message({ message }: { message: ChatMessage }) {
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
