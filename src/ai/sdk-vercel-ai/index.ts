import { generateObject, generateText, streamObject, streamText } from 'ai';

import { ModelPicker } from '@/ai/sdk-vercel-ai/model-picker';

// execute({
//     model: {
//         provider: 'google',
//         name: 'models/gemini-2.0-flash-exp'
//     }
// })

export async function execute(options: ExecuteOptions): Promise<ExecuteResult> {
	// Convert Options to Vercel AI SDK Options

	const { messages, model, stream, ...rest } = options;
	const type = 'text' as 'text' | 'object';

	const fn =
		type === 'text'
			? stream
				? streamText
				: generateText
			: stream
				? streamObject
				: generateObject;

	const _model = ModelPicker(model.provider, model.name);

	const { text } = await fn({
		messages: [
			// ! NOT SUPPORTED BY ALL MODELS
			{ content: 'You help planning travel itineraries.', role: 'system' },
			{
				content: 'Hi!',
				providerOptions: {
					// Sets a cache control breakpoint on the system message
					anthropic: { cacheControl: { type: 'ephemeral' } },
				},
				role: 'user',
			},
			{ content: 'Hello, how can I help?', role: 'assistant' },
			{
				content: {
					text: 'Where can I buy the best Currywurst in Berlin?',
					type: 'text',
				},
				role: 'user',
			},
			{
				content: [
					{
						providerOptions: {
							openai: { imageDetail: 'low' },
						},
						text: 'Describe the image in detail.',
						type: 'text',
					},
					{
						image:
							'https://github.com/vercel/ai/blob/main/examples/ai-core/data/comic-cat.png?raw=true',
						// Sets image detail configuration for image part:
						providerOptions: {
							openai: { imageDetail: 'low' },
						},
						type: 'image',
					},
				],
				role: 'user',
			},
			{
				content: [{ text: 'Hello, how can I help?', type: 'text' }],
				role: 'assistant',
			},
			{
				content: [
					{
						args: { cheese: 'Roquefort' },
						toolCallId: '12345',
						toolName: 'get-nutrition-data',
						type: 'tool-call',
					},
					// there could be more tool calls here (parallel calling)
				],
				role: 'assistant',
			},

			{
				content: [
					{
						// for models that support multi-part tool results,
						// you can include a multi-part content part:
						content: [
							{
								text: 'Here is an image of the nutrition data for the cheese:',
								type: 'text',
							},
							{
								data: fs.readFileSync('./data/roquefort-nutrition-data.png'),
								mimeType: 'image/png',
								type: 'image',
							},
						],
						result: {
							calories: 369,
							fat: 31,
							name: 'Cheese, roquefort',
							protein: 22,
						}, // needs to match the tool call id
						toolCallId: '12345',
						toolName: 'get-nutrition-data',
						type: 'tool-result',
					},
					// there could be more tool results here (parallel calling)
				],
				role: 'tool',
			},
			{
				content: [
					{
						data: fs.readFileSync('./data/roquefort.jpg'),
						mimeType: 'image/png',
						type: 'file',
					},
				],
				role: 'assistant',
			},
		],
		model: _model,
		prompt: 'What is love?',
		system:
			`You help planning travel itineraries. ` +
			`Respond to the users' request with a list ` +
			`of the best stops to make in their destination.`,
		// 	providerOptions: {
		// 		openai: {
		// 			reasoningEffort: 'low',
		// 		},
		// 	},
	});

	return { text };
}
