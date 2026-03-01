'use server';

import { db } from '@/db';
import {
	doctorsTable,
	prescriptionTemplatesTable,
	usersTable,
} from '@/db/schema';
import { actionClient } from '@/lib/next-safe-action';
import { currentUser } from '@clerk/nextjs/server';
import { and, asc, countDistinct, eq, ilike, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { MAX_PAGE_SIZE, PaginatedData } from '../config/consts';
import {
	createPrescriptionTemplateSchema,
	PrescriptionTemplateWithRelations,
} from '../schema/prescriptions-template.schema.';

const getPrescriptionTemplateWithRelationsQuery = () => {
	return db
		.select({
			prescriptionTemplate: prescriptionTemplatesTable,
			doctor: doctorsTable,
			user: usersTable,
		})
		.from(prescriptionTemplatesTable)
		.innerJoin(
			doctorsTable,
			eq(prescriptionTemplatesTable.doctorId, doctorsTable.id),
		)
		.innerJoin(usersTable, eq(doctorsTable.userId, usersTable.id));
};

export const getPrescriptionsTemplate = async () => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');
	return await db.query.prescriptionTemplatesTable.findMany();
};

export const getPrescriptionsTemplatePaginated = async (
	page: number = 1,
	limit: number = MAX_PAGE_SIZE,
	search?: string,
): Promise<PaginatedData<PrescriptionTemplateWithRelations>> => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	const dbUser = await db.query.usersTable.findFirst({
		where: eq(usersTable.clerkUserId, authenticatedUser.id),
		with: { doctor: true },
	});

	const offset = (page - 1) * limit;
	const conditions = [];

	if (dbUser?.role === 'doctor' && dbUser.doctor) {
		conditions.push(eq(prescriptionTemplatesTable.doctorId, dbUser.doctor.id));
	}

	if (search) {
		conditions.push(
			or(
				ilike(prescriptionTemplatesTable.title, `%${search}%`),
				ilike(prescriptionTemplatesTable.content, `%${search}%`),
				ilike(usersTable.name, `%${search}%`),
			),
		);
	}

	const filter = conditions.length > 0 ? and(...conditions) : undefined;

	const data = await getPrescriptionTemplateWithRelationsQuery()
		.where(filter)
		.limit(limit)
		.offset(offset)
		.orderBy(asc(prescriptionTemplatesTable.title));

	const totalCountResult = await db
		.select({
			value: countDistinct(prescriptionTemplatesTable.id),
		})
		.from(prescriptionTemplatesTable)
		.innerJoin(
			doctorsTable,
			eq(prescriptionTemplatesTable.doctorId, doctorsTable.id),
		)
		.innerJoin(usersTable, eq(doctorsTable.userId, usersTable.id))
		.where(filter);

	const totalCount = Number(totalCountResult[0]?.value ?? 0);

	return {
		data: data.map((row) => ({
			...row.prescriptionTemplate,
			doctor: { ...row.doctor, user: row.user },
		})),
		metadata: {
			totalCount,
			pageCount: Math.ceil(totalCount / limit),
			currentPage: page,
			limit,
		},
	};
};

export const upsertPrescriptionsTemplate = actionClient
	.schema(createPrescriptionTemplateSchema)
	.action(async ({ parsedInput }) => {
		const authenticatedUser = await currentUser();
		if (!authenticatedUser) throw new Error('Usuário não autenticado');

		await db
			.insert(prescriptionTemplatesTable)
			.values({
				id: parsedInput.id ?? undefined,
				title: parsedInput.title,
				content: parsedInput.content,
				doctorId: parsedInput.doctorId,
			})
			.onConflictDoUpdate({
				target: prescriptionTemplatesTable.id,
				set: {
					title: parsedInput.title,
					content: parsedInput.content,
					doctorId: parsedInput.doctorId,
				},
			})
			.returning();

		revalidatePath('/prescriptions-template');
	});

export const deletePrescriptionTemplate = actionClient
	.schema(z.object({ id: z.uuid() }))
	.action(async ({ parsedInput }) => {
		const authenticatedUser = await currentUser();
		if (!authenticatedUser) throw new Error('Usuário não autenticado');

		const prescriptionTemplate =
			await db.query.prescriptionTemplatesTable.findFirst({
				where: eq(prescriptionTemplatesTable.id, parsedInput.id),
			});

		if (!prescriptionTemplate)
			throw new Error('Modelo de receita não encontrado');

		await db
			.delete(prescriptionTemplatesTable)
			.where(eq(prescriptionTemplatesTable.id, parsedInput.id));

		revalidatePath('/prescriptions-template');
	});
