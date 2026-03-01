'use server';

import { db } from '@/db';
import {
	breedsTable,
	customersTable,
	petsTable,
	speciesTable,
	usersTable,
} from '@/db/schema';
import { actionClient } from '@/lib/next-safe-action';
import { currentUser } from '@clerk/nextjs/server';
import { format } from 'date-fns';
import { and, asc, countDistinct, eq, ilike, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { PaginatedData } from '../config/consts';
import {
	createPetWithTutorAndBreedSchema,
	PetWithTutorAndBreed,
} from '../schema/pets.schema';

export const getPetById = async (id: string): Promise<PetWithTutorAndBreed> => {
	const authUser = await currentUser();
	if (!authUser) throw new Error('Usuário não autenticado');

	const pet = await db.query.petsTable.findFirst({
		where: eq(petsTable.id, id),
		with: {
			tutor: {
				with: {
					user: true,
				},
			},
			breed: {
				with: {
					specie: true,
				},
			},
		},
	});

	if (!pet) throw new Error('Pet não encontrado');
	return pet as PetWithTutorAndBreed;
};

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

export const getPets = async (): Promise<PetWithTutorAndBreed[]> => {
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
): Promise<PaginatedData<PetWithTutorAndBreed>> => {
	const authUser = await currentUser();
	if (!authUser) throw new Error('Usuário não autenticado');
	console.log({ authUser });

	const dbUser = await db.query.usersTable.findFirst({
		where: eq(usersTable.clerkUserId, authUser.id),
		with: { customer: true },
	});

	console.log({ dbUser });

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

export const upsertPet = actionClient
	.schema(createPetWithTutorAndBreedSchema)
	.action(async ({ parsedInput }) => {
		const authenticatedUser = await currentUser();
		if (!authenticatedUser) throw new Error('Usuário não autenticado');

		await db
			.insert(petsTable)
			.values({
				id: parsedInput.id ?? undefined,
				name: parsedInput.name,
				birthDate: format(parsedInput.birthDate, 'yyyy-MM-dd'),
				breedId: parsedInput.breedId,
				customerId: parsedInput.customerId,
				sterile: parsedInput.sterile ?? false,
				status: parsedInput.status ?? 'alive',
				photo: parsedInput.photo,
				color: parsedInput.color,
				gender: parsedInput.gender,
				weightInGrams: parsedInput.weightInGrams * 1000,
			})
			.onConflictDoUpdate({
				target: petsTable.id,
				set: {
					name: parsedInput.name,
					birthDate: parsedInput.birthDate.toISOString(),
					breedId: parsedInput.breedId,
					customerId: parsedInput.customerId,
					sterile: parsedInput.sterile ?? false,
					status: parsedInput.status ?? 'alive',
					photo: parsedInput.photo,
					color: parsedInput.color,
					gender: parsedInput.gender,
					weightInGrams: parsedInput.weightInGrams * 1000,
					updatedAt: new Date(),
				},
			})
			.returning();

		revalidatePath('/pets');
	});

export const deletePet = actionClient
	.schema(z.object({ id: z.uuid() }))
	.action(async ({ parsedInput }) => {
		const authenticatedUser = await currentUser();
		if (!authenticatedUser) throw new Error('Usuário não autenticado');

		const pet = await db.query.petsTable.findFirst({
			where: eq(petsTable.id, parsedInput.id),
		});

		if (!pet) throw new Error('Pet não encontrado');

		await db.delete(petsTable).where(eq(petsTable.id, parsedInput.id));

		revalidatePath('/pets');
	});
