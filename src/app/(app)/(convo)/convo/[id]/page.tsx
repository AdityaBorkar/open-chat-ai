'use client';

import { useParams } from 'next/navigation';
import { useMemo, useRef } from 'react';
import { TbAB, TbShare } from 'react-icons/tb';

import { MessageAssistant } from '@/components/pages/convo/messages/MessageAssistant';
import { MessageUser } from '@/components/pages/convo/messages/MessageUser';
import ScrollToBottom from '@/components/pages/convo/ScrollToBottom';
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
		content: `Integrating Webflow with Shippo using Make (formerly Integromat) and webhooks involves setting up an automated workflow that sends order details from Webflow to Shippo for label creation and shipping. Here's how to do it:Step 1: Set Up Webflow Webhook in Make
\nLog into Webflow and go to Project Settings > Integrations.
Scroll down to Webhooks and click Add Webhook.
Select the event trigger, such as:
Order Created (for eCommerce sites)
Form Submission (if orders come via a form)
Copy the Webhook URL from Make.`,
		id: 'l2',
		role: 'assistant',
		timestamp: new Date().toISOString(),
	},
	{
		content:
			'how to integrate webflow with shippo using make automation webhook',
		id: 'b1',
		role: 'user',
		timestamp: new Date().toISOString(),
	},
	{
		content: `Integrating Webflow with Shippo using Make (formerly Integromat) and webhooks involves setting up an automated workflow that sends order details from Webflow to Shippo for label creation and shipping. Here's how to do it:Step 1: Set Up Webflow Webhook in Make
\nLog into Webflow and go to Project Settings > Integrations.
Scroll down to Webhooks and click Add Webhook.
Select the event trigger, such as:
Order Created (for eCommerce sites)
Form Submission (if orders come via a form)
Copy the Webhook URL from Make.`,
		id: 'b2',
		role: 'assistant',
		timestamp: new Date().toISOString(),
	},
	{
		content:
			'how to integrate webflow with shippo using make automation webhook',
		id: '1e',
		role: 'user',
		timestamp: new Date().toISOString(),
	},
	{
		content: `Integrating Webflow with Shippo using Make (formerly Integromat) and webhooks involves setting up an automated workflow that sends order details from Webflow to Shippo for label creation and shipping. Here's how to do it:Step 1: Set Up Webflow Webhook in Make
\nLog into Webflow and go to Project Settings > Integrations.
Scroll down to Webhooks and click Add Webhook.
Select the event trigger, such as:
Order Created (for eCommerce sites)
Form Submission (if orders come via a form)
Copy the Webhook URL from Make.`,
		id: 'e2',
		role: 'assistant',
		timestamp: new Date().toISOString(),
	},
	{
		content:
			'how to integrate webflow with shippo using make automation webhook',
		id: '1q',
		role: 'user',
		timestamp: new Date().toISOString(),
	},
	{
		content: `Integrating Webflow with Shippo using Make (formerly Integromat) and webhooks involves setting up an automated workflow that sends order details from Webflow to Shippo for label creation and shipping. Here's how to do it:Step 1: Set Up Webflow Webhook in Make
\nLog into Webflow and go to Project Settings > Integrations.
Scroll down to Webhooks and click Add Webhook.
Select the event trigger, such as:
Order Created (for eCommerce sites)
Form Submission (if orders come via a form)
Copy the Webhook URL from Make.`,
		id: '2q',
		role: 'assistant',
		timestamp: new Date().toISOString(),
	},
] as const;

export default function ChatPage() {
	const { id } = useParams();
	const { isPending, data: messages } = {
		data: [] as (typeof MESSAGES)[number][], // MESSAGES
		isPending: false,
	};

	const IsMessagesEmpty = useMemo(() => messages.length === 0, [messages]);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	// <div>Token Count, Thinking Budgets, System Instructions, Memories and Personalized Information</div>
	// Attachments:
	// YouTube Video
	// Record Audio
	// Camera / Webcam
	// Share Screen
	// Stream (Gemini) - LIVE CHAT

	if (isPending) {
		return <div>Loading...</div>;
	}
	return (
		<div className="relative flex h-full flex-row">
			{/* Header */}
			{id && <ChatHeader />}

			{/* Messages */}
			<main className="mx-auto max-w-[48rem] px-4">
				{IsMessagesEmpty && <ChatPlaceholder />}
				{messages.map((message, index) => {
					const reply = messages[index + 1];
					if (index % 2 === 1) {
						return null;
					}
					return (
						<div
							className={cn(
								'mt-6 rounded-2xl bg-white/15 p-4',
								message.role === 'user' && 'ml-auto',
							)}
							key={message.id}
						>
							<MessageUser
								message={
									message as unknown as Parameters<
										typeof MessageUser
									>[0]['message']
								}
							/>
							{reply && (
								<MessageAssistant
									message={
										reply as unknown as Parameters<
											typeof MessageAssistant
										>[0]['message']
									}
								/>
							)}
							{/* {isLoading && <TypingIndicator />} */}
						</div>
					);
				})}
				<div ref={messagesEndRef} />
			</main>

			{/* User Input */}
			<div className="absolute bottom-8 left-[calc(50%-24rem)] z-30 mx-auto w-[48rem]">
				<ScrollToBottom messagesEndRef={messagesEndRef} />
				<UserInput />
			</div>
		</div>
	);
}

function ChatPlaceholder() {
	return (
		<div className="flex min-h-full items-center justify-center pb-[20vh]">
			<h1 className="font-bold text-2xl text-text-secondary/50">
				Empty Chat Placeholder
			</h1>
		</div>
	);
}

function ChatHeader() {
	return (
		<aside className="absolute top-4 right-8 flex items-center justify-between gap-2">
			<div className="flex flex-row rounded-full bg-white/30">
				<button className="p-2" type="button">
					<TbShare className="size-5" />
				</button>
				<button className="p-2" type="button">
					<TbAB className="size-5" />
				</button>
			</div>
		</aside>
	);
}

// function Chat_Right() {
// 	return (
// 		<div className="flex flex-1 flex-col items-center justify-center">
// 			{/* Document Outline / Artifacts / Bookmarks / Notes */}
// 		</div>
// 	);
// }
