import OpenAI from 'openai';

const REFERRER_HEADERS = {
	'HTTP-Referer': 'https://www.open-convo.ai',
	'X-Title': 'Open Convo',
};

const openai = new OpenAI({
	apiKey: '<OPENROUTER_API_KEY>',
	baseURL: 'https://openrouter.ai/api/v1',
	defaultHeaders: REFERRER_HEADERS,
});

export async function GET(/*_request: Request*/) {
	const completion = await openai.chat.completions.create({
		messages: [
			{
				content: 'What is the meaning of life?',
				role: 'user',
			},
		],
		model: 'openai/gpt-4o',
	});

	console.log(completion.choices[0].message);

	return new Response('Hello, world!');
}

// TODO: SERVER WILL HAVE ALL PROVIDERS
// SCHEMA FROM CLIENT TO RECEIVE INFORMATION
// SCHEMA FROM SERVER TO SEND INFORMATION

// TODO: Rate limit five requests per 30 seconds or anything that is reasonable
// TODO: Implement CAPTCHA on New Chat Button

// TODo: NO DATABASE WRITES UNTIL USER IS LINKED
