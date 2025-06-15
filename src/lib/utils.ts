import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function generateChecksum(data: string) {
	const textAsBuffer = new TextEncoder().encode(data);
	const hashBuffer = await window.crypto.subtle.digest('SHA-256', textAsBuffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hash = hashArray
		.map((item) => item.toString(16).padStart(2, '0'))
		.join('');
	return hash;
}
