import { createHash } from 'node:crypto';

export function generateChecksum(data: string) {
	return createHash('sha256').update(data).digest('hex');
}
