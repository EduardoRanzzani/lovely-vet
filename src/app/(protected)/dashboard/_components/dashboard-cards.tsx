'use client';

import { monthNames } from '@/api/config/consts';
import { AppointmentsWithRelations } from '@/api/schema/appointments.schema';
import { CustomersWithRelations } from '@/api/schema/customers.schema';
import { PetsWithRelations } from '@/api/schema/pets.schema';
import { ShiftsWithRelations } from '@/api/schema/shifts.schema';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatCurrencyFromCents } from '@/helpers/currency';
import { addMonths, format, setMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
	CatIcon,
	ChevronLeft,
	ChevronRight,
	DogIcon,
	DotIcon,
	EyeClosedIcon,
	EyeIcon,
	PawPrintIcon,
	UserIcon,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface DashboardCardsProps {
	shifts: ShiftsWithRelations[];
	appointments: AppointmentsWithRelations[];
	createdPets: PetsWithRelations[];
	createdCustomers: CustomersWithRelations[];
}

const DashboardCards = ({
	shifts,
	appointments,
	createdPets,
	createdCustomers,
}: DashboardCardsProps) => {
	const [showValues, setShowValues] = useState<boolean>(false);

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

	// Agrupa plantões não pagos por clínica
	const nonPaidShiftsByClinic = nonPaidShifts.reduce(
		(acc, shift) => {
			// Acesse o nome da clínica através da relação (ajuste conforme seu schema)
			const clinicName = shift.clinicName || 'Clínica não identificada';
			const amount = shift.amountInCents ?? 0;

			if (!acc[clinicName]) {
				acc[clinicName] = { count: 0, total: 0 };
			}

			acc[clinicName].count += 1;
			acc[clinicName].total += amount;

			return acc;
		},
		{} as Record<string, { count: number; total: number }>,
	);

	// Converte em array para facilitar o mapeamento no JSX
	const clinicBreakdown = Object.entries(nonPaidShiftsByClinic).map(
		([name, data]) => ({
			name,
			...data,
		}),
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
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant='outline'
								size='icon'
								className='h-8 w-8'
								onClick={() => setShowValues((prev) => !prev)}
							>
								{showValues ? (
									<EyeIcon className='w-4 h-4' />
								) : (
									<EyeClosedIcon className='w-4 h-4' />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							{showValues ? 'Esconder valores' : 'Mostrar valores'}
						</TooltipContent>
					</Tooltip>
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
							<Dialog>
								<DialogTrigger asChild>
									<button className='hover:underline decoration-primary'>
										{nonPaidShifts.length}
									</button>
								</DialogTrigger>
								<DialogContent>
									<DialogTitle>Pendências por Clínica</DialogTitle>
									<div className='flex flex-col gap-3 mt-4'>
										{clinicBreakdown.length > 0 ? (
											clinicBreakdown.map((clinic) => (
												<div
													key={clinic.name}
													className='flex items-center justify-between p-3 border rounded-lg bg-muted/5'
												>
													<div className='flex flex-col'>
														<span className='text-sm font-bold'>
															{clinic.name}
														</span>
														<span className='text-xs text-muted-foreground'>
															{clinic.count}{' '}
															{clinic.count === 1 ? 'plantão' : 'plantões'}
														</span>
													</div>
													<span className='font-mono font-semibold'>
														{showValues
															? formatCurrencyFromCents(clinic.total)
															: '••••'}
													</span>
												</div>
											))
										) : (
											<p className='text-center text-muted-foreground'>
												Tudo em dia!
											</p>
										)}
									</div>
								</DialogContent>
							</Dialog>
						</h1>
					</CardDescription>
				</Card>

				<Card className='flex-1'>
					<CardHeader className='border-b text-center'>
						<CardTitle>Total a Receber</CardTitle>
					</CardHeader>
					<CardDescription>
						<h1 className='text-center font-bold text-3xl'>
							{showValues ? (
								formatCurrencyFromCents(nonPaidAmountInCents)
							) : (
								<div className='flex items-center justify-center gap-3'>
									<DotIcon className='w-9 h-9' />
									<DotIcon className='w-9 h-9' />
									<DotIcon className='w-9 h-9' />
									<DotIcon className='w-9 h-9' />
								</div>
							)}
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
							{showValues ? (
								formatCurrencyFromCents(nonPaidAppointmentsAmountInCents)
							) : (
								<div className='flex items-center justify-center gap-3'>
									<DotIcon className='w-9 h-9' />
									<DotIcon className='w-9 h-9' />
									<DotIcon className='w-9 h-9' />
									<DotIcon className='w-9 h-9' />
								</div>
							)}
						</h1>
					</CardDescription>
				</Card>
			</div>

			<div className='flex flex-col lg:flex-row w-full gap-4'>
				<Card className='flex-1'>
					<CardHeader className='border-b text-center'>
						<CardTitle>Total de Pets Criados</CardTitle>
					</CardHeader>
					<CardDescription>
						<h1 className='text-center font-bold text-3xl'>
							<Dialog>
								<DialogTrigger>{createdPets.length}</DialogTrigger>
								<DialogContent>
									<DialogTitle>Pets Cadastrados</DialogTitle>
									<div className='flex flex-col gap-4 overflow-scroll max-h-100'>
										{createdPets.length > 0 ? (
											// adicionar sort por data de criação para mostrar os mais recentes primeiro
											createdPets
												.sort(
													(a, b) =>
														b.createdAt.getDate() - a.createdAt.getDate(),
												)
												.map((pet) => (
													<div
														key={pet.id}
														className='flex items-center justify-between gap-4 p-4 border rounded-lg'
													>
														<div className='flex items-center gap-4'>
															<div className='w-10 h-10 rounded-full bg-primary/10 p-2'>
																{pet.breed.specie.name === 'Canino' ? (
																	<DogIcon />
																) : pet.breed.specie.name === 'Felino' ? (
																	<CatIcon />
																) : (
																	<PawPrintIcon />
																)}
															</div>
															<div className='flex flex-col'>
																<h2 className='text-sm font-bold'>
																	{pet.name}
																</h2>
																<p className='text-xs'>{pet.tutor.user.name}</p>
															</div>
														</div>
													</div>
												))
										) : (
											<div>
												<h1>Nenhum pet cadastrado.</h1>
											</div>
										)}
									</div>
								</DialogContent>
							</Dialog>
						</h1>
					</CardDescription>
				</Card>

				<Card className='flex-1'>
					<CardHeader className='border-b text-center'>
						<CardTitle>Total de Clientes Criados</CardTitle>
					</CardHeader>
					<CardDescription>
						<h1 className='flex items-center justify-center font-bold text-3xl gap-4'>
							<Dialog>
								<DialogTrigger>{createdCustomers.length}</DialogTrigger>
								<DialogContent>
									<DialogTitle>Clientes Cadastrados</DialogTitle>
									<div className='flex flex-col gap-4 overflow-scroll max-h-100'>
										{createdCustomers.length > 0 ? (
											createdCustomers
												.sort(
													(a, b) =>
														b.createdAt.getDate() - a.createdAt.getDate(),
												)
												.map((customer) => (
													<div
														key={customer.id}
														className='flex items-center justify-between gap-4 p-4 border rounded-lg'
													>
														<div className='flex items-center gap-4'>
															<div className='w-10 h-10 rounded-full bg-primary/10 p-2'>
																<UserIcon />
															</div>
															<div className='flex flex-col'>
																<h2 className='text-sm font-bold'>
																	{customer.user.name}
																</h2>
																<p className='text-xs'>{customer.user.email}</p>
															</div>
														</div>
													</div>
												))
										) : (
											<div>
												<h1>Nenhum cliente cadastrado.</h1>
											</div>
										)}
									</div>
								</DialogContent>
							</Dialog>
						</h1>
					</CardDescription>
				</Card>
			</div>
		</div>
	);
};

export default DashboardCards;
