'use client';

import { useState } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/Checkbox';

interface Message {
	id: string;
	title: string;
	isPinned: boolean;
	isArchived: boolean;
	createdAt: Date;
}

// Mock data
const mockMessages: Message[] = [
	{
		createdAt: new Date('2024-01-15T10:30:00'),
		id: '1',
		isArchived: false,
		isPinned: true,
		title: 'How to implement authentication in Next.js',
	},
	{
		createdAt: new Date('2024-01-14T15:45:00'),
		id: '2',
		isArchived: false,
		isPinned: false,
		title: 'React performance optimization techniques',
	},
	{
		createdAt: new Date('2024-01-10T09:20:00'),
		id: '3',
		isArchived: true,
		isPinned: false,
		title: 'Database design patterns',
	},
	{
		createdAt: new Date('2024-01-12T14:15:00'),
		id: '4',
		isArchived: false,
		isPinned: true,
		title: 'TypeScript best practices and tips',
	},
	{
		createdAt: new Date('2024-01-13T11:00:00'),
		id: '5',
		isArchived: false,
		isPinned: false,
		title: 'CSS Grid vs Flexbox comparison',
	},
];

interface MessageHistoryTableProps {
	onSelectionChange?: (selectedIds: string[]) => void;
}

export function MessageHistoryTable({
	onSelectionChange,
}: MessageHistoryTableProps) {
	const [selectedMessages, setSelectedMessages] = useState<Set<string>>(
		new Set(),
	);

	const handleSelectAll = () => {
		const allIds = new Set(mockMessages.map((msg) => msg.id));
		setSelectedMessages(allIds);
		onSelectionChange?.(Array.from(allIds));
	};

	const handleUnselectAll = () => {
		setSelectedMessages(new Set());
		onSelectionChange?.([]);
	};

	const handleMessageSelect = (messageId: string, checked: boolean) => {
		const newSelected = new Set(selectedMessages);
		if (checked) {
			newSelected.add(messageId);
		} else {
			newSelected.delete(messageId);
		}
		setSelectedMessages(newSelected);
		onSelectionChange?.(Array.from(newSelected));
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			month: 'short',
			year: 'numeric',
		});
	};

	return (
		<div className="space-y-4">
			{/* Action buttons */}
			<div className="flex gap-3">
				<button
					className="rounded-md bg-bg-tertiary px-3 py-1.5 text-text-secondary text-xs transition-colors hover:bg-bg-secondary"
					onClick={handleSelectAll}
					type="button"
				>
					Select All
				</button>
				<button
					className="rounded-md bg-bg-tertiary px-3 py-1.5 text-text-secondary text-xs transition-colors hover:bg-bg-secondary"
					onClick={handleUnselectAll}
					type="button"
				>
					Unselect All
				</button>
				{selectedMessages.size > 0 && (
					<span className="flex items-center text-text-tertiary text-xs">
						{selectedMessages.size} selected
					</span>
				)}
			</div>

			{/* Table */}
			<div className="overflow-hidden rounded-lg border border-border-primary bg-bg-secondary">
				<table className="w-full">
					<thead className="bg-bg-tertiary">
						<tr>
							<th className="w-12 px-4 py-3 text-left">
								<span className="sr-only">Select</span>
							</th>
							<th className="px-4 py-3 text-left font-medium text-text-secondary text-xs uppercase tracking-wider">
								Title
							</th>
							<th className="px-4 py-3 text-left font-medium text-text-secondary text-xs uppercase tracking-wider">
								Status
							</th>
							<th className="px-4 py-3 text-left font-medium text-text-secondary text-xs uppercase tracking-wider">
								Date
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border-secondary">
						{mockMessages.map((message) => (
							<tr
								className={`transition-colors hover:bg-bg-tertiary ${
									selectedMessages.has(message.id) ? 'bg-bg-tertiary' : ''
								}`}
								key={message.id}
							>
								<td className="px-4 py-3">
									<Checkbox
										aria-label={`Select message: ${message.title}`}
										checked={selectedMessages.has(message.id)}
										onChange={(e) =>
											handleMessageSelect(message.id, e.target.checked)
										}
									/>
								</td>
								<td className="px-4 py-3">
									<div className="max-w-md truncate font-medium text-sm text-text-primary">
										{message.title}
									</div>
								</td>
								<td className="px-4 py-3">
									<div className="flex gap-1">
										{message.isPinned && <Badge variant="pinned">Pinned</Badge>}
										{message.isArchived && (
											<Badge variant="archived">Archived</Badge>
										)}
										{!(message.isPinned || message.isArchived) && (
											<span className="text-text-tertiary text-xs">—</span>
										)}
									</div>
								</td>
								<td className="px-4 py-3">
									<span className="text-sm text-text-secondary">
										{formatDate(message.createdAt)}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{mockMessages.length === 0 && (
				<div className="py-8 text-center text-text-tertiary">
					No messages found
				</div>
			)}
		</div>
	);
}
