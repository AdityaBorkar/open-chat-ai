import { useState } from 'react';

import { MessageHistoryTable } from '@/components/pages/settings/MessageHistoryTable';
import Section from '@/components/pages/settings/Section';
import { Button } from '@/components/ui/Button';

export default function MessageHistory() {
	const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);

	const handleImport = () => {
		// Create file input element
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					try {
						const json = JSON.parse(e.target?.result as string);
						console.log('Imported data:', json);
						// TODO: Process imported data
						alert(
							'Import successful! (Demo mode - data not actually imported)',
						);
					} catch (error) {
						alert('Error parsing JSON file');
					}
				};
				reader.readAsText(file);
			}
		};
		input.click();
	};

	const handleExport = () => {
		// Mock export data
		const exportData = {
			exportedAt: new Date().toISOString(),
			messages: [
				{
					content: 'This is a sample message',
					createdAt: new Date().toISOString(),
					id: '1',
					title: 'Sample message',
				},
			],
			version: '1.0',
		};

		const blob = new Blob([JSON.stringify(exportData, null, 2)], {
			type: 'application/json',
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleDeleteSelected = () => {
		if (selectedMessageIds.length === 0) {
			alert('No messages selected');
			return;
		}

		const confirmDelete = confirm(
			`Delete ${selectedMessageIds.length} selected message(s)?`,
		);
		if (confirmDelete) {
			console.log('Deleting messages:', selectedMessageIds);
			// TODO: Implement actual deletion
			alert(`${selectedMessageIds.length} message(s) deleted (Demo mode)`);
			setSelectedMessageIds([]);
		}
	};
	return (
		<Section
			caption="Save your history as JSON, or import someone else's. Importing will NOT delete existing messages."
			title="Message History"
		>
			<div className="mb-6 flex flex-wrap gap-3">
				<Button onClick={handleImport}>Import JSON</Button>
				<Button onClick={handleExport}>Export JSON</Button>
				<Button onClick={handleDeleteSelected} variant="destructive">
					Delete Selected ({selectedMessageIds.length})
				</Button>
			</div>

			<MessageHistoryTable onSelectionChange={setSelectedMessageIds} />
		</Section>
	);
}
