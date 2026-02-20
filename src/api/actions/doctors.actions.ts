'use server';

import { db } from '@/db';
import { doctorsTable, usersTable } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { asc, count, ilike, or, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { MAX_PAGE_SIZE, PaginatedData } from '../config/consts';
import {
	CreateDoctorWithUserSchema,
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

export const upsertDoctor = async (data: CreateDoctorWithUserSchema) => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	let clerkUserId: string;

	// Lógica para Clerk User
	if (data.userId) {
		clerkUserId = data.userId;
	} else {
		const newClerkUser = await createNewClerkUser(data);
		clerkUserId = newClerkUser.id;
	}

	// 1. Upsert na tabela de usuários (Base)
	const [newUser] = await db
		.insert(usersTable)
		.values({
			name: data.name,
			email: data.email,
			image: data.image,
			clerkUserId: clerkUserId,
			role: 'doctor',
		})
		.onConflictDoUpdate({
			target: usersTable.clerkUserId,
			set: {
				name: data.name,
				email: data.email,
				image: data.image,
				updatedAt: new Date(),
			},
		})
		.returning();

	if (!newUser) throw new Error('Falha ao criar usuário base no sistema');

	// 2. Upsert na tabela de médicos (Específica)
	// Conversão de tipos: Zod (string) -> Drizzle (integer/number)
	await db
		.insert(doctorsTable)
		.values({
			userId: newUser.id,
			phone: data.phone,
			cpf: data.cpf,
			sex: data.sex,
			licenseNumber: data.licenseNumber,
			licenseState: data.licenseState,
			specialty: data.specialty,
			availableFromWeekDay: Number(data.availableFromWeekDay),
			availableToWeekDay: Number(data.availableToWeekDay),
			availableFromTime: data.availableFromTime,
			availableToTime: data.availableToTime,
		})
		.onConflictDoUpdate({
			target: doctorsTable.cpf,
			set: {
				phone: data.phone,
				sex: data.sex,
				licenseNumber: data.licenseNumber,
				licenseState: data.licenseState,
				specialty: data.specialty,
				availableFromWeekDay: Number(data.availableFromWeekDay),
				availableToWeekDay: Number(data.availableToWeekDay),
				availableFromTime: data.availableFromTime,
				availableToTime: data.availableToTime,
				updatedAt: new Date(),
			},
		});

	revalidatePath('/doctors');
};
