import { atom } from 'jotai';

export const foldersAtom = atom<Folder[]>([
	{ color: 'blue', id: '1', name: 'Default' },
	{ color: 'green', id: '2', name: 'Work' },
	{ color: 'purple', id: '3', name: 'Personal' },
]);

export const conversationAtom = atom<Conversation>({
	created_at: new Date().toISOString(),
	folder_color: 'blue',
	folder_id: '1',
	folder_name: 'Default',
	id: '1',
	is_pinned: false,
	tags: ['tag1', 'tag2', 'tag3'],
	title: 'New Conversation',
	type: 'chat',
	updated_at: new Date().toISOString(),
});

export const configAtom = atom({
	statsForNerds: true,
});
