// Credential Management API TypeScript definitions
// These are needed because the API is not fully supported in default TypeScript types

interface FederatedCredentialInit {
	id: string;
	provider: string;
	name?: string;
	iconURL?: string;
}

interface FederatedCredential extends Credential {
	readonly provider: string;
	readonly name?: string;
	readonly iconURL?: string;
}

declare var FederatedCredential: {
	prototype: FederatedCredential;
	new (init: FederatedCredentialInit): FederatedCredential;
};

interface CredentialRequestOptions {
	mediation?: 'optional' | 'required' | 'silent';
	signal?: AbortSignal;
	federated?: {
		providers: string[];
	};
}

interface NavigatorCredentials {
	get(options?: CredentialRequestOptions): Promise<Credential | null>;
	store(credential: Credential): Promise<Credential>;
	create(options: any): Promise<Credential>;
}

interface Navigator {
	credentials: NavigatorCredentials;
}
