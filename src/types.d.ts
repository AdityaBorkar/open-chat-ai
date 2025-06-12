type ChatType = 'chat' | 'create' | 'talk' | 'live' | 'assist';

interface Folder {
	id: string;
	name: string;
	color: string;
}

interface Conversation {
	id: string;
	type: ChatType;
	title: string;
	created_at: string;
	updated_at: string;
	is_pinned: boolean;
	folder_id: string;
	folder_name: string;
	folder_color: string;
	tags: string[];
}

interface Message {
	id: string;
	content: string;
	role: 'user' | 'assistant';
	timestamp: string;
}
