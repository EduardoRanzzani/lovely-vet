import { db } from '@/db';
import { shiftsTable } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { addMonths, endOfMonth, startOfMonth, subMonths } from 'date-fns';
import { and, gte, lte } from 'drizzle-orm';
import { monthNames } from '../config/consts';
import { ShiftWithDoctor } from '../schema/shifts.schema';

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
