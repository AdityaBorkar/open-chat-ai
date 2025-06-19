import OpenRouterClient from '@/ai/sdk-open-router/rest-client/client';

export async function validateApiKey(apiKey: string) {
	const client = new OpenRouterClient(apiKey);

	const data = await client.get('/key').catch((err) => {
		if (err.message.includes('401')) {
			return {
				error: 'Invalid API Key',
			};
		}
		return {
			error: 'Issue in connecting with OpenRouter Server',
		};
	});

	if ('error' in data) {
		return data;
	}
	if (data.data.is_provisioning_key) {
		return {
			error: 'API Key is a Provisioning Key. Kindly use a different API Key.',
		};
	}
	return data.data;
}
