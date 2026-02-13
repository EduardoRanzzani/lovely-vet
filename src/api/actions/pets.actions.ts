'use server';

import { db } from '@/db';
import {
	breedsTable,
	customersTable,
	ownersToPetsTable,
	petsTable,
	speciesTable,
	usersTable,
} from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { and, asc, countDistinct, eq, ilike, or, sql } from 'drizzle-orm';
import { PaginatedData } from '../config/consts';
import {
	CreatePetWithTutorAndBreedSchema,
	PetsWithTutorAndBreed,
} from '../schema/pets.schema';
import { revalidatePath } from 'next/cache';

export const getPetsPaginated = async (
	page: number,
	limit: number,
	search?: string,
): Promise<PaginatedData<PetsWithTutorAndBreed>> => {
	const clerkUser = await currentUser();
	if (!clerkUser) throw new Error('Usuário não autenticado');

	const databaseUser = await db.query.usersTable.findFirst({
		where: eq(usersTable.clerkUserId, clerkUser.id),
	});
	if (!databaseUser) throw new Error('Usuário não encontrado');

	const offset = (page - 1) * limit;

	const conditions = [];

	if (databaseUser.role === 'customer') {
		conditions.push(eq(usersTable.id, databaseUser.id));
	}

	if (search) {
		conditions.push(
			or(
				ilike(petsTable.name, `%${search}%`),
				ilike(breedsTable.name, `%${search}%`),
				ilike(speciesTable.name, `%${search}%`),
				ilike(usersTable.name, `%${search}%`),
				ilike(petsTable.status, `%${search}%`),
				ilike(petsTable.color, `%${search}%`),
			),
		);
	}

	const filterCondition =
		conditions.length > 0 ? and(...conditions) : undefined;

	const data = await db
		.select({
			pet: petsTable,
			breed: breedsTable,
			species: speciesTable, // Selecionamos a tabela de espécies explicitamente
			tutors: sql<string>`string_agg(${usersTable.name}, ', ')`.as('tutors'),
		})
		.from(petsTable)
		.leftJoin(breedsTable, eq(petsTable.breedId, breedsTable.id))
		.leftJoin(speciesTable, eq(breedsTable.speciesId, speciesTable.id))
		.leftJoin(ownersToPetsTable, eq(petsTable.id, ownersToPetsTable.petId))
		.leftJoin(customersTable, eq(ownersToPetsTable.clientId, customersTable.id))
		.leftJoin(usersTable, eq(customersTable.userId, usersTable.id))
		.where(filterCondition)
		.groupBy(petsTable.id, breedsTable.id, speciesTable.id)
		.limit(limit)
		.offset(offset)
		.orderBy(asc(petsTable.name));

	const totalCountResult = await db
		.select({ value: countDistinct(petsTable.id) })
		.from(petsTable)
		.leftJoin(breedsTable, eq(petsTable.breedId, breedsTable.id))
		.leftJoin(speciesTable, eq(breedsTable.speciesId, speciesTable.id))
		.leftJoin(ownersToPetsTable, eq(petsTable.id, ownersToPetsTable.petId))
		.leftJoin(customersTable, eq(ownersToPetsTable.clientId, customersTable.id))
		.leftJoin(usersTable, eq(customersTable.userId, usersTable.id))
		.where(filterCondition);

	const totalCount = Number(totalCountResult[0]?.value ?? 0);
	const pageCount = Math.ceil(totalCount / limit);

	const formattedData: PetsWithTutorAndBreed[] = data.map((row) => ({
		...row.pet,
		tutors: row.tutors,
		breed: {
			...row.breed!,
			species: row.species!, // Aqui fazemos o aninhamento
		},
	}));

	return {
		data: formattedData,
		metadata: {
			totalCount: totalCount, // totalCount calculado na sua query de contagem
			pageCount,
			currentPage: page,
			limit,
		},
	};
};

export const upsertPet = async (data: CreatePetWithTutorAndBreedSchema) => {
	const clerkUser = await currentUser();
	if (!clerkUser) throw new Error('Usuário não autenticado');

	if (data.id) {
		console.log('update');
	} else {
		createPet(data);
	}

	revalidatePath('/pets');
};

export const createPet = async (data: CreatePetWithTutorAndBreedSchema) => {
	const [newPet] = await db
		.insert(petsTable)
		.values({
			name: data.name,
			birthDate: data.birthDate,
			specieId: data.speciesId,
			breedId: data.breedId,
			sterile: data.sterile == 'true' ? true : false,
			photo: data.photo,
			color: data.color,
			gender: data.gender as 'male' | 'female',
			weight: data.weight,
			observations: data.observations,
		})
		.returning();

	return newPet;
};
