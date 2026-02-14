'use server';

import { db } from '@/db';
import { breedsTable, speciesTable } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { asc, count, eq, ilike, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { PaginatedData } from '../config/consts';
import { BreedsWithSpecies, CreateBreedSchema } from '../schema/breeds.schema';

export const getBreeds = async (): Promise<BreedsWithSpecies[]> => {
	const breeds = await db.query.breedsTable.findMany({
		with: {
			specie: true,
		},
		orderBy: asc(breedsTable.name),
	});

	return breeds;
};

export const getBreedsPaginated = async (
	page: number,
	limit: number,
	search?: string,
): Promise<PaginatedData<BreedsWithSpecies>> => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	const offset = (page - 1) * limit;

	const filterCondition = search
		? or(
				ilike(breedsTable.name, `%${search}%`),
				ilike(speciesTable.name, `%${search}%`),
			)
		: undefined;

	const dataPromise = db
		.select({
			breedsTable: breedsTable,
			speciesTable: speciesTable,
		})
		.from(breedsTable)
		.innerJoin(speciesTable, eq(breedsTable.specieId, speciesTable.id))
		.where(filterCondition)
		.limit(limit)
		.offset(offset)
		.orderBy(asc(breedsTable.name));

	const totalCountPromise = db
		.select({ value: count() })
		.from(breedsTable)
		.innerJoin(speciesTable, eq(breedsTable.specieId, speciesTable.id))
		.where(filterCondition);

	const [data, totalCountResult] = await Promise.all([
		dataPromise,
		totalCountPromise,
	]);

	const totalCount = totalCountResult[0].value;
	const pageCount = Math.ceil(totalCount / limit);

	const formattedData = data.map((row) => ({
		...row.breedsTable,
		specie: row.speciesTable,
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

export const upsertBreed = async (data: CreateBreedSchema) => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	await db
		.insert(breedsTable)
		.values({
			id: data.id,
			name: data.name,
			specieId: data.specieId,
		})
		.onConflictDoUpdate({
			target: breedsTable.id,
			set: {
				name: data.name,
				specieId: data.specieId,
			},
		})
		.returning();

	revalidatePath('/breeds');
};
