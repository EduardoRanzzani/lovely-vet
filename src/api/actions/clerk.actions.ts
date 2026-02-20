'use server';

import { createClerkClient } from '@clerk/nextjs/server';
import { CLERK_ERROR_MESSAGES } from '../config/consts';
import { CreateCustomerWithUserSchema } from '../schema/customers.schema';
import { generateUsername } from '../util';
import { CreateDoctorWithUserSchema } from '../schema/doctors.schema';

const clerkClient = createClerkClient({
	secretKey: process.env.CLERK_SECRET_KEY,
});

interface ClerkErrorDetail {
	code: string;
	message: string;
	longMessage?: string;
	meta?: Record<string, unknown>;
}

interface ClerkResponseError {
	errors: ClerkErrorDetail[];
}

const isClerkAPIError = (error: unknown): error is ClerkResponseError => {
	return (
		typeof error === 'object' &&
		error !== null &&
		'errors' in error &&
		Array.isArray((error as ClerkResponseError).errors)
	);
};

export const createNewClerkUser = async (
	data: CreateCustomerWithUserSchema | CreateDoctorWithUserSchema,
) => {
	try {
		const firstName = data.name.substring(0, data.name.indexOf(' '));
		const lastName = data.name.substring(data.name.indexOf(' ') + 1);
		const username = generateUsername(data.name);

		const clerkUser = await clerkClient.users.createUser({
			emailAddress: [data.email],
			firstName: firstName,
			lastName: lastName,
			username: username,
			password: Math.random().toString(36).slice(-10) + 'A1!',
			publicMetadata: {
				role: 'customer',
			},
		});

		return clerkUser;
	} catch (error) {
		if (isClerkAPIError(error)) {
			const firstError = error.errors[0];
			const errorCode = firstError.code;

			console.error(`[Clerk Error] Code: ${errorCode}`, firstError);

			const friendlyMessage =
				CLERK_ERROR_MESSAGES[errorCode] || firstError.message;
			throw new Error(friendlyMessage);
		}

		if (error instanceof Error) {
			throw new Error(error.message);
		}

		throw new Error('Erro inesperado ao criar usuário');
	}
};
