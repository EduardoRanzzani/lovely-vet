'use client';

import { monthNames } from '@/api/config/consts';
import { AppointmentsWithRelations } from '@/api/schema/appointments.schema';
import { ShiftsWithRelations } from '@/api/schema/shifts.schema';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { formatCurrencyFromCents } from '@/helpers/currency';
import { addMonths, format, setMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface DashboardCardsProps {
	shifts: ShiftsWithRelations[];
	appointments: AppointmentsWithRelations[];
}

const DashboardCards = ({ shifts, appointments }: DashboardCardsProps) => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const monthParam = searchParams.get('month');
	const currentMonth = monthParam
		? setMonth(new Date(), monthNames.indexOf(monthParam.toLowerCase()))
		: new Date();

	const nonPaidShifts = shifts.filter((shift) => !shift.isPaid);
	const nonPaidAppointments = appointments.filter((appointment) => {
		return !appointment.isPaid;
	});

	const nonPaidAmountInCents = nonPaidShifts.reduce((acc, shift) => {
		return acc + (shift.amountInCents ?? 0);
	}, 0);
	const nonPaidAppointmentsAmountInCents = nonPaidAppointments.reduce(
		(acc, appointment) => {
			return acc + (appointment.totalPriceInCents ?? 0);
		},
		0,
	);

	const onMonthChange = (newDate: Date) => {
		const monthIndex = newDate.getMonth();
		const monthName = monthNames[monthIndex];

		const params = new URLSearchParams(searchParams);
		params.set('month', monthName);

		router.push(`${pathname}?${params.toString()}`);
	};

	return (
		<div className='flex flex-col gap-4 border rounded-lg p-4'>
			<div className='flex items-center justify-between p-4 border-b bg-muted/10'>
				<h2 className='text-lg font-bold capitalize'>
					{format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
				</h2>
				<div className='flex gap-2'>
					<Button
						variant='outline'
						size='icon'
						className='h-8 w-8'
						onClick={() => onMonthChange(subMonths(currentMonth, 1))}
					>
						<ChevronLeft className='w-4 h-4' />
					</Button>
					<Button
						variant='outline'
						size='icon'
						className='h-8 w-8'
						onClick={() => onMonthChange(addMonths(currentMonth, 1))}
					>
						<ChevronRight className='w-4 h-4' />
					</Button>
				</div>
			</div>

			<div className='flex flex-col lg:flex-row w-full gap-4'>
				<Card className='flex-1'>
					<CardHeader className='border-b text-center'>
						<CardTitle>Total de Plantões</CardTitle>
					</CardHeader>
					<CardDescription>
						<h1 className='text-center font-bold text-3xl'>{shifts.length}</h1>
					</CardDescription>
				</Card>

				<Card className='flex-1'>
					<CardHeader className='border-b text-center'>
						<CardTitle>Total de Plantões não pagos</CardTitle>
					</CardHeader>
					<CardDescription>
						<h1 className='text-center font-bold text-3xl'>
							{nonPaidShifts.length}
						</h1>
					</CardDescription>
				</Card>

				<Card className='flex-1'>
					<CardHeader className='border-b text-center'>
						<CardTitle>Total a Receber</CardTitle>
					</CardHeader>
					<CardDescription>
						<h1 className='text-center font-bold text-3xl'>
							{formatCurrencyFromCents(nonPaidAmountInCents)}
						</h1>
					</CardDescription>
				</Card>
			</div>

			<div className='flex flex-col lg:flex-row w-full gap-4'>
				<Card className='flex-1'>
					<CardHeader className='border-b text-center'>
						<CardTitle>Total de Agendamentos</CardTitle>
					</CardHeader>
					<CardDescription>
						<h1 className='text-center font-bold text-3xl'>
							{appointments.length}
						</h1>
					</CardDescription>
				</Card>

				<Card className='flex-1'>
					<CardHeader className='border-b text-center'>
						<CardTitle>Total de Agendamentos não pagos</CardTitle>
					</CardHeader>
					<CardDescription>
						<h1 className='text-center font-bold text-3xl'>
							{nonPaidAppointments.length}
						</h1>
					</CardDescription>
				</Card>

				<Card className='flex-1'>
					<CardHeader className='border-b text-center'>
						<CardTitle>Total a Receber</CardTitle>
					</CardHeader>
					<CardDescription>
						<h1 className='text-center font-bold text-3xl'>
							{formatCurrencyFromCents(nonPaidAppointmentsAmountInCents)}
						</h1>
					</CardDescription>
				</Card>
			</div>
		</div>
	);
};

export default DashboardCards;
