import { ArkErrors, type } from 'arktype';

const _NewConversation = type({
	'folderId?': 'string',
	tags: 'string[]',
	type: 'string',
});

export async function createConvo() {
	// TODO: Generate Temporary ID
	// TODO: Stream Response from the API
	// const _id = crypto.randomUUID();

	return {
		success: true,
	};
}

export async function $createConvo({
	convo,
	// question,
}: {
	convo: string;
	// question: string;
}) {
	'use server';
	// const userId = 'get from better-auth';

	let convoData = _NewConversation(convo);
	if (convoData instanceof ArkErrors) {
		convoData = { folderId: undefined, tags: [], type: 'chat' };
	}

	// db.insert(conversations).values({ id: createId(), ...convo_data, userId });

	// TODO: Resumable Stream
	// '/api/chat/ID' = Return 2 Streams {title, response}
	const title = 'auto-generate. if error return question';
	const response = 'auto-generate'; // TODO: SSR = true

	return { response, success: true, title };
}
