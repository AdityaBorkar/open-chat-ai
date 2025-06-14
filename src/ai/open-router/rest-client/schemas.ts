import { type } from 'arktype';

export const schemas = {
	'/key': {
		request: undefined,
		response: type({
			data: {
				is_free_tier: 'boolean',
				is_provisioning_key: 'boolean',
				label: 'string',
				limit: 'number',
				limit_remaining: 'number',
				usage: 'number',
			},
		}),
	},
};
