'use server';

import { db } from '@/db';
import { speciesTable } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { asc, count, ilike, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { PaginatedData } from '../config/consts';
import { CreateSpecieSchema, Specie } from '../schema/species.schema';

export const getSpecies = async (): Promise<Specie[]> => {
	const species = await db.query.speciesTable.findMany({
		orderBy: asc(speciesTable.name),
	});
	return species;
};

export const getSpeciesPaginated = async (
	page: number,
	limit: number,
	search?: string,
): Promise<PaginatedData<Specie>> => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	const offset = (page - 1) * limit;

	const filterCondition = search
		? or(ilike(speciesTable.name, `%${search}%`))
		: undefined;

	const dataPromise = db
		.select({
			speciesTable: speciesTable,
		})
		.from(speciesTable)
		.where(filterCondition)
		.limit(limit)
		.offset(offset)
		.orderBy(asc(speciesTable.name));

	const totalCountPromise = db
		.select({ value: count() })
		.from(speciesTable)
		.where(filterCondition);

	const [data, totalCountResult] = await Promise.all([
		dataPromise,
		totalCountPromise,
	]);

	const totalCount = totalCountResult[0].value;
	const pageCount = Math.ceil(totalCount / limit);

	const formattedData = data.map((row) => ({
		...row.speciesTable,
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

export const upsertSpecie = async (data: CreateSpecieSchema) => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	await db
		.insert(speciesTable)
		.values({
			id: data.id,
			name: data.name,
		})
		.onConflictDoUpdate({
			target: speciesTable.id, // O conflito ocorre no ID
			set: {
				name: data.name,
			},
		})
		.returning();

	revalidatePath('/species');
};
