import Section from '@/components/pages/settings/Section';
import { Button } from '@/components/ui/Button';

export default function DangerZone() {
	const handleClearAll = () => {
		const confirmClear = confirm(
			'This will permanently delete all your chat history. This action cannot be undone. Are you sure?',
		);
		if (confirmClear) {
			console.log('Clearing all history');
			// TODO: Implement actual clearing
			alert('All history cleared (Demo mode)');
		}
	};
	return (
		<Section
			caption="Permanent actions that cannot be undone. Use with caution."
			title="Danger Zone"
		>
			<div className="flex items-center justify-between">
				<div>Automatically delete chats</div>
				<div>older than 30 days</div>
			</div>
			<div className="pt-4">
				<Button onClick={handleClearAll} type="button" variant="destructive">
					Clear All History
				</Button>
				<p className="mt-2 text-text-tertiary text-xs">
					*The retention policies of our LLM hosting partners may vary.
				</p>
			</div>
		</Section>
	);
}
