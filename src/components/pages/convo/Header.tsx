import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
	TbBook2,
	TbChartBar,
	TbChevronDown,
	TbDotsVertical,
	TbFolderPlus,
	TbShare,
} from 'react-icons/tb';
import { toast } from 'sonner';

import { sidebarAtom } from '@/app/(app)/atoms';
import { Button } from '@/components/ui/Button';
// import {
// 	Command,
// 	CommandEmpty,
// 	CommandGroup,
// 	CommandInput,
// 	CommandItem,
// 	CommandList,
// } from '@/components/ui/command';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { configAtom, conversationAtom } from './atoms';

export function Header() {
	const { statsForNerds } = useAtomValue(configAtom);
	const { open } = useAtomValue(sidebarAtom);
	const conversation = useAtomValue(conversationAtom);
	// const [folders] = useAtom(foldersAtom);
	const router = useRouter();
	const [exportOpen, setExportOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [exportFormat, setExportFormat] = useState('md');
	const [folderOpen, setFolderOpen] = useState(false);

	const handleExport = async () => {
		try {
			const response = await fetch(
				`/api/conversations/${conversation.id}/export`,
				{
					body: JSON.stringify({ format: exportFormat }),
					headers: { 'Content-Type': 'application/json' },
					method: 'POST',
				},
			);

			if (response.ok) {
				const blob = await response.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `conversation-${conversation.id}.${exportFormat}`;
				a.click();
				URL.revokeObjectURL(url);
				toast('Conversation exported successfully');
			} else {
				toast('Failed to export conversation');
			}
		} catch (_error) {
			toast('Error exporting conversation');
		}
		setExportOpen(false);
	};

	// const _handleFolderChange = (folderId: string) => {
	// 	const folder = folders.find((f) => f.id === folderId);
	// 	if (folder) {
	// 		// Update conversation atom with new folder
	// 		toast(`Moved to ${folder.name} folder`);
	// 	}
	// };

	// const handleCreateFolder = (folderName: string) => {
	// 	const newFolder: Folder = {
	// 		color: 'gray',
	// 		id: Date.now().toString(),
	// 		name: folderName,
	// 	};
	// 	setFolders([...folders, newFolder]);
	// 	handleFolderChange(newFolder.id);
	// };

	return (
		<header
			className={cn(
				'sticky top-0 z-10 flex w-full flex-row items-center gap-1 border-border/50 border-b bg-bg-secondary/20 px-6 py-1.5 text-sm text-text-secondary',
				!open && 'pt-3 pb-2.5 pl-48',
			)}
		>
			<Popover onOpenChange={setFolderOpen} open={folderOpen}>
				<PopoverTrigger asChild={true}>
					<Button
						className="flex items-center gap-2 px-2 py-1.5 text-text-secondary hover:bg-bg-tertiary"
						variant="compact"
					>
						<TbFolderPlus className="size-4" />
						{conversation.folder_name}
						<TbChevronDown className="size-3" />
					</Button>
				</PopoverTrigger>
				<PopoverContent align="start" className="w-64 p-0">
					{/* <Command>
						<CommandInput placeholder="Search folders..." />
						<CommandList>
							<CommandEmpty>
								<div className="p-4 text-center text-sm text-text-secondary">
									No folders found.
								</div>
							</CommandEmpty>
							<CommandGroup>
								{folders.map((folder) => (
									<CommandItem
										key={folder.id}
										onSelect={() => {
											handleFolderChange(folder.id);
											setFolderOpen(false);
										}}
									>
										<TbCheck
											className={cn(
												'mr-2 h-4 w-4',
												conversation.folder_id === folder.id
													? 'opacity-100'
													: 'opacity-0',
											)}
										/>
										<div className="flex items-center gap-2">
											<div
												className={cn(
													'h-2 w-2 rounded-full',
													folder.color === 'blue' && 'bg-blue-500',
													folder.color === 'green' && 'bg-green-500',
													folder.color === 'purple' && 'bg-purple-500',
													folder.color === 'gray' && 'bg-gray-500',
												)}
											/>
											{folder.name}
										</div>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command> */}
				</PopoverContent>
			</Popover>
			<span className="text-lg text-text-secondary">/</span>
			<input
				className="w-fit rounded-lg px-2 py-1.5 font-semibold text-text-secondary focus:bg-bg-tertiary focus:outline-none"
				defaultValue={conversation.title}
			/>
			{/* <div className="">
				{conversation.tags.map((tag) => (
					<span
						className="mr-1 h-fit rounded-full border border-border/50 bg-bg-secondary px-2 py-1"
						key={tag}
					>
						#{tag}
					</span>
				))}
			</div> */}

			<div className="grow" />
			{/* <div>Temporary Mode / Incognito Mode</div> */}
			<div className={cn('flex flex-row gap-2', !open && 'pr-4')}>
				{statsForNerds && (
					<Button className="block size-8 p-0" variant="shadow">
						<TbBook2 className="mx-auto size-4" />
					</Button>
				)}
				{statsForNerds && (
					<Button className="block size-8 p-0" variant="shadow">
						<TbChartBar className="mx-auto size-4 " />
					</Button>
				)}
				<Button className="block size-8 p-0" variant="shadow">
					<TbShare className="mx-auto size-4" />
				</Button>
				<Popover>
					<PopoverTrigger asChild={true}>
						<Button className="block size-8 p-0" variant="shadow">
							<TbDotsVertical className="mx-auto size-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent align="end" className="w-36 p-1">
						<div className="flex flex-col">
							<Button
								className="justify-start"
								onClick={() => setExportOpen(true)}
								variant="compact"
							>
								Export
							</Button>
							<Button
								className="justify-start"
								onClick={async () => {
									try {
										await fetch(
											`/api/conversations/${conversation.id}/archive`,
											{
												method: 'POST',
											},
										);
										toast('Conversation archived');
										// router.push('/');
									} catch (_error) {
										toast('Failed to archive conversation');
									}
								}}
								variant="compact"
							>
								Archive
							</Button>
							<Button
								className="justify-start text-red-600 hover:text-red-700"
								onClick={() => setDeleteOpen(true)}
								variant="compact"
							>
								Delete
							</Button>
						</div>
					</PopoverContent>
				</Popover>
			</div>

			{/* Export format dialog */}
			<Dialog onOpenChange={setExportOpen} open={exportOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Select export format</DialogTitle>
						<DialogDescription>
							Choose a format to export this conversation.
						</DialogDescription>
					</DialogHeader>
					<RadioGroup
						className="space-y-2"
						onValueChange={setExportFormat}
						value={exportFormat}
					>
						{[
							{ label: 'Markdown', value: 'md' },
							{ label: 'PDF', value: 'pdf' },
							{ label: 'Word Document', value: 'docx' },
							{ label: 'JSON', value: 'json' },
						].map((format) => (
							<div className="flex items-center space-x-2" key={format.value}>
								<RadioGroupItem
									id={`format-${format.value}`}
									value={format.value}
								/>
								<label
									className="font-medium text-sm"
									htmlFor={`format-${format.value}`}
								>
									{format.label}
								</label>
							</div>
						))}
					</RadioGroup>
					<DialogFooter>
						<Button onClick={() => setExportOpen(false)} variant="compact">
							Cancel
						</Button>
						<Button onClick={handleExport}>Export</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete confirmation dialog */}
			<Dialog onOpenChange={setDeleteOpen} open={deleteOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm deletion</DialogTitle>
						<DialogDescription>
							This action cannot be undone. Are you sure you want to delete this
							conversation?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button onClick={() => setDeleteOpen(false)} variant="compact">
							Cancel
						</Button>
						<Button
							onClick={async () => {
								try {
									await fetch(`/api/conversations/${conversation.id}`, {
										method: 'DELETE',
									});
									toast('Conversation deleted');
									router.push('/');
								} catch (_error) {
									toast('Failed to delete conversation');
								}
							}}
							variant="destructive"
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</header>
	);
}
