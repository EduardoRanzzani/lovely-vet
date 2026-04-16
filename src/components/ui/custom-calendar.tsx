'use client';

import React, { useState } from 'react';
import {
	format,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	isSameMonth,
	isSameDay,
	addMonths,
	subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Tipagem para os plantões
interface Shift {
	id: string;
	title: string;
	start: Date;
	end: Date;
	type: 'day' | 'night';
}

export function CustomCalendar() {
	const [currentMonth, setCurrentMonth] = useState(new Date());

	// Lógica de datas
	const monthStart = startOfMonth(currentMonth);
	const monthEnd = endOfMonth(monthStart);
	const startDate = startOfWeek(monthStart);
	const endDate = endOfWeek(monthEnd);
	const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

	// Exemplo de plantão que vira o dia (16/04 19h -> 17/04 07h)
	const shifts: Shift[] = [
		{
			id: '1',
			title: 'Plantão Noturno',
			start: new Date(2026, 3, 16, 19, 0),
			end: new Date(2026, 3, 17, 7, 0),
			type: 'night',
		},
	];

	return (
		<div className='w-full bg-card border rounded-xl overflow-hidden shadow-sm'>
			{/* Header do Calendário */}
			<div className='flex items-center justify-between p-4 border-b'>
				<h2 className='text-lg font-semibold capitalize'>
					{format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
				</h2>
				<div className='flex gap-2'>
					<Button
						variant='outline'
						size='icon'
						onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
					>
						<ChevronLeft className='w-4 h-4' />
					</Button>
					<Button
						variant='outline'
						size='icon'
						onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
					>
						<ChevronRight className='w-4 h-4' />
					</Button>
				</div>
			</div>

			{/* Dias da Semana */}
			<div className='grid grid-cols-7 border-b bg-muted/30'>
				{['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
					<div
						key={day}
						className='py-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider'
					>
						{day}
					</div>
				))}
			</div>

			{/* Grid de Dias */}
			<div className='grid grid-cols-7'>
				{calendarDays.map((day, idx) => {
					const dayShifts = shifts.filter(
						(s) => isSameDay(day, s.start) || isSameDay(day, s.end),
					);

					return (
						<div
							key={day.toString()}
							className={cn(
								'min-h-25 border-b border-r p-2 transition-colors hover:bg-muted/10',
								!isSameMonth(day, monthStart) &&
									'bg-muted/5 text-muted-foreground/50',
								idx % 7 === 6 && 'border-r-0',
							)}
						>
							<div className='flex justify-between items-start mb-2'>
								<span
									className={cn(
										'text-sm font-medium p-1 w-7 h-7 flex items-center justify-center rounded-full',
										isSameDay(day, new Date()) &&
											'bg-primary text-primary-foreground',
									)}
								>
									{format(day, 'd')}
								</span>
								<Button
									variant='ghost'
									size='icon'
									className='h-6 w-6 opacity-0 group-hover:opacity-100'
								>
									<Plus className='w-3 h-3' />
								</Button>
							</div>

							{/* Renderização dos Plantões */}
							<div className='flex flex-col gap-1'>
								{dayShifts.map((shift) => {
									const isStart = isSameDay(day, shift.start);
									return (
										<div
											key={shift.id}
											className={cn(
												'text-[10px] px-2 py-1 rounded-sm border-l-2 truncate shadow-sm',
												shift.type === 'night'
													? 'bg-indigo-500/10 border-indigo-500 text-indigo-700 dark:text-indigo-300'
													: 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300',
												!isStart && 'opacity-60 italic', // Diferencia visualmente o dia em que o plantão termina
											)}
										>
											{isStart
												? `Início: ${shift.title}`
												: `Fim: ${shift.title}`}
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
