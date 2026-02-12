export {};

export type Roles = 'admin' | 'doctor' | 'client';

declare global {
	interface CustomJwtSessionClaims {
		metadata: {
			role?: Roles;
		};
	}
}
