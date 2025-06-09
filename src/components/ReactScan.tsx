/** biome-ignore-all assist/source/organizeImports: REACT-SCAN must be imported before react */
'use client';

import { scan } from 'react-scan';

import { type JSX, useEffect } from 'react';

export function ReactScan(): JSX.Element {
	useEffect(() => {
		scan({ enabled: true });
	}, []);

	return <></>;
}
