'use server';

import { db } from '@/db';
import {
	breedsTable,
	customersTable,
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
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	const databaseUser = await db.query.usersTable.findFirst({
		where: eq(usersTable.clerkUserId, authenticatedUser.id),
		with: { customer: true },
	});

	if (!databaseUser) throw new Error('Usuário não encontrado');

	const offset = (page - 1) * limit;
	const conditions = [];

	// LÓGICA DE SEGURANÇA: Se for customer, filtra pelo ID de cliente dele
	if (databaseUser.role === 'customer' && databaseUser.customer) {
		conditions.push(eq(petsTable.customerId, databaseUser.customer.id));
	}

	if (search) {
		conditions.push(
			or(
				ilike(petsTable.name, `%${search}%`),
				ilike(breedsTable.name, `%${search}%`),
				ilike(speciesTable.name, `%${search}%`),
				ilike(usersTable.name, `%${search}%`),
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
			specie: speciesTable,
			tutor: customersTable,
			user: usersTable,
		})
		.from(petsTable)
		.innerJoin(breedsTable, eq(petsTable.breedId, breedsTable.id))
		.innerJoin(speciesTable, eq(petsTable.specieId, speciesTable.id))
		.innerJoin(customersTable, eq(petsTable.customerId, customersTable.id))
		.innerJoin(usersTable, eq(customersTable.userId, usersTable.id))
		.where(filterCondition)
		.limit(limit)
		.offset(offset)
		.orderBy(asc(petsTable.name));

	const totalCountResult = await db
		.select({ value: countDistinct(petsTable.id) })
		.from(petsTable)
		.innerJoin(customersTable, eq(petsTable.customerId, customersTable.id))
		.innerJoin(usersTable, eq(customersTable.userId, usersTable.id))
		.where(filterCondition);

	const totalCount = Number(totalCountResult[0]?.value ?? 0);
	const pageCount = Math.ceil(totalCount / limit);

	const formattedData: PetsWithTutorAndBreed[] = data.map((row) => ({
		...row.pet,
		breed: {
			...row.breed,
			specie: row.specie,
		},
		tutor: {
			...row.tutor,
			user: row.user,
		},
	}));

	return {
		data: formattedData,
		metadata: { totalCount, pageCount, currentPage: page, limit },
	};
};

export const upsertPet = async (data: CreatePetWithTutorAndBreedSchema) => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

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
			customerId: data.tutorId, // Agora o tutor é salvo diretamente aqui
			sterile: data.sterile === 'true',
			photo: data.photo,
			color: data.color,
			gender: data.gender,
			weight: data.weight,
			observations: data.observations,
		})
		.returning();

	return newPet;
};
