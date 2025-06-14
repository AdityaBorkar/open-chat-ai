import { google } from '@ai-sdk/google';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

export function ModelPicker(provider: string, model: string) {
	if (provider === 'openrouter') {
		const apiKey = 'ok-1234567890';
		return createOpenRouter({ apiKey })(model);
	}

	if (provider === 'google') {
		return google(model);
	}

	throw new Error(`Provider ${provider} not supported`);
}
//
