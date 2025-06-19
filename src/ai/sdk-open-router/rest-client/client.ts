import { type } from 'arktype';

import { schemas } from '@/ai/sdk-open-router/rest-client/schemas';

const BASE_URL = 'https://openrouter.ai/api/v1';

export default class OpenRouterClient {
	private readonly apiKey: string;

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	async get<PathType extends keyof typeof schemas>(
		path: PathType,
	): Promise<(typeof schemas)[PathType]['response']['infer']> {
		// Prepare
		const schema = schemas[path];

		// Validate Input
		// TODO: Validate Body / Search Params
		// const input_data = schema.request
		// 	? schema.request(options.body)
		// 	: undefined;

		// Fetch
		const response = await fetch(`${BASE_URL}${path}`, {
			headers: { Authorization: `Bearer ${this.apiKey}` },
			method: 'GET',
		});

		// Validate Output
		const rawData = await response.json();
		const parseJson = type('string.json.parse').to(schema.response);
		const data = parseJson(rawData);
		if (data instanceof type.errors) {
			throw new Error(data.summary);
		}
		return data;
	}
}
