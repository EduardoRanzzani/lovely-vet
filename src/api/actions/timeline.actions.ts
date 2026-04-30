'use server';

import { db } from '@/db';
import { petWeightsTable } from '@/db/schema';
import { actionClient } from '@/lib/next-safe-action';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { timelineItemSchema } from '../schema/timeline.schema';

export const deleteTimelineItem = actionClient
	.schema(timelineItemSchema)
	.action(async ({ parsedInput }) => {
		const authenticatedUser = await currentUser();
		if (!authenticatedUser) throw new Error('Usuário não autenticado');

		const { id, petId, type } = parsedInput;

		if (type === 'weight') {
			const weight = await db.query.petWeightsTable.findFirst({
				where: eq(petWeightsTable.id, id),
			});
			if (!weight) {
				throw new Error('Peso não encontrado');
			}
			await db.delete(petWeightsTable).where(eq(petWeightsTable.id, id));
		}

		revalidatePath(`/pets/${petId}`);
	});
