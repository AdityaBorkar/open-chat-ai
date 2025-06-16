'use client';

import { TbAB, TbShare } from 'react-icons/tb';

import { MessageAssistant } from '@/components/pages/convo/messages/MessageAssistant';
import { MessageUser } from '@/components/pages/convo/messages/MessageUser';
import TypingIndicator from '@/components/pages/convo/messages/TypingIndicator';
import UserInput from '@/components/pages/convo/UserInput';
import { cn } from '@/lib/utils';

const MESSAGES = [
	{
		content:
			'how to integrate webflow with shippo using make automation webhook',
		id: '1',
		role: 'user',
		timestamp: new Date().toISOString(),
	},
	{
		content: `Integrating Webflow with Shippo using Make (formerly Integromat) and webhooks involves setting up an automated workflow that sends order details from Webflow to Shippo for label creation and shipping. Here's how to do it:  Step 1: Set Up Webflow Webhook in Make
\nLog into Webflow and go to Project Settings > Integrations.
Scroll down to Webhooks and click Add Webhook.
Select the event trigger, such as:
Order Created (for eCommerce sites)
Form Submission (if orders come via a form)
Copy the Webhook URL from Make.`,
		id: '2',
		role: 'assistant',
		timestamp: new Date().toISOString(),
	},
] as const;

type ChatMessage = (typeof MESSAGES)[number];

export default function ChatPage() {
	const messages = MESSAGES;
	const isLoading = false;
	const showRightSidebar = false;

	// <div>Token Count, Thinking Budgets, System Instructions, Memories and Personalized Information</div>
	// Attachments:
	// YouTube Video
	// Record Audio
	// Camera / Webcam
	// Share Screen

	// Stream (Gemini) - LIVE CHAT

	return (
		<div className="relative flex h-full flex-row">
			{/* <Header /> */}

			{/* Chat Controls */}
			<aside className="absolute top-4 right-8 flex items-center justify-between gap-2">
				<div className="flex flex-row rounded-full bg-white/30">
					<button className="p-2" type="button">
						<TbShare className="size-5" />
					</button>
					<button className="p-2" type="button">
						<TbAB className="size-5" />
					</button>
				</div>
				<div className="size-8 rounded-full border border-white bg-white/50 text-center text-[#7D45E4]">
					<div className="text-lg leading-[1.9]">X</div>
				</div>
			</aside>

			{/* Chat Interface */}
			<ChatInterface isLoading={isLoading} messages={messages} />

			{/* Right Sidebar */}
			{showRightSidebar && (
				<aside>{/* Document Outline / Artifacts / Bookmarks / Notes */}</aside>
			)}
		</div>
	);
}

function ChatInterface({
	messages,
	isLoading,
}: {
	messages: ChatMessage[];
	isLoading: boolean;
}) {
	return (
		<div className=" flex-1 space-y-6 overflow-auto pt-8 pb-72">
			{/* Messages */}
			<main className="mx-auto max-w-[48rem] px-4">
				{messages.map((message, index) => {
					const reply = messages[index + 1];
					if (index % 2 === 1) return null;
					return (
						<div
							className={cn(
								'mt-6 rounded-2xl bg-white/15 p-4',
								message.role === 'user' && 'ml-auto',
							)}
							key={message.id}
						>
							<MessageUser message={message} />
							{reply && <MessageAssistant message={reply} />}
							{isLoading && <TypingIndicator />}
						</div>
					);
				})}
				{/* <div ref={messagesEndRef} /> */}
			</main>

			<div className="absolute bottom-0 left-[calc(50%-24rem)] z-50 mx-auto w-[48rem]">
				{/* <ScrollToBottom /> */}
				{/* <div
					className="absolute bottom-0 h-12 w-full "
					style={{
						background:
							'linear-gradient(180deg, rgba(220, 196, 230, 0.00) 0%, #DCC4E6 100%)',
					}}
				/> */}
				<UserInput />
			</div>
		</div>
	);
}
