'use server';

import { db } from '@/db';
import { servicesTable } from '@/db/schema';
import { actionClient } from '@/lib/next-safe-action';
import { currentUser } from '@clerk/nextjs/server';
import { count, eq, ilike, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { PaginatedData } from '../config/consts';
import {
	createServiceSchema,
	CreateServiceSchema,
	Services,
} from '../schema/services.schema';

export const getServices = async (): Promise<Services[]> => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	return await db.query.servicesTable.findMany();
};

export const getServicesPaginated = async (
	page: number,
	limit: number,
	search?: string,
): Promise<PaginatedData<Services>> => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	const offset = (page - 1) * limit;

	const filterCondition = search
		? or(
				ilike(servicesTable.name, `%${search}%`),
				ilike(servicesTable.description, `%${search}%`),
			)
		: undefined;

	const dataPromise = db
		.select({
			servicesTable: servicesTable,
		})
		.from(servicesTable)
		.where(filterCondition)
		.limit(limit)
		.offset(offset)
		.orderBy(servicesTable.name);

	const totalcountPromise = db
		.select({ value: count() })
		.from(servicesTable)
		.where(filterCondition);

	const [data, totalCountResult] = await Promise.all([
		dataPromise,
		totalcountPromise,
	]);

	const totalCount = Number(totalCountResult[0]?.value ?? 0);
	const pageCount = Math.ceil(totalCount / limit);

	const formattedData = data.map((row) => ({
		...row.servicesTable,
	}));

	return {
		data: formattedData,
		metadata: {
			totalCount,
			pageCount,
			currentPage: page,
			limit,
		},
	};
};

export const upsertServiceOld = async (data: CreateServiceSchema) => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	await db
		.insert(servicesTable)
		.values({
			id: data.id,
			name: data.name,
			description: data.description,
			priceInCents: data.price,
		})
		.onConflictDoUpdate({
			target: servicesTable.id,
			set: {
				name: data.name,
				description: data.description,
				priceInCents: data.price,
			},
		})
		.returning();

	revalidatePath('/services');
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
				priceInCents: parsedInput.price * 100,
			})
			.onConflictDoUpdate({
				target: servicesTable.id,
				set: {
					name: parsedInput.name,
					description: parsedInput.description,
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
