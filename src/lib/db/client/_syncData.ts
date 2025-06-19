// Sync user data from server
export async function _syncData(): Promise<void> {
	const _PerfStart = performance.now();
	// TODO: Poll for changes every 10 seconds
	// try {
	// 	const data = await fetch('/api/sync/data')
	// 		.then((res) => res.json())
	// 		.catch((err) => {
	// 			console.error('Failed to sync user data:', err);
	// 			throw new Error(
	// 				'Unable to sync user data. Please check your connection.',
	// 			);
	// 		});
	// 	console.log(data);
	// 	// Start transaction for atomic data sync
	// 	await client.waitReady;
	// 	// await client.query('BEGIN');
	// 	// try {
	// 	// 	// TODO:
	// 	// 	await client.query('COMMIT');
	// 	// 	console.log('User data synchronized successfully');
	// 	// } catch (error) {
	// 	// 	await client.query('ROLLBACK');
	// 	// 	console.error('Data sync failed, rolled back:', error);
	// 	// 	throw new Error(
	// 	// 		`Data synchronization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
	// 	// 	);
	// 	// }
	// } catch (error) {
	// 	console.error('Failed to sync user data:', error);
	// 	throw new Error('Unable to sync user data. Please check your connection.');
	// }
	const _PerfEnd = performance.now();
}
