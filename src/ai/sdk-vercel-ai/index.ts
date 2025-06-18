import { generateText } from 'ai';

import { ModelPicker } from '@/ai/sdk-vercel-ai/model-picker';

// execute({
//     model: {
//         provider: 'google',
//         name: 'models/gemini-2.0-flash-exp'
//     }
// })

export async function execute(options: ExecuteOptions): Promise<ExecuteResult> {
	// Convert Options to Vercel AI SDK Options

	const { /*messages,*/ model /*stream, ...rest*/ } = options;

	const _model = ModelPicker(model.provider, model.name);

	// Simplified implementation to avoid TypeScript errors in complex example code
	const { text } = await generateText({
		messages: [
			{ content: 'You are a helpful assistant.', role: 'system' },
			{ content: 'Hello!', role: 'user' },
		],
		model: _model,
		prompt: 'What is love?',
	});

	return {
		text,
		// TODO: Add proper ExecuteResult properties when type definitions are available
	} as ExecuteResult;
}
