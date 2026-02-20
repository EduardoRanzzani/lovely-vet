'use server';

import { db } from '@/db';
import {
	appointmentsTable,
	doctorsTable,
	petsTable,
	servicesTable,
	usersTable,
} from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { and, countDistinct, eq, ilike, or } from 'drizzle-orm';
import { PaginatedData } from '../config/consts';
import {
	AppointmentsWithPetAndServiceAndDoctor,
	CreateAppointmentSchema,
} from '../schema/appointments.schema';

export const getAppointmentsPaginated = async (
	page: number,
	limit: number,
	search?: string,
): Promise<PaginatedData<AppointmentsWithPetAndServiceAndDoctor>> => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	const offset = (page - 1) * limit;
	const conditions = [];

	if (search) {
		conditions.push(
			or(
				ilike(appointmentsTable.notes, `%${search}%`),
				ilike(servicesTable.name, `%${search}%`),
				ilike(petsTable.name, `%${search}%`),
				ilike(doctorsTable.licenseNumber, `%${search}%`),
				ilike(usersTable.name, `%${search}%`),
			),
		);
	}

	const filterCondition =
		conditions.length > 0 ? and(...conditions) : undefined;

	const data = await db
		.select({
			appointments: appointmentsTable,
			pet: petsTable,
			service: servicesTable,
			doctor: doctorsTable,
			user: usersTable,
		})
		.from(appointmentsTable)
		.innerJoin(petsTable, eq(appointmentsTable.petId, petsTable.id))
		.innerJoin(servicesTable, eq(appointmentsTable.serviceId, servicesTable.id))
		.innerJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
		.innerJoin(usersTable, eq(doctorsTable.userId, usersTable.id))
		.where(filterCondition)
		.limit(limit)
		.offset(offset)
		.orderBy(appointmentsTable.scheduledAt);

	const totalCountResult = await db
		.select({ value: countDistinct(appointmentsTable.id) })
		.from(appointmentsTable)
		.innerJoin(petsTable, eq(appointmentsTable.petId, petsTable.id))
		.innerJoin(servicesTable, eq(appointmentsTable.serviceId, servicesTable.id))
		.innerJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
		.innerJoin(usersTable, eq(doctorsTable.userId, usersTable.id))
		.where(filterCondition);

	const totalCount = Number(totalCountResult[0]?.value ?? 0);
	const pageCount = Math.ceil(totalCount / limit);

	const formattedData: AppointmentsWithPetAndServiceAndDoctor[] = data.map(
		(row) => ({
			...row.appointments,
			pet: {
				...row.pet,
			},
			service: {
				...row.service,
			},
			doctor: {
				...row.doctor,
				user: row.user,
			},
		}),
	);

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

export const upsertAppointment = async (data: CreateAppointmentSchema) => {
	console.log('Data received in upsertAppointment:', data);
};
