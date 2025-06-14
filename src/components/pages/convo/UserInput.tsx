import { useState } from 'react';
import {
	TbArrowUp,
	TbBrain,
	TbGlobe,
	TbMicrophone,
	TbPaperclip,
	TbTools,
	TbUser,
} from 'react-icons/tb';

import { cn } from '@/lib/utils';

export default function UserInput() {
	const isLoading = false;
	const [inputMessage, _setInputMessage] = useState('');
	const _sendMessage = () => {
		console.log('sendMessage', inputMessage);
	};

	return (
		<div className="rounded-4xl border border-border/40 bg-bg-primary/75 text-sm backdrop-blur-2xl">
			{/* (ALT + #) Assign Chat Folder */}
			{/* (ALT + M) Start / End Transcribe */}
			{/* (ALT + ENTER) Focus on Chat */}
			{/* (DELETE) Delete Chat */}
			{/* (F2) Rename Chat*/}
			{/* (!) create-model-persona */}
			{/* (@) attach/prompt/chat-thread/project/data-source */}
			{/* (~) MCP - NOT VISIBLE IN MESSAGE */}
			{/* (Tab-Space) Search / Think */}
			<textarea
				className={cn(
					'field-sizing-content max-h-64 min-h-24 resize-none px-4 pt-3 pb-2 text-base placeholder:text-text-secondary/50',
					'focus:border-transparent focus:outline-none',
				)}
				disabled={isLoading}
				// onChange={(e) => setInputMessage(e.target.value)}
				// onKeyPress={(e) =>
				// 	e.key === 'Enter' && !e.shiftKey && sendMessage()
				// }
				placeholder="Type your message..."
				value={inputMessage}
			></textarea>
			<div className="flex flex-row items-center gap-1 border-border/20 border-t px-4 pt-4 text-text-tertiary">
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
			<div className="flex flex-row items-center gap-2 px-4 pt-2 pb-4">
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
					<TbGlobe className="-mt-0.5 -ml-1 mr-1.5 inline-block size-4" />
					Research
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
	);
}
