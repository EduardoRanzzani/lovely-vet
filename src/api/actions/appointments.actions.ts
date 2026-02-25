'use server';

import { db } from '@/db';
import {
	appointmentItemsTable,
	appointmentsTable,
	petsTable,
} from '@/db/schema';
import { actionClient } from '@/lib/next-safe-action';
import { currentUser } from '@clerk/nextjs/server';
import { count, desc, eq, ilike } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { MAX_PAGE_SIZE, PaginatedData } from '../config/consts';
import {
	AppointmentsWithRelations,
	createAppointmentSchema,
} from '../schema/appointments.schema';

export const getAppointmentsPaginated = async (
	page: number = 1,
	limit: number = MAX_PAGE_SIZE,
	search?: string,
): Promise<PaginatedData<AppointmentsWithRelations>> => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	const offset = (page - 1) * limit;

	// Filtro busca por nome do pet
	const filterCondition = search
		? ilike(petsTable.name, `%${search}%`)
		: undefined;

	// 1. Buscar os dados usando a Relational Query API (resolve o problema de agrupamento)
	const data = await db.query.appointmentsTable.findMany({
		where: filterCondition,
		limit: limit,
		offset: offset,
		orderBy: desc(appointmentsTable.scheduledAt),
		with: {
			pet: {
				with: {
					customer: {
						with: { user: true },
					},
				},
			},
			doctor: {
				with: { user: true },
			},
			items: {
				with: {
					service: true,
				},
			},
		},
	});

	// 2. Buscar o total para paginação
	const totalCountResult = await db
		.select({ value: count() })
		.from(appointmentsTable)
		.leftJoin(petsTable, eq(appointmentsTable.petId, petsTable.id))
		.where(filterCondition);

	const totalCount = Number(totalCountResult[0]?.value ?? 0);
	const pageCount = Math.ceil(totalCount / limit);

	return {
		data: data as AppointmentsWithRelations[],
		metadata: {
			totalCount,
			pageCount,
			currentPage: page,
			limit,
		},
	};
};

export const upsertAppointment = actionClient
	.schema(createAppointmentSchema)
	.action(async ({ parsedInput }) => {
		const authenticatedUser = await currentUser();
		if (!authenticatedUser) throw new Error('Usuário não autenticado');

		const { id, services, ...data } = parsedInput;

		// Inicia uma transação
		await db.transaction(async (tx) => {
			let appointmentId = id;

			// 1. Upsert do Agendamento Principal
			if (id) {
				await tx
					.update(appointmentsTable)
					.set({
						...data,
						totalPriceInCents: Math.round(data.totalPriceInCents * 100), // Converte para centavos
						updatedAt: new Date(),
					})
					.where(eq(appointmentsTable.id, id));

				// Limpa serviços antigos para reinserir (estratégia simples de sync)
				await tx
					.delete(appointmentItemsTable)
					.where(eq(appointmentItemsTable.appointmentId, id));
			} else {
				const [newAppointment] = await tx
					.insert(appointmentsTable)
					.values({
						...data,
						totalPriceInCents: Math.round(data.totalPriceInCents * 100),
					})
					.returning();
				appointmentId = newAppointment.id;
			}

			// 2. Inserir os Itens (Serviços)
			if (appointmentId && services.length > 0) {
				// Buscamos os preços atuais dos serviços para gravar o histórico
				const servicesData = await tx.query.servicesTable.findMany({
					where: (table, { inArray }) => inArray(table.id, services),
				});

				const itemsToInsert = servicesData.map((s) => ({
					appointmentId: appointmentId as string,
					serviceId: s.id,
					priceAtTimeInCents: s.priceInCents,
				}));

				await tx.insert(appointmentItemsTable).values(itemsToInsert);
			}
		});

		revalidatePath('/appointments');
	});

export const deleteAppointment = actionClient
	.schema(z.object({ id: z.uuid() }))
	.action(async ({ parsedInput }) => {
		const authenticatedUser = await currentUser();
		if (!authenticatedUser) throw new Error('Usuário não autenticado');

		const appointment = await db.query.appointmentsTable.findFirst({
			where: eq(appointmentsTable.id, parsedInput.id),
		});

		if (!appointment) throw new Error('Agendamento não encontrado');

		await db
			.delete(appointmentsTable)
			.where(eq(appointmentsTable.id, parsedInput.id));
		revalidatePath('/appointments');
	});

export const markAppointmentAsCompleted = actionClient
	.schema(z.object({ id: z.uuid() }))
	.action(async ({ parsedInput }) => {
		const authenticatedUser = await currentUser();
		if (!authenticatedUser) throw new Error('Usuário não autenticado');

		const appointment = await db.query.appointmentsTable.findFirst({
			where: eq(appointmentsTable.id, parsedInput.id),
		});

		if (!appointment) throw new Error('Agendamento não encontrado');

		await db
			.update(appointmentsTable)
			.set({
				status: 'completed',
				updatedAt: new Date(),
			})
			.where(eq(appointmentsTable.id, parsedInput.id));

		revalidatePath('/appointments');
	});
