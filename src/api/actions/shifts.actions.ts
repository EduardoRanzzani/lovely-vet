'use server';

import { db } from '@/db';
import { shiftsTable } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import {
	addHours,
	addMonths,
	endOfMonth,
	startOfMonth,
	subMonths,
} from 'date-fns';
import { and, gte, lte } from 'drizzle-orm';
import { monthNames } from '../config/consts';
import { createShiftSchema, ShiftWithDoctor } from '../schema/shifts.schema';
import { actionClient } from '@/lib/next-safe-action';
import { revalidatePath } from 'next/cache';

export const getShifts = async (
	monthName?: string,
	yearParam?: string,
): Promise<ShiftWithDoctor[]> => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	const now = new Date();
	const year = yearParam ? parseInt(yearParam) : now.getFullYear();
	const monthIndex = monthName
		? monthNames.indexOf(monthName.toLowerCase())
		: now.getMonth();

	// Fallback para o mês atual se o nome do mês na URL for inválido
	const safeMonthIndex = monthIndex === -1 ? now.getMonth() : monthIndex;

	// Monta a data: Primeiro dia do mês e ano escolhidos
	const referenceDate = new Date(year, safeMonthIndex, 1);

	const startRange = startOfMonth(subMonths(referenceDate, 1));
	const endRange = endOfMonth(addMonths(referenceDate, 1));

	const shifts = await db.query.shiftsTable.findMany({
		where: and(
			lte(shiftsTable.startTime, endRange),
			gte(shiftsTable.endTime, startRange),
		),
		with: { doctor: { with: { user: true } } },
	});

	return shifts as ShiftWithDoctor[];
};

export const upsertShift = actionClient
	.schema(createShiftSchema)
	.action(async ({ parsedInput }) => {
		const authenticatedUser = await currentUser();
		if (!authenticatedUser) throw new Error('Usuário não autenticado');

		const { id, doctorId, clinicName, startTime, duration } = parsedInput;
		const endDate = addHours(startTime, duration);

		const result = await db.transaction(async (tx) => {
			const [insertedShift] = await tx
				.insert(shiftsTable)
				.values({
					id: id ?? undefined,
					doctorId: doctorId,
					clinicName: clinicName,
					startTime: startTime,
					endTime: endDate,
				})
				.onConflictDoUpdate({
					target: shiftsTable.id, // O conflito ocorre no ID
					set: {
						doctorId: doctorId,
						clinicName: clinicName,
						startTime: startTime,
						endTime: endDate,
					},
				})
				.returning();

			if (!insertedShift) throw new Error('Erro ao salvar plantão');
		});

		revalidatePath('/shifts');
		return result;
	});
