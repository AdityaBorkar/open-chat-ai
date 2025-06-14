'use client';

import { ChevronRight, Clock, FolderOpen, Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { TbBriefcase } from 'react-icons/tb';

interface Project {
	id: string;
	name: string;
	description: string;
	status: 'active' | 'completed' | 'on-hold';
	lastAccessed: string;
	collaborators: number;
	chatCount: number;
}

const sampleProjects: Project[] = [
	{
		chatCount: 12,
		collaborators: 3,
		description: 'Building a modern shopping platform',
		id: '1',
		lastAccessed: '2 hours ago',
		name: 'E-commerce App',
		status: 'active',
	},
	{
		chatCount: 8,
		collaborators: 1,
		description: 'Creating comprehensive AI guides',
		id: '2',
		lastAccessed: '1 day ago',
		name: 'AI Documentation',
		status: 'active',
	},
	{
		chatCount: 15,
		collaborators: 2,
		description: 'UI/UX design for mobile app',
		id: '3',
		lastAccessed: '3 days ago',
		name: 'Mobile Design',
		status: 'completed',
	},
];

export function ProjectsSection() {
	const [isExpanded, setIsExpanded] = useState(false);
	const [projects] = useState<Project[]>(sampleProjects);

	const getStatusColor = (status: Project['status']) => {
		switch (status) {
			case 'active':
				return 'bg-green-500';
			case 'completed':
				return 'bg-blue-500';
			case 'on-hold':
				return 'bg-yellow-500';
			default:
				return 'bg-gray-500';
		}
	};

	const getStatusText = (status: Project['status']) => {
		switch (status) {
			case 'active':
				return 'Active';
			case 'completed':
				return 'Done';
			case 'on-hold':
				return 'Paused';
			default:
				return 'Unknown';
		}
	};

	const openProject = (project: Project) => {
		console.log(`Opening project: ${project.name}`);
	};

	return (
		<div className="relative">
			<button
				className="w-full rounded-lg bg-gradient-to-r from-pink-950/80 to-purple-950/80 p-4 transition-all hover:from-pink-900/80 hover:to-purple-900/80"
				onClick={() => setIsExpanded(!isExpanded)}
				type="button"
			>
				<div className="flex items-center gap-3">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-red-500">
						<TbBriefcase className="text-white" size={18} />
					</div>
					<div className="flex-1 text-left">
						<div className="font-medium text-sm text-white">Projects</div>
						<div className="text-pink-200/70 text-xs">
							{projects.length} active
						</div>
					</div>
					<div className="flex items-center gap-2">
						<button
							className="rounded-md p-1 transition-colors hover:bg-white/20"
							onClick={(e) => {
								e.stopPropagation();
								// Open create project modal
							}}
							type="button"
						>
							<Plus className="text-pink-200/70" size={16} />
						</button>
						<ChevronRight
							className={`text-pink-200/70 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
							size={16}
						/>
					</div>
				</div>
			</button>

			{/* Expanded Projects List */}
			{isExpanded && (
				<div className="absolute top-full left-0 z-10 mt-2 w-full rounded-lg border border-pink-800/50 bg-gradient-to-b from-pink-950/95 to-purple-950/95 backdrop-blur-sm">
					<div className="p-3">
						<div className="mb-3 flex items-center justify-between">
							<h3 className="font-medium text-sm text-white">
								Recent Projects
							</h3>
							<button
								className="text-pink-300/70 text-xs transition-colors hover:text-pink-200"
								type="button"
							>
								View All
							</button>
						</div>

						<div className="max-h-80 space-y-2 overflow-y-auto">
							{projects.map((project) => (
								<button
									className="group w-full rounded-lg border border-white/10 bg-white/5 p-3 text-left transition-all hover:bg-white/10"
									key={project.id}
									onClick={() => openProject(project)}
									type="button"
								>
									<div className="flex items-start justify-between">
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2">
												<h4 className="truncate font-medium text-sm text-white">
													{project.name}
												</h4>
												<div className="flex items-center gap-1">
													<div
														className={`h-2 w-2 rounded-full ${getStatusColor(project.status)}`}
													></div>
													<span className="text-pink-200/70 text-xs">
														{getStatusText(project.status)}
													</span>
												</div>
											</div>
											<p className="mt-1 line-clamp-1 text-pink-200/70 text-xs">
												{project.description}
											</p>
											<div className="mt-2 flex items-center gap-4 text-pink-300/60 text-xs">
												<span className="flex items-center gap-1">
													<Clock size={12} />
													{project.lastAccessed}
												</span>
												<span className="flex items-center gap-1">
													<Users size={12} />
													{project.collaborators}
												</span>
												<span className="flex items-center gap-1">
													<FolderOpen size={12} />
													{project.chatCount} chats
												</span>
											</div>
										</div>
										<div className="ml-3 opacity-0 transition-opacity group-hover:opacity-100">
											<ChevronRight className="text-pink-300/70" size={16} />
										</div>
									</div>
								</button>
							))}
						</div>

						<div className="mt-3 border-pink-800/50 border-t pt-3">
							<button
								className="w-full rounded-lg bg-gradient-to-r from-orange-600 to-red-600 p-2 text-center font-medium text-sm text-white transition-all hover:from-orange-500 hover:to-red-500"
								type="button"
							>
								Create New Project
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
