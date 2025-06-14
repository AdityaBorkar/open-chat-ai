'use client';

import { Plus, Sparkles, Star } from 'lucide-react';
import { useState } from 'react';
import { TbFileTextAi } from 'react-icons/tb';

interface Prompt {
	id: string;
	title: string;
	description: string;
	category: string;
	isStarred: boolean;
	usageCount: number;
}

const samplePrompts: Prompt[] = [
	{
		category: 'Development',
		description: 'Review code for best practices and improvements',
		id: '1',
		isStarred: true,
		title: 'Code Review',
		usageCount: 45,
	},
	{
		category: 'Business',
		description: 'Write professional emails for any occasion',
		id: '2',
		isStarred: false,
		title: 'Email Writer',
		usageCount: 32,
	},
	{
		category: 'Creative',
		description: 'Generate creative stories and narratives',
		id: '3',
		isStarred: true,
		title: 'Creative Story',
		usageCount: 28,
	},
];

export function PromptsSection() {
	const [isExpanded, setIsExpanded] = useState(false);
	const [prompts] = useState<Prompt[]>(samplePrompts);

	const toggleStarred = (promptId: string) => {
		// In a real app, this would update the database
		console.log(`Toggle starred for prompt ${promptId}`);
	};

	// const usePrompt = (prompt: Prompt) => {
	// 	// In a real app, this would apply the prompt to the chat
	// 	console.log(`Using prompt: ${prompt.title}`);
	// };

	return (
		<div className="relative">
			<button
				className="w-full rounded-lg bg-pink-800 p-2 transition-all"
				onClick={() => setIsExpanded(!isExpanded)}
				type="button"
			>
				<div className="flex items-center gap-3">
					<div className="size-6 rounded-lg ">
						<TbFileTextAi className="text-white" size={18} />
					</div>
					<div className="flex-1 text-left">
						<div className="font-medium text-sm text-white">Prompts</div>
					</div>
				</div>
			</button>

			{/* Expanded Prompts List */}
			{isExpanded && (
				<div className="absolute top-full left-0 z-10 mt-2 w-full rounded-lg border border-pink-800/50 bg-gradient-to-b from-pink-950/95 to-purple-950/95 backdrop-blur-sm">
					<div className="p-3">
						<div className="mb-3 flex items-center justify-between">
							<h3 className="font-medium text-sm text-white">Quick Prompts</h3>
							<button
								className="text-pink-300/70 text-xs transition-colors hover:text-pink-200"
								type="button"
							>
								View All
							</button>
						</div>

						<div className="max-h-80 space-y-2 overflow-y-auto">
							{prompts.map((prompt) => (
								<div
									className="group rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:bg-white/10"
									key={prompt.id}
								>
									<div className="flex items-start justify-between">
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2">
												<h4 className="truncate font-medium text-sm text-white">
													{prompt.title}
												</h4>
												<span className="rounded-full bg-white/20 px-2 py-0.5 font-medium text-pink-200 text-xs">
													{prompt.category}
												</span>
											</div>
											<p className="mt-1 line-clamp-2 text-pink-200/70 text-xs">
												{prompt.description}
											</p>
											<div className="mt-2 flex items-center gap-3 text-pink-300/60 text-xs">
												<span className="flex items-center gap-1">
													<Sparkles size={12} />
													{prompt.usageCount} uses
												</span>
											</div>
										</div>
										<div className="ml-3 flex flex-col gap-1">
											<button
												className={`rounded p-1 transition-colors ${
													prompt.isStarred
														? 'text-yellow-400 hover:text-yellow-300'
														: 'text-pink-300/40 hover:text-yellow-400'
												}`}
												onClick={() => toggleStarred(prompt.id)}
												type="button"
											>
												<Star
													fill={prompt.isStarred ? 'currentColor' : 'none'}
													size={14}
												/>
											</button>
											<button
												className="rounded bg-gradient-to-r from-purple-600 to-pink-600 p-1.5 text-white transition-all hover:from-purple-500 hover:to-pink-500"
												// onClick={() => usePrompt(prompt)}
												type="button"
											>
												<Plus size={12} />
											</button>
										</div>
									</div>
								</div>
							))}
						</div>

						<div className="mt-3 border-pink-800/50 border-t pt-3">
							<button
								className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-2 text-center font-medium text-sm text-white transition-all hover:from-blue-500 hover:to-purple-500"
								type="button"
							>
								Create New Prompt
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
