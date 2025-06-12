import { atom } from 'jotai';

import { SIDEBAR_DEFAULT_WIDTH } from '@/lib/constants';

export const sidebarAtom = atom({
	open: true,
	width: SIDEBAR_DEFAULT_WIDTH,
}); // TODO: Read, Write, Sync with Local-DB

export const userAtom = atom({
	avatarUrl: '/profile-image-temp.jpg',
	name: 'John Doe',
	plan: 'Free',
}); // TODO: Read, Write, Sync with Local-DB
