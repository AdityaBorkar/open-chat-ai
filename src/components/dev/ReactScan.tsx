/** biome-ignore-all assist/source/organizeImports: REACT-SCAN must be imported before react */
'use client';

import { scan } from 'react-scan';

import { useEffect } from 'react';

export function ReactScan() {
	useEffect(() => {
		scan({
			dangerouslyForceRunInProduction: true,
			enabled: true,
		});
	}, []);

	return null;
}
