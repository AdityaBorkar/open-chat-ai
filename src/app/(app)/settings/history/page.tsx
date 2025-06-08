'use client';

import DangerZone from '@/app/(app)/settings/history/sections/DangerZone';
import MessageHistory from '@/app/(app)/settings/history/sections/MessageHistory';

export default function HistoryPage() {
	return (
		<div className="space-y-16">
			<MessageHistory />
			<DangerZone />
		</div>
	);
}
