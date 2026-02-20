'use server';

import { db } from '@/db';
import { customersTable, usersTable } from '@/db/schema';
import { actionClient } from '@/lib/next-safe-action';
import { currentUser } from '@clerk/nextjs/server';
import { asc, count, eq, ilike, or, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { PaginatedData } from '../config/consts';
import {
	createCustomerWithUserSchema,
	CustomerWithUser,
	OnboardingCustomerSchema,
} from '../schema/customers.schema';
import { createNewClerkUser } from './clerk.actions';

export const onboardingCustomer = async (data: OnboardingCustomerSchema) => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	const databaseUser = await db.query.usersTable.findFirst({
		where: eq(usersTable.clerkUserId, authenticatedUser.id),
	});
	if (!databaseUser) throw new Error('Usuário não cadastrado no sistema');

	await db.insert(customersTable).values({
		userId: databaseUser.id,
		phone: data.phone,
		cpf: data.cpf,
		sex: data.sex,
		email: databaseUser.email,
		postalCode: data.postalCode,
		address: data.address,
		addressNumber: data.addressNumber,
		neighborhood: data.neighborhood,
		city: data.city,
		state: data.state,
	});

	revalidatePath('/dashboard');
};

export const getCustomersPaginated = async (
	page: number = 1,
	limit: number = 20,
	search?: string,
): Promise<PaginatedData<CustomerWithUser>> => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	const offset = (page - 1) * limit;

	// 1. Construir a condição de filtro
	// Buscamos no nome do usuário (tabela user) ou no CPF do cliente
	const filterCondition = search
		? or(
				ilike(usersTable.name, `%${search}%`),
				ilike(customersTable.email, `%${search}%`),
				ilike(customersTable.cpf, `%${search}%`),
				ilike(customersTable.phone, `%${search}%`),
				ilike(customersTable.address, `%${search}%`),
			)
		: undefined;

	// 2. Query Principal com Inner Join para garantir que temos o User e podemos filtrar por ele
	const dataPromise = db
		.select({
			customersTable: customersTable,
			usersTable: usersTable,
		})
		.from(customersTable)
		.innerJoin(usersTable, sql`${customersTable.userId} = ${usersTable.id}`)
		.where(filterCondition)
		.limit(limit)
		.offset(offset)
		.orderBy(asc(usersTable.name));

	// 3. Contagem Total (precisa do join para o filtro de nome funcionar)
	const totalCountPromise = db
		.select({ value: count() })
		.from(customersTable)
		.innerJoin(usersTable, sql`${customersTable.userId} = ${usersTable.id}`)
		.where(filterCondition);

	const [data, totalCountResult] = await Promise.all([
		dataPromise,
		totalCountPromise,
	]);

	const totalCount = totalCountResult[0].value;
	const pageCount = Math.ceil(totalCount / limit);

	// Mapeamos o resultado para um formato mais amigável, similar ao findMany
	const formattedData = data.map((row) => ({
		...row.customersTable,
		user: row.usersTable,
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

// export const upsertCustomer = async (data: CreateCustomerWithUserSchema) => {
// 	const authenticatedUser = await currentUser();
// 	if (!authenticatedUser) throw new Error('Usuário não autenticado');

// 	let clerkUserId;

// 	if (data.userId) {
// 		clerkUserId = data.userId;
// 	} else {
// 		const newClerkUser = await createNewClerkUser(data);
// 		clerkUserId = newClerkUser.id;
// 	}

// 	const [newUser] = await db
// 		.insert(usersTable)
// 		.values({
// 			name: data.name,
// 			email: data.email,
// 			image: data.image,
// 			clerkUserId: clerkUserId,
// 			role: 'customer',
// 		})
// 		.onConflictDoUpdate({
// 			target: usersTable.clerkUserId,
// 			set: {
// 				name: data.name,
// 				email: data.email,
// 				image: data.image,
// 				updatedAt: new Date(),
// 			},
// 		})
// 		.returning();

// 	if (!newUser) throw new Error('Falha ao criar usuário base no sistema');

// 	await db
// 		.insert(customersTable)
// 		.values({
// 			userId: newUser.id,
// 			phone: data.phone,
// 			cpf: data.cpf,
// 			sex: data.sex,
// 			email: data.email,
// 			postalCode: data.postalCode,
// 			address: data.address,
// 			addressNumber: data.addressNumber || 'S/N',
// 			neighborhood: data.neighborhood,
// 			city: data.city,
// 			state: data.state,
// 		})
// 		.onConflictDoUpdate({
// 			target: customersTable.cpf,
// 			set: {
// 				userId: newUser.id,
// 				phone: data.phone,
// 				cpf: data.cpf,
// 				sex: data.sex,
// 				email: data.email,
// 				postalCode: data.postalCode,
// 				address: data.address,
// 				addressNumber: data.addressNumber || 'S/N',
// 				neighborhood: data.neighborhood,
// 				city: data.city,
// 				state: data.state,
// 				updatedAt: new Date(),
// 			},
// 		})
// 		.returning();

// 	revalidatePath('/customers');
// };

export const getCustomers = async (): Promise<CustomerWithUser[]> => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	// Usando select tradicional para permitir o join e a ordenação por outra tabela
	const customers = await db
		.select()
		.from(customersTable)
		.leftJoin(usersTable, eq(customersTable.userId, usersTable.id))
		.orderBy(asc(usersTable.name));

	return customers.map((row) => ({
		...row.customers,
		user: row.users,
	})) as CustomerWithUser[];
};

export const upsertCustomer = actionClient
	.schema(createCustomerWithUserSchema)
	.action(async ({ parsedInput }) => {
		const authenticatedUser = await currentUser();
		if (!authenticatedUser) throw new Error('Usuário não autenticado');

		let clerkUserId;

		const existingUser = await db.query.usersTable.findFirst({
			where: eq(usersTable.email, parsedInput.email),
		});

		if (existingUser) {
			clerkUserId = existingUser.id;
		} else {
			if (parsedInput.userId) {
				clerkUserId = parsedInput.userId;
			} else {
				const newClerkUser = await createNewClerkUser(parsedInput);
				clerkUserId = newClerkUser.id;
			}
		}

		const [newUser] = await db
			.insert(usersTable)
			.values({
				name: parsedInput.name,
				email: parsedInput.email,
				image: parsedInput.image,
				clerkUserId: clerkUserId,
				role: 'customer',
			})
			.onConflictDoUpdate({
				target: usersTable.clerkUserId,
				set: {
					name: parsedInput.name,
					email: parsedInput.email,
					image: parsedInput.image,
					updatedAt: new Date(),
				},
			})
			.returning();

		if (!newUser) throw new Error('Falha ao criar usuário base no sistema');

		await db
			.insert(customersTable)
			.values({
				userId: newUser.id,
				phone: parsedInput.phone,
				cpf: parsedInput.cpf,
				sex: parsedInput.sex,
				email: parsedInput.email,
				postalCode: parsedInput.postalCode,
				address: parsedInput.address,
				addressNumber: parsedInput.addressNumber || 'S/N',
				neighborhood: parsedInput.neighborhood,
				city: parsedInput.city,
				state: parsedInput.state,
			})
			.onConflictDoUpdate({
				target: customersTable.cpf,
				set: {
					userId: newUser.id,
					phone: parsedInput.phone,
					cpf: parsedInput.cpf,
					sex: parsedInput.sex,
					email: parsedInput.email,
					postalCode: parsedInput.postalCode,
					address: parsedInput.address,
					addressNumber: parsedInput.addressNumber || 'S/N',
					neighborhood: parsedInput.neighborhood,
					city: parsedInput.city,
					state: parsedInput.state,
					updatedAt: new Date(),
				},
			})
			.returning();

		revalidatePath('/customers');
	});

export const deleteCustomer = actionClient
	.schema(z.object({ id: z.string().uuid() }))
	.action(async ({ parsedInput }) => {
		const authenticatedUser = await currentUser();
		if (!authenticatedUser) throw new Error('Usuário não autenticado');

		const customer = await db.query.customersTable.findFirst({
			where: eq(customersTable.id, parsedInput.id),
		});

		if (!customer) throw new Error('Cliente não encontrado');

		await db
			.delete(customersTable)
			.where(eq(customersTable.id, parsedInput.id));

		revalidatePath('/customers');
	});
