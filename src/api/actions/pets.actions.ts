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
import { and, asc, countDistinct, eq, ilike, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { PaginatedData } from '../config/consts';
import {
	CreatePetWithTutorAndBreedSchema,
	PetsWithTutorAndBreed,
} from '../schema/pets.schema';

// Helper para evitar repetição da base da query de listagem
const getPetWithRelationsQuery = () => {
	return db
		.select({
			pet: petsTable,
			breed: breedsTable,
			specie: speciesTable,
			tutor: customersTable,
			user: usersTable,
		})
		.from(petsTable)
		.innerJoin(breedsTable, eq(petsTable.breedId, breedsTable.id))
		.innerJoin(speciesTable, eq(breedsTable.specieId, speciesTable.id)) // Join corrigido
		.innerJoin(customersTable, eq(petsTable.customerId, customersTable.id))
		.innerJoin(usersTable, eq(customersTable.userId, usersTable.id));
};

export const getPets = async (): Promise<PetsWithTutorAndBreed[]> => {
	const authUser = await currentUser();
	if (!authUser) throw new Error('Usuário não autenticado');

	const dbUser = await db.query.usersTable.findFirst({
		where: eq(usersTable.clerkUserId, authUser.id),
		with: { customer: true },
	});

	if (!dbUser) throw new Error('Usuário não encontrado no banco');

	const conditions = [];
	if (dbUser.role === 'customer' && dbUser.customer) {
		conditions.push(eq(petsTable.customerId, dbUser.customer.id));
	}

	const data = await getPetWithRelationsQuery()
		.where(conditions.length > 0 ? and(...conditions) : undefined)
		.orderBy(asc(petsTable.name));

	return data.map((row) => ({
		...row.pet,
		breed: { ...row.breed, specie: row.specie },
		tutor: { ...row.tutor, user: row.user },
	}));
};

export const getPetsPaginated = async (
	page: number,
	limit: number,
	search?: string,
): Promise<PaginatedData<PetsWithTutorAndBreed>> => {
	const authUser = await currentUser();
	if (!authUser) throw new Error('Usuário não autenticado');

	const dbUser = await db.query.usersTable.findFirst({
		where: eq(usersTable.clerkUserId, authUser.id),
		with: { customer: true },
	});

	const offset = (page - 1) * limit;
	const conditions = [];

	if (dbUser?.role === 'customer' && dbUser.customer) {
		conditions.push(eq(petsTable.customerId, dbUser.customer.id));
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

	const filter = conditions.length > 0 ? and(...conditions) : undefined;

	const data = await getPetWithRelationsQuery()
		.where(filter)
		.limit(limit)
		.offset(offset)
		.orderBy(asc(petsTable.name));

	const totalCountResult = await db
		.select({ value: countDistinct(petsTable.id) })
		.from(petsTable)
		.innerJoin(breedsTable, eq(petsTable.breedId, breedsTable.id))
		.innerJoin(speciesTable, eq(breedsTable.specieId, speciesTable.id))
		.innerJoin(customersTable, eq(petsTable.customerId, customersTable.id))
		.innerJoin(usersTable, eq(customersTable.userId, usersTable.id))
		.where(filter);

	const totalCount = Number(totalCountResult[0]?.value ?? 0);

	return {
		data: data.map((row) => ({
			...row.pet,
			breed: { ...row.breed, specie: row.specie },
			tutor: { ...row.tutor, user: row.user },
		})),
		metadata: {
			totalCount,
			pageCount: Math.ceil(totalCount / limit),
			currentPage: page,
			limit,
		},
	};
};

export const upsertPet = async (data: CreatePetWithTutorAndBreedSchema) => {
	const authUser = await currentUser();
	if (!authUser) throw new Error('Não autorizado');

	const values = {
		name: data.name,
		birthDate: data.birthDate, // Drizzle aceita string ISO para campos date
		breedId: data.breedId,
		customerId: data.tutorId,
		sterile: data.sterile === 'true',
		photo: data.photo,
		color: data.color,
		gender: data.gender,
		weightInGrams: data.weight, // Coluna nova do schema
		observations: data.observations,
	};

	if (data.id) {
		await db.update(petsTable).set(values).where(eq(petsTable.id, data.id));
	} else {
		await db.insert(petsTable).values(values);
	}

	revalidatePath('/pets');
};
