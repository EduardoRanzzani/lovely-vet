'use server';

import { db } from '@/db';
import { customersTable, usersTable } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { count, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { PaginatedData } from '../config/consts';
import {
	CreateCustomerWithUserSchema,
	OnboardingCustomerSchema,
} from '../schema/customers.schema';
import { createNewClerkUser } from './clerk.actions';

export type CustomerWithUser = typeof customersTable.$inferSelect & {
	user: typeof usersTable.$inferSelect;
};

export const onboardingCustomer = async (data: OnboardingCustomerSchema) => {
	const clerkUser = await currentUser();
	if (!clerkUser) throw new Error('Usuário não autenticado');

	const databaseUser = await db.query.usersTable.findFirst({
		where: eq(usersTable.clerkUserId, clerkUser.id),
	});
	if (!databaseUser) throw new Error('Usuário não cadastrado no sistema');

	await db.insert(customersTable).values({
		userId: databaseUser.id,
		phone: data.phone,
		cpf: data.cpf,
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
	filter?: string,
): Promise<PaginatedData<CustomerWithUser>> => {
	const clerkUser = await currentUser();
	if (!clerkUser) throw new Error('Usuário não autenticado');

	const offset = (page - 1) * limit;

	// 1. Construir a condição de filtro
	// Buscamos no nome do usuário (tabela user) ou no CPF do cliente
	const filterCondition = filter
		? or(
				ilike(usersTable.name, `%${filter}%`),
				ilike(customersTable.email, `%${filter}%`),
				ilike(customersTable.cpf, `%${filter}%`),
				ilike(customersTable.phone, `%${filter}%`),
				ilike(customersTable.address, `%${filter}%`),
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
		.orderBy(desc(usersTable.name));

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

export const upsertCustomer = async (data: CreateCustomerWithUserSchema) => {
	const clerkUser = await currentUser();
	if (!clerkUser) throw new Error('Usuário não autenticado');

	if (data.id) {
		console.log('update');
	} else {
		return createCustomer(data);
	}
};

const createCustomer = async (data: CreateCustomerWithUserSchema) => {
	const clerkUser = await createNewClerkUser(data);

	const [newUser] = await db
		.insert(usersTable)
		.values({
			name: data.name,
			email: data.email,
			image: data.image,
			clerkUserId: clerkUser.id,
			role: 'customer',
		})
		.onConflictDoUpdate({
			target: usersTable.clerkUserId,
			set: { updatedAt: new Date() },
		})
		.returning();

	if (!newUser) throw new Error('Falha ao criar usuário base no sistema');

	const [newCustomer] = await db
		.insert(customersTable)
		.values({
			userId: newUser.id,
			phone: data.phone,
			cpf: data.cpf,
			email: data.email,
			postalCode: data.postalCode,
			address: data.address,
			addressNumber: data.addressNumber || 'S/N',
			neighborhood: data.neighborhood,
			city: data.city,
			state: data.state,
		})
		.returning();

	revalidatePath('/customers');
	return {
		newUser,
		newCustomer,
	};
};
