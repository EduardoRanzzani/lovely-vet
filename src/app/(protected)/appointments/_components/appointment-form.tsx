import { upsertAppointment } from '@/api/actions/appointments.actions';
import {
	AppointmentsWithPetAndServiceAndDoctor,
	createAppointmentSchema,
	CreateAppointmentSchema,
} from '@/api/schema/appointments.schema';
import { DoctorsWithUser } from '@/api/schema/doctors.schema';
import { PetWithTutorAndBreed } from '@/api/schema/pets.schema';
import { Services } from '@/api/schema/services.schema';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { BanIcon, Loader2Icon, SaveIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface AppointmentFormClientProps {
	appointment?: AppointmentsWithPetAndServiceAndDoctor;
	services: Services[];
	pets: PetWithTutorAndBreed[];
	doctors: DoctorsWithUser[];
	onSuccess?: () => void;
}

const AppointmentFormClient = ({
	appointment,
	services,
	pets,
	doctors,
	onSuccess,
}: AppointmentFormClientProps) => {
	const {
		control,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = useForm<CreateAppointmentSchema>({
		resolver: zodResolver(createAppointmentSchema),
		shouldUnregister: true,
	});

	const { mutate: handleUpsertAppointment, isPending } = useMutation({
		mutationFn: upsertAppointment,
		onSuccess: () => {
			toast.success(
				appointment
					? 'Agendamento atualizado com sucesso!'
					: 'Agendamento cadastrado com sucesso!',
			);
			reset();
			onSuccess?.();
		},
		onError: (error) => {
			toast.error('Erro ao salvar a raça: ' + error.message);
		},
	});

	const handleServiceChange = (
		serviceId: string | number | (string | number)[],
	) => {
		const price = services.find((s) => s.id === serviceId)?.priceInCents || 0;

		setValue('totalPriceInCents', price / 100);
	};

	const formSubmit = (data: CreateAppointmentSchema) => {
		handleUpsertAppointment(data);
	};

	console.log({ errors });

	return (
		<DialogContent
			onInteractOutside={(e) => e.preventDefault()}
			showCloseButton={false}
			className='max-w-lg'
		>
			<DialogHeader>
				<DialogTitle>
					{appointment ? 'Atualizar Agendamento' : 'Cadastrar Agendamento'}
				</DialogTitle>
				<DialogDescription>
					{appointment
						? 'Atualize as informações do agendamento selecionado'
						: 'Adicione um novo agendamento ao sistema'}
				</DialogDescription>
			</DialogHeader>

			<form
				id='registerForm'
				onSubmit={handleSubmit(formSubmit)}
				className='flex flex-col gap-4'
			>
				<SelectForm
					label='Pet:'
					control={control}
					error={errors.petId?.message}
					name='petId'
					options={pets.map((pet) => ({
						value: pet.id,
						label: pet.name,
						key: pet.id,
					}))}
				/>

				<SelectForm
					label='Serviço:'
					control={control}
					error={errors.serviceId?.message}
					name='serviceId'
					options={services.map((service) => ({
						value: service.id,
						label: service.name,
						key: service.id,
					}))}
					onSelect={(selectedService) => handleServiceChange(selectedService)}
				/>

				<SelectForm
					label='Veterinário:'
					control={control}
					error={errors.veterinarianId?.message}
					name='veterinarianId'
					options={doctors.map((doctor) => ({
						value: doctor.id,
						label: doctor.user.name,
						key: doctor.id,
					}))}
				/>

				<MoneyInputForm
					label='Preço:'
					control={control}
					error={errors.totalPriceInCents?.message}
					name='totalPriceInCents'
				/>
			</form>

			<DialogFooter>
				<div className='flex flex-col lg:flex-row gap-4 w-full'>
					<DialogClose asChild>
						<Button
							type='button'
							variant={'destructive'}
							onClick={() => {
								if (!isPending) reset();
							}}
							className='flex-1'
						>
							<BanIcon />
							Cancelar
						</Button>
					</DialogClose>

					<Button
						type='submit'
						disabled={isPending}
						form='registerForm'
						className='flex-1'
					>
						{isPending ? (
							<Loader2Icon className='h-5 w-5 animate-spin' />
						) : (
							<>
								<SaveIcon className='mr-2 h-4 w-4' />
								Salvar
							</>
						)}
					</Button>
				</div>
			</DialogFooter>
		</DialogContent>
	);
};

export default AppointmentFormClient;
