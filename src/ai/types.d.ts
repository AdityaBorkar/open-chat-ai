interface Tool {
	name: string;
}

interface ExecuteOptions {
	messages: Message[];
	model: {
		name: string;
		provider: string;
	};
	response_format?: string;
	include_reasoning?: boolean;
	reasoning: string;
	structured_output?: boolean;
	tools: Tool[];
	tool_choice: string;
	model_chars: {
		max_tokens?: number;
		topK?: number;
		topP?: number;
		stop?: string;
		temperature?: number;
		presencePenalty?: number;
		frequencyPenalty?: number;
		repetitionPenalty?: number;
		minP?: number;
		topA?: number;
		logit_bias?: Record<string, number>;
		logprobs?: boolean;
		top_logprobs?: number;
		stopSequences?: string[];
		seed?: number;
		maxSteps?: number;
	};
	abortSignal?: AbortSignal;
	stream: boolean;
	maxRetries?: number;
	// https://openrouter.ai/docs/overview/models#model-object-schema
	// prompt: string;
	// system: string;
}

// https://openrouter.ai/api/v1/completions
// https://openrouter.ai/api/v1/chat/completions
// https://openrouter.ai/api/v1/generation

// [API Error Handling | OpenRouter Error Documentation | OpenRouter | Documentation](https://openrouter.ai/docs/api-reference/errors)

// We only support API Keys for now. No provisioning keys are supported.
// Store: Rate Limits, Models Linked, refresh Button, Credits
// https://openrouter.ai/api/v1/credits
// https://openrouter.ai/api/v1/auth/keys
// https://openrouter.ai/api/v1/key

// Data Retention Policy
// Data Usage for Training Policy
// https://openrouter.ai/docs/features/privacy-and-logging#data-retention--logging

interface ExecuteResult {
	text: string;
	reason: string;
	costs: string;
	stats: string;
}
