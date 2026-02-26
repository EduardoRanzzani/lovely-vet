'use server';

import { db } from '@/db';
import {
	appointmentItemsTable,
	appointmentsTable,
	petsTable,
	usersTable,
} from '@/db/schema';
import { actionClient } from '@/lib/next-safe-action';
import { currentUser } from '@clerk/nextjs/server';
import { and, count, desc, eq, ilike, ne } from 'drizzle-orm';
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

	const dbUser = await db.query.usersTable.findFirst({
		where: eq(usersTable.clerkUserId, authenticatedUser.id),
		with: { customer: true },
	});

	if (!dbUser) throw new Error('Usuário não encontrado no banco');

	const offset = (page - 1) * limit;

	const data = await db.query.appointmentsTable.findMany({
		where: (appointments, { and, eq, ilike, exists }) => {
			const filters = [];

			// FILTRO DE SEGURANÇA: Somente pets do cliente logado
			if (dbUser.role === 'customer' && dbUser.customer) {
				// Usamos subquery para verificar se o petId do agendamento
				// pertence ao customerId do usuário logado
				filters.push(
					exists(
						db
							.select()
							.from(petsTable)
							.where(
								and(
									eq(petsTable.id, appointments.petId),
									eq(petsTable.customerId, dbUser.customer!.id),
								),
							),
					),
				);
			}

			if (search) {
				filters.push(
					exists(
						db
							.select()
							.from(petsTable)
							.where(
								and(
									eq(petsTable.id, appointments.petId),
									ilike(petsTable.name, `%${search}%`),
								),
							),
					),
				);
			}

			return filters.length > 0 ? and(...filters) : undefined;
		},
		limit: limit,
		offset: offset,
		orderBy: desc(appointmentsTable.scheduledAt),
		with: {
			pet: { with: { tutor: { with: { user: true } } } },
			doctor: { with: { user: true } },
			items: { with: { service: true } },
		},
	});

	// 2. Buscar o total para paginação
	const totalCountResult = await db
		.select({ value: count() })
		.from(appointmentsTable)
		.innerJoin(petsTable, eq(appointmentsTable.petId, petsTable.id))
		.where(
			and(
				dbUser.role === 'customer'
					? eq(petsTable.customerId, dbUser.customer!.id)
					: undefined,
				search ? ilike(petsTable.name, `%${search}%`) : undefined,
			),
		);

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
		const totalPriceInCents = Math.round(data.totalPriceInCents * 100);

		try {
			await db.transaction(async (tx) => {
				// 1. VALIDAÇÃO DE CONFLITO DE HORÁRIO
				const conflict = await tx.query.appointmentsTable.findFirst({
					where: and(
						eq(appointmentsTable.doctorId, data.doctorId),
						eq(appointmentsTable.scheduledAt, data.scheduledAt),
						id ? ne(appointmentsTable.id, id) : undefined,
					),
				});

				if (conflict) {
					throw new Error(
						'O veterinário já possui um agendamento neste horário.',
					);
				}

				// Inicializamos como null para o TS rastrear a atribuição

				let appointmentId: string | null = null;

				if (id) {
					// UPDATE
					await tx
						.update(appointmentsTable)
						.set({
							...data,
							totalPriceInCents,
							updatedAt: new Date(),
						})
						.where(eq(appointmentsTable.id, id));

					appointmentId = id;

					// Limpa serviços antigos
					await tx
						.delete(appointmentItemsTable)
						.where(eq(appointmentItemsTable.appointmentId, id));
				} else {
					// INSERT
					const [newAppointment] = await tx
						.insert(appointmentsTable)
						.values({
							...data,
							totalPriceInCents,
						})
						.returning({ id: appointmentsTable.id });

					if (!newAppointment) throw new Error('Erro ao criar agendamento');
					appointmentId = newAppointment.id;
				}

				// 2. INSERÇÃO DOS ITENS
				// O check 'appointmentId' aqui atua como Type Guard, eliminando o erro de 'unassigned'
				if (appointmentId && services.length > 0) {
					const servicesData = await tx.query.servicesTable.findMany({
						where: (table, { inArray }) => inArray(table.id, services),
					});

					if (servicesData.length > 0) {
						const itemsToInsert = servicesData.map((s) => ({
							appointmentId: appointmentId as string, // Cast seguro após a guarda
							serviceId: s.id,
							priceAtTimeInCents: s.priceInCents,
						}));

						await tx.insert(appointmentItemsTable).values(itemsToInsert);
					}
				}
			});

			revalidatePath('/appointments');
			return { success: true };
		} catch (error: unknown) {
			console.error('Erro no upsert:', error);

			if (error instanceof Error) {
				throw error;
			}

			throw new Error('Ocorreu um erro inesperado ao salvar o agendamento.');
		}
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
