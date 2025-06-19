'use client';

import { useEffect, useState } from 'react';

export function useNetworkStatus() {
	const [online, setOnline] = useState(true);
	useEffect(() => {
		setOnline(navigator.onLine);
	}, []);
	return { online };
}
