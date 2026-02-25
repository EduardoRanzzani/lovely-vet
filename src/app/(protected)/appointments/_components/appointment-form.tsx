'use client';

import { upsertAppointment } from '@/api/actions/appointments.actions';
import {
	AppointmentsWithRelations,
	createAppointmentSchema,
	CreateAppointmentSchema,
} from '@/api/schema/appointments.schema';
import { DoctorsWithUser } from '@/api/schema/doctors.schema';
import { PetWithTutorAndBreed } from '@/api/schema/pets.schema';
import { Services } from '@/api/schema/services.schema';
import DateTimePickerForm from '@/components/form/datetimepicker-form';
import InputForm from '@/components/form/input-form';
import MoneyInputForm from '@/components/form/money-input-form';
import SelectForm from '@/components/form/select-form';
import { Button } from '@/components/ui/button';
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BanIcon, Loader2Icon, SaveIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useEffect } from 'react'; // Adicione o useEffect
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface AppointmentFormClientProps {
	appointment?: AppointmentsWithRelations;
	pets: PetWithTutorAndBreed[];
	doctors: DoctorsWithUser[];
	services: Services[];
	onSuccess?: () => void;
}

const AppointmentFormClient = ({
	appointment,
	pets,
	doctors,
	services,
	onSuccess,
}: AppointmentFormClientProps) => {
	const form = useForm<CreateAppointmentSchema>({
		resolver: zodResolver(createAppointmentSchema),
		shouldUnregister: true,
		defaultValues: {
			petId: appointment?.petId || '',
			doctorId: appointment?.doctorId || '',
			scheduledAt: appointment?.scheduledAt
				? new Date(appointment.scheduledAt)
				: new Date(),
			status: appointment?.status || 'pending',
			totalPriceInCents: appointment?.totalPriceInCents
				? appointment.totalPriceInCents / 100
				: 0,
			notes: appointment?.notes || '',
			// Importante: inicializar o array de serviços se estiver editando
			services: appointment?.items?.map((i) => i.serviceId) || [],
		},
	});

	const selectedServicesIds = form.watch('services');

	useEffect(() => {
		if (selectedServicesIds && selectedServicesIds.length > 0) {
			const total = services
				.filter((s) => selectedServicesIds.includes(s.id))
				.reduce((acc, curr) => acc + curr.priceInCents / 100, 0);

			// Atualiza o campo de valor total (em reais/decimal para o MoneyInput)
			form.setValue('totalPriceInCents', total, { shouldValidate: true });
		} else {
			form.setValue('totalPriceInCents', 0);
		}
	}, [selectedServicesIds, services, form]);

	const formSubmit = (data: CreateAppointmentSchema) => {
		upsertAppointmentAction.execute({
			...data,
			id: appointment?.id,
			status: appointment?.status || 'pending',
		});
	};

	const upsertAppointmentAction = useAction(upsertAppointment, {
		onSuccess: () => {
			onSuccess?.();
			toast.success('Agendamento salvo com sucesso!');
			form.reset();
		},
		onError: (err) => {
			console.error('Erro ao salvar agendamento:', err);
			toast.error('Ocorreu um erro ao salvar o agendamento.');
		},
	});

	console.log(form.formState.errors);

	return (
		<DialogContent
			className='sm:max-w-120 w-[95vw]'
			onInteractOutside={(e) => e.preventDefault()}
		>
			<Form {...form}>
				<form
					id='appointmentForm'
					onSubmit={form.handleSubmit(formSubmit)}
					className='flex flex-col gap-4'
				>
					<DialogHeader>
						<DialogTitle>
							{appointment ? 'Atualizar Agendamento' : 'Cadastrar Agendamento'}
						</DialogTitle>
						<DialogDescription>
							Selecione o pet, o veterinário e os serviços prestados.
						</DialogDescription>
					</DialogHeader>

					<input type='text' className='hidden' {...form.register('status')} />

					<SelectForm
						label='Pet:'
						name='petId'
						control={form.control}
						error={form.formState.errors.petId?.message}
						options={pets.map((pet) => ({
							value: pet.id,
							label: `${pet.name} (${pet.tutor.user.name})`,
						}))}
					/>

					<SelectForm
						label='Veterinário:'
						name='doctorId'
						control={form.control}
						error={form.formState.errors.doctorId?.message}
						options={doctors.map((doctor) => ({
							value: doctor.id,
							label: doctor.user.name,
						}))}
					/>

					<SelectForm
						label='Serviços (Selecione um ou mais):'
						name='services'
						multiple // Certifique-se que seu SelectForm suporta a prop multiple
						control={form.control}
						error={form.formState.errors.services?.message}
						options={services.map((service) => ({
							value: service.id,
							label: `${service.name} - R$ ${(service.priceInCents / 100).toFixed(2)}`,
						}))}
					/>

					<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
						<DateTimePickerForm
							label='Data e Hora:'
							control={form.control}
							name='scheduledAt'
							error={form.formState.errors.scheduledAt?.message}
						/>

						<MoneyInputForm
							label='Valor Total (Editável):'
							control={form.control}
							name='totalPriceInCents'
							error={form.formState.errors.totalPriceInCents?.message}
						/>
					</div>

					<InputForm
						label='Observações:'
						register={form.register}
						name='notes'
						error={form.formState.errors.notes?.message}
					/>

					<DialogFooter>
						<div className='flex flex-col w-full gap-4 lg:flex-row'>
							<DialogClose asChild>
								<Button type='button' variant='destructive' className='flex-1'>
									<BanIcon className='w-4 h-4 mr-2' /> Cancelar
								</Button>
							</DialogClose>

							<Button
								type='submit'
								disabled={upsertAppointmentAction.isPending}
								className='flex-1'
							>
								{upsertAppointmentAction.isPending ? (
									<Loader2Icon className='w-5 h-5 animate-spin' />
								) : (
									<>
										<SaveIcon className='w-4 h-4 mr-2' /> Salvar
									</>
								)}
							</Button>
						</div>
					</DialogFooter>
				</form>
			</Form>
		</DialogContent>
	);
};

export default AppointmentFormClient;
