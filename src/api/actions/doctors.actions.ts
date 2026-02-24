'use server';

import { db } from '@/db';
import { doctorsTable, usersTable } from '@/db/schema';
import { actionClient } from '@/lib/next-safe-action';
import { currentUser } from '@clerk/nextjs/server';
import { asc, count, eq, ilike, or, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { MAX_PAGE_SIZE, PaginatedData } from '../config/consts';
import {
	createDoctorWithUserSchema,
	DoctorsWithUser,
} from '../schema/doctors.schema';
import { createNewClerkUser } from './clerk.actions';

export const getDoctors = async (): Promise<DoctorsWithUser[]> => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	const data = await db
		.select({
			doctors: doctorsTable,
			users: usersTable,
		})
		.from(doctorsTable)
		.innerJoin(usersTable, sql`${doctorsTable.userId} = ${usersTable.id}`)
		.orderBy(asc(usersTable.name));

	const formattedData: DoctorsWithUser[] = data.map((row) => ({
		...row.doctors,
		user: row.users,
	}));

	return formattedData;
};

export const getDoctorsPaginated = async (
	page: number = 1,
	limit: number = MAX_PAGE_SIZE,
	search?: string,
): Promise<PaginatedData<DoctorsWithUser>> => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	const offset = (page - 1) * limit;

	const filterCondition = search
		? or(
				ilike(usersTable.name, `%${search}%`),
				ilike(doctorsTable.cpf, `%${search}%`),
				ilike(doctorsTable.phone, `%${search}%`),
				ilike(usersTable.email, `%${search}%`),
			)
		: undefined;

	const dataPromise = db
		.select({
			doctorsTable: doctorsTable,
			usersTable: usersTable,
		})
		.from(doctorsTable)
		.innerJoin(usersTable, sql`${doctorsTable.userId} = ${usersTable.id}`)
		.where(filterCondition)
		.limit(limit)
		.offset(offset)
		.orderBy(asc(usersTable.name));

	const totalCountPromise = db
		.select({ value: count() })
		.from(doctorsTable)
		.innerJoin(usersTable, sql`${doctorsTable.userId} = ${usersTable.id}`)
		.where(filterCondition);

	const [data, totalCountResult] = await Promise.all([
		dataPromise,
		totalCountPromise,
	]);

	const totalCount = Number(totalCountResult[0]?.value ?? 0);
	const pageCount = Math.ceil(totalCount / limit);

	const formattedData = data.map((row) => ({
		...row.doctorsTable,
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

export const upsertDoctor = actionClient
	.schema(createDoctorWithUserSchema)
	.action(async ({ parsedInput }) => {
		const authenticatedUser = await currentUser();
		if (!authenticatedUser) throw new Error('Usuário não autenticado');

		let clerkUserId;

		const existingUser = await db.query.usersTable.findFirst({
			where: eq(usersTable.email, parsedInput.email),
		});

		if (existingUser) {
			clerkUserId = existingUser.clerkUserId;
		} else {
			const newClerkUser = await createNewClerkUser(parsedInput);
			clerkUserId = newClerkUser.id;
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
			.insert(doctorsTable)
			.values({
				userId: newUser.id,
				phone: parsedInput.phone,
				cpf: parsedInput.cpf,
				gender: parsedInput.gender,
				licenseNumber: parsedInput.licenseNumber,
				licenseState: parsedInput.licenseState,
				specialty: parsedInput.specialty,
				availableFromWeekDay: Number(parsedInput.availableFromWeekDay),
				availableToWeekDay: Number(parsedInput.availableToWeekDay),
				availableFromTime: parsedInput.availableFromTime,
				availableToTime: parsedInput.availableToTime,
			})
			.onConflictDoUpdate({
				target: doctorsTable.cpf,
				set: {
					phone: parsedInput.phone,
					gender: parsedInput.gender,
					licenseNumber: parsedInput.licenseNumber,
					licenseState: parsedInput.licenseState,
					specialty: parsedInput.specialty,
					availableFromWeekDay: Number(parsedInput.availableFromWeekDay),
					availableToWeekDay: Number(parsedInput.availableToWeekDay),
					availableFromTime: parsedInput.availableFromTime,
					availableToTime: parsedInput.availableToTime,
					updatedAt: new Date(),
				},
			})
			.returning();

		revalidatePath('/doctors');
	});

export const deleteDoctor = actionClient
	.schema(z.object({ id: z.uuid() }))
	.action(async ({ parsedInput }) => {
		const authenticatedUser = await currentUser();
		if (!authenticatedUser) throw new Error('Usuário não autenticado');

		const doctor = await db.query.doctorsTable.findFirst({
			where: eq(doctorsTable.id, parsedInput.id),
		});

		if (!doctor) throw new Error('Veterinário não encontrado');

		await db.delete(doctorsTable).where(eq(doctorsTable.id, parsedInput.id));

		revalidatePath('/doctors');
	});
