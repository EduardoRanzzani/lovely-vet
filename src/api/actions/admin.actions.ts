'use server';

import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { actionClient } from '@/lib/next-safe-action';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import z from 'zod';

const userIdProd = 'user_3AGj7pjKHaiWsfZHlq53aIRcKo7';
const userIdDev = 'user_39w5ENK2TbvmC1SbcTpN7cKNEJR';
const email = 'eduranzzani@gmail.com';

export const changeUserId = actionClient
	.schema(z.object({ environment: z.enum(['prod', 'dev']) }))
	.action(async ({ parsedInput }) => {
		const authenticatedUser = await currentUser();
		if (!authenticatedUser) throw new Error('Usuário não autenticado');

		const { environment } = parsedInput;
		const clerkUserId = environment === 'prod' ? userIdProd : userIdDev;

		try {
			await db
				.update(usersTable)
				.set({ clerkUserId: clerkUserId })
				.where(eq(usersTable.email, email));
		} catch (error) {
			console.error(error);
		}

		revalidatePath('/admin');
	});
