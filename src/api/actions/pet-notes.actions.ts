'use server';

import { db } from '@/db';
import { petNotesTable, usersTable } from '@/db/schema';
import { actionClient } from '@/lib/next-safe-action';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { createNoteSchema } from '../schema/pet-notes.schema';
import { eq } from 'drizzle-orm';

export const insertNote = actionClient
	.schema(createNoteSchema)
	.action(async ({ parsedInput }) => {
		const authenticatedUser = await currentUser();
		if (!authenticatedUser) throw new Error('Usuário não autenticado');

		const user = await db.query.usersTable.findFirst({
			where: eq(usersTable.clerkUserId, authenticatedUser.id),
		});

		const authorId = user?.id;

		await db
			.insert(petNotesTable)
			.values({
				id: parsedInput.id ?? undefined,
				petId: parsedInput.petId!,
				content: parsedInput.content,
				authorId: authorId!,
				createdAt: new Date(),
			})
			.returning();

		revalidatePath(`/pets/${parsedInput.petId}`);
	});
