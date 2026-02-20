'use server';

import { db } from '@/db';
import { servicesTable } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { count, ilike, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { PaginatedData } from '../config/consts';
import { CreateServiceSchema, Services } from '../schema/services.schema';

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

export const upsertService = async (data: CreateServiceSchema) => {
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
