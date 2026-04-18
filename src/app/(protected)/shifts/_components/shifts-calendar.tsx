'use client';

import { monthNames } from '@/api/config/consts';
import { ShiftWithDoctor } from '@/api/schema/shifts.schema';
import AddButton from '@/components/list/add-button';
import { CustomCalendar } from '@/components/ui/custom-calendar';
import { cn } from '@/lib/utils';
import {
	endOfDay,
	format,
	isSameDay,
	isWithinInterval,
	setMonth,
	startOfDay,
} from 'date-fns';
import { ClockIcon, HospitalIcon, MoonIcon, SunIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { use, useMemo } from 'react';
import ShiftFormClient from './shift-form';

interface ShiftsCalendarClientProps {
	shiftsPromise: Promise<ShiftWithDoctor[]>;
}

const ShiftsCalendarClient = ({ shiftsPromise }: ShiftsCalendarClientProps) => {
	const shifts = use(shiftsPromise);
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const monthParam = searchParams.get('month');
	const currentMonth = monthParam
		? setMonth(new Date(), monthNames.indexOf(monthParam.toLowerCase()))
		: new Date();

	const handleMonthChange = (newDate: Date) => {
		const monthIndex = newDate.getMonth();
		const monthName = monthNames[monthIndex];

		const params = new URLSearchParams(searchParams);
		params.set('month', monthName);

		router.push(`${pathname}?${params.toString()}`);
	};

	// Calcula apenas as datas de INÍCIO dos plantões
	const onDutyDates = useMemo(() => {
		const uniqueStartDates = new Set(
			shifts.map((shift) =>
				startOfDay(new Date(shift.startTime)).toISOString(),
			),
		);
		return Array.from(uniqueStartDates).map((dateStr) => new Date(dateStr));
	}, [shifts]);

	const renderMobileContent = (date: Date, isCurrentMonth: boolean) => {
		const dayShifts = shifts.filter((shift) => {
			const start = new Date(shift.startTime);
			const end = new Date(shift.endTime);

			// Verifica se o dia atual do calendário está entre o início e o fim do plantão
			return isWithinInterval(date, {
				start: startOfDay(start),
				end: endOfDay(end),
			});
		});

		return (
			<div
				className={cn(
					'flex flex-col gap-1 mt-1 transition-opacity',
					!isCurrentMonth && 'opacity-30 grayscale-[0.5] pointer-events-none',
				)}
			>
				{dayShifts.map((shift) => {
					const startDate = new Date(shift.startTime);
					const isStart = isSameDay(new Date(shift.startTime), date);

					const startHour = startDate.getHours();
					const isNight = startHour >= 18 || startHour < 6;

					return (
						<div
							key={shift.id}
							className={cn(
								'group relative flex flex-col p-1.5 text-[10px] border-l-2 transition-colors rounded-sm',
								isNight
									? 'bg-blue-950 text-blue-200 border-indigo-600 hover:bg-blue-950/90'
									: 'bg-amber-100 text-amber-900 border-amber-400 hover:bg-amber-100/90',
								!isStart && 'opacity-70 border-dashed',
							)}
						>
							<span className='flex gap-2'>
								{isNight ? (
									<MoonIcon className='w-3 h-3' />
								) : (
									<SunIcon className='w-3 h-3' />
								)}
								<HospitalIcon className='w-3 h-3' />
							</span>
						</div>
					);
				})}
			</div>
		);
	};

	const renderDayContent = (
		date: Date,
		isMobile: boolean,
		isCurrentMonth: boolean,
	) => {
		const dayShifts = shifts.filter((shift) => {
			const start = new Date(shift.startTime);
			const end = new Date(shift.endTime);

			// Verifica se o dia atual do calendário está entre o início e o fim do plantão
			return isWithinInterval(date, {
				start: startOfDay(start),
				end: endOfDay(end),
			});
		});

		return (
			<div
				className={cn(
					'flex flex-col gap-1 mt-1 transition-opacity',
					!isCurrentMonth && 'opacity-30 grayscale-[0.5] pointer-events-none',
				)}
			>
				{dayShifts.map((shift) => {
					const startDate = new Date(shift.startTime);
					const isStart = isSameDay(new Date(shift.startTime), date);
					const isEnd = isSameDay(new Date(shift.endTime), date);

					const startHour = startDate.getHours();
					const isNight = startHour >= 18 || startHour < 6;

					return (
						<div
							key={shift.id}
							className={cn(
								'group relative flex flex-col p-1.5 text-[10px] border-l-2 transition-colors rounded-sm',
								isNight
									? 'bg-blue-950 text-blue-200 border-indigo-600 hover:bg-blue-950/90'
									: 'bg-amber-100 text-amber-900 border-amber-400 hover:bg-amber-100/90',
								!isStart && 'opacity-70 border-dashed',
							)}
						>
							<div className='font-bold truncate'>
								<span
									className={cn(
										isNight ? 'text-blue-200' : 'text-amber-700',
										'flex items-center gap-2',
									)}
								>
									{isNight ? (
										<MoonIcon className='w-3 h-3' />
									) : (
										<SunIcon className='w-3 h-3' />
									)}
									{shift.clinicName}
								</span>
							</div>

							<div className='text-muted-foreground flex items-center gap-2'>
								<span
									className={cn(
										isNight ? 'text-blue-200' : 'text-amber-700',
										'flex items-center gap-2',
									)}
								>
									<ClockIcon className='w-3 h-3' />
									{isStart
										? 'Entrada: ' + format(new Date(shift.startTime), 'HH:mm')
										: ''}
									{isStart && isEnd && ' - '}
									{isEnd
										? 'Saída: ' + format(new Date(shift.endTime), 'HH:mm')
										: ''}
									{!isStart && !isEnd && 'Continuação'}
								</span>
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<div className='flex flex-col w-full gap-4'>
			<div className='flex items-center justify-end'>
				<AddButton
					text='Novo Plantão'
					renderForm={(close) => <ShiftFormClient onSuccess={close} />}
				/>
			</div>

			<CustomCalendar
				currentMonth={currentMonth}
				onMonthChange={handleMonthChange}
				renderDay={renderDayContent}
				renderMobileHeader={renderMobileContent}
				onDutyDates={onDutyDates}
				onDayClick={(date) => {
					console.log('Clicou no dia: ', date);
				}}
			/>
		</div>
	);
};

export default ShiftsCalendarClient;
