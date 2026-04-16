'use client';

import { Calendar } from '@/components/ui/calendar';
import { endOfDay, isSameDay, isWithinInterval, startOfDay } from 'date-fns';
import { useState } from 'react';

// Exemplo de dados vindos do banco
const shifts = [
	{
		id: '1',
		start: new Date(2026, 3, 16, 19, 0), // 16/04 19:00
		end: new Date(2026, 3, 17, 7, 0), // 17/04 07:00
		range: 12, // 12 horas de duração
	},
];

const ShiftsListClient = () => {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date(),
	);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const getShiftsForDay = (day: Date) => {
		return shifts.filter(
			(shift) =>
				isWithinInterval(startOfDay(day), {
					start: startOfDay(shift.start),
					end: endOfDay(shift.end),
				}) ||
				isSameDay(day, shift.start) ||
				isSameDay(day, shift.end),
		);
	};

	const handleDayClick = (day: Date) => {
		setSelectedDate(day);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
	};

	return (
		<div className='flex flex-col md:flex-row gap-8 p-4'>
			<Calendar
				mode='single'
				selected={selectedDate}
				onDayClick={handleDayClick}
				className='rounded-md border shadow'
				modifiers={{ hasShift: (date) => getShiftsForDay(date).length > 0 }}
				modifiersStyles={{
					hasShift: { backgroundColor: '#e2e8f0', fontWeight: 'bold' },
				}}
				components={
					{
						// DayContent: { date },
					}
				}
			/>
		</div>
	);
};

export default ShiftsListClient;
