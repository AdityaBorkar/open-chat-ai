'use client';

import { useEffect, useState } from 'react';

import { client } from '@/lib/db/client';

export function WorkerStatus() {
	const [isLeader, setIsLeader] = useState(false);
	const [tabId] = useState(() => Math.random().toString(36).substring(7));

	useEffect(() => {
		// Set initial leader state
		setIsLeader(client.isLeader);

		// Subscribe to leader changes
		const unsubscribe = client.onLeaderChange(() => {
			setIsLeader(client.isLeader);
		});

		return unsubscribe;
	}, []);

	const testQuery = async () => {
		try {
			const result = await client.query('SELECT 1 as test');
			console.log('Query result:', result);
		} catch (error) {
			console.error('Query failed:', error);
		}
	};

	return (
		<div className="rounded-lg border bg-gray-50 p-4 dark:bg-gray-800">
			<h3 className="mb-2 font-semibold">PGlite Worker Status</h3>
			<div className="space-y-2 text-sm">
				<div>
					<span className="font-medium">Tab ID:</span> {tabId}
				</div>
				<div>
					<span className="font-medium">Is Leader:</span>{' '}
					<span className={isLeader ? 'text-green-600' : 'text-gray-600'}>
						{isLeader ? '✓ Leader' : '✗ Follower'}
					</span>
				</div>
				<button
					className="rounded bg-blue-500 px-3 py-1 text-white text-xs hover:bg-blue-600"
					onClick={testQuery}
					type="button"
				>
					Test Query
				</button>
			</div>
			<p className="mt-2 text-gray-500 text-xs">
				Open multiple tabs to see leader election in action
			</p>
		</div>
	);
}
