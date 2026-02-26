'use server';

import { db } from '@/db';
import { servicesTable, speciesTable } from '@/db/schema';
import { actionClient } from '@/lib/next-safe-action';
import { currentUser } from '@clerk/nextjs/server';
import { asc, count, eq, ilike, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { MAX_PAGE_SIZE, PaginatedData } from '../config/consts';
import {
	createServiceSchema,
	ServiceWithSpecie,
} from '../schema/services.schema';

export const getServices = async (): Promise<ServiceWithSpecie[]> => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	const data = await db.query.servicesTable.findMany({
		with: { specie: true },
	});
	return data as ServiceWithSpecie[];
};

export const getServicesPaginated = async (
	page: number = 1,
	limit: number = MAX_PAGE_SIZE,
	search?: string,
): Promise<PaginatedData<ServiceWithSpecie>> => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	const offset = (page - 1) * limit;

	const filterCondition = search
		? or(
				ilike(servicesTable.name, `%${search}%`),
				ilike(servicesTable.description, `%${search}%`),
			)
		: undefined;

	const data = await db.query.servicesTable.findMany({
		where: filterCondition,
		limit: limit,
		offset: offset,
		orderBy: asc(servicesTable.name),
		with: { specie: true },
	});

	const totalCountResult = await db
		.select({ value: count() })
		.from(servicesTable)
		.leftJoin(speciesTable, eq(servicesTable.specieId, speciesTable.id))
		.where(filterCondition);

	const totalCount = Number(totalCountResult[0]?.value ?? 0);
	const pageCount = Math.ceil(totalCount / limit);

	return {
		data: data as ServiceWithSpecie[],
		metadata: {
			totalCount,
			pageCount,
			currentPage: page,
			limit,
		},
	};
};

export const upsertService = actionClient
	.schema(createServiceSchema)
	.action(async ({ parsedInput }) => {
		const authenticatedUser = await currentUser();
		if (!authenticatedUser) throw new Error('Usuário não autenticado');

		await db
			.insert(servicesTable)
			.values({
				id: parsedInput.id ?? undefined,
				name: parsedInput.name,
				description: parsedInput.description,
				specieId: parsedInput.specieId,
				priceInCents: parsedInput.price * 100,
			})
			.onConflictDoUpdate({
				target: servicesTable.id,
				set: {
					name: parsedInput.name,
					description: parsedInput.description,
					specieId: parsedInput.specieId,
					priceInCents: parsedInput.price * 100,
					updatedAt: new Date(),
				},
			});

		revalidatePath('/services');
	});

export const deleteService = actionClient
	.schema(z.object({ id: z.string() }))
	.action(async ({ parsedInput }) => {
		const authenticatedUser = await currentUser();
		if (!authenticatedUser) throw new Error('Usuário não autenticado');

		const service = await db.query.servicesTable.findFirst({
			where: eq(servicesTable.id, parsedInput.id),
		});

		if (!service) throw new Error('Serviço não encontrado');

		await db.delete(servicesTable).where(eq(servicesTable.id, parsedInput.id));

		revalidatePath('/services');
	});
