'use client';

import { upsertDoctor } from '@/api/actions/doctors.actions';
import { timesOfDay, ufs, weekDays } from '@/api/config/consts';
import {
	CreateDoctorWithUserSchema,
	createDoctorWithUserSchema,
	DoctorsWithUser,
} from '@/api/schema/doctors.schema';
import InputForm from '@/components/form/input-form';
import InputFormMask from '@/components/form/input-mask-form';
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

interface DoctorFormClientProps {
	doctor?: DoctorsWithUser;
	onSuccess?: () => void;
}

const DoctorFormClient = ({ doctor, onSuccess }: DoctorFormClientProps) => {
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<CreateDoctorWithUserSchema>({
		resolver: zodResolver(createDoctorWithUserSchema),
		shouldUnregister: true,
		defaultValues: {
			userId: doctor?.user?.clerkUserId || '',
			name: doctor?.user?.name || '',
			email: doctor?.user?.email || '',
			phone: doctor?.phone || '',
			cpf: doctor?.cpf || '',
			sex: doctor?.sex || 'female',
			licenseNumber: doctor?.licenseNumber || '',
			licenseState: doctor?.licenseState || 'MS',
			specialty: doctor?.specialty || '',
			availableFromWeekDay: doctor?.availableFromWeekDay?.toString() || '1',
			availableToWeekDay: doctor?.availableToWeekDay?.toString() || '5',
			availableFromTime: doctor?.availableFromTime?.toString() || '08:00',
			availableToTime: doctor?.availableToTime?.toString() || '19:00',
		},
	});

	const { mutate: handleUpsertDoctor, isPending } = useMutation({
		mutationFn: upsertDoctor,
		onSuccess: () => {
			toast.success(
				doctor
					? 'Veterinário atualizado com sucesso!'
					: 'Veterinário cadastrado com sucesso!',
			);
			reset();
			onSuccess?.();
		},
		onError: (error) => {
			toast.error('Erro ao salvar o Veterinário: ' + error.message);
		},
	});

	const formSubmit = (data: CreateDoctorWithUserSchema) => {
		handleUpsertDoctor({
			...data,
			id: doctor?.id,
			userId: doctor?.user.clerkUserId || '',
		});
	};

	return (
		<DialogContent
			onInteractOutside={(e) => e.preventDefault()}
			showCloseButton={false}
			className='max-w-lg'
		>
			<DialogHeader>
				<DialogTitle>
					{doctor ? 'Editar Veterinário' : 'Cadastrar Veterinário'}
				</DialogTitle>
				<DialogDescription>
					{doctor
						? 'Atualize as informações do Veterinário selecionado'
						: 'Adicione um novo Veterinário ao sistema'}
				</DialogDescription>
			</DialogHeader>

			<form
				id='registerForm'
				onSubmit={handleSubmit(formSubmit)}
				className='flex flex-col gap-2'
			>
				<input type='text' {...register('userId')} className='hidden' />

				<InputForm
					label='Nome: '
					register={register}
					name='name'
					error={errors.name?.message}
				/>

				<InputForm
					label='Email: '
					register={register}
					name='email'
					error={errors.email?.message}
				/>

				<div className='w-full flex flex-col lg:flex-row gap-2'>
					<InputFormMask
						label='Telefone:'
						control={control}
						error={errors.phone?.message}
						format='(##) #####-####'
						mask='x'
						name='phone'
						className='w-full lg:w-[33%]'
					/>

					<InputFormMask
						label='CPF:'
						control={control}
						error={errors.cpf?.message}
						format='###.###.###-##'
						mask='x'
						name='cpf'
						className='w-full lg:w-[33%]'
					/>

					<SelectForm
						label='Sexo:'
						control={control}
						error={errors.sex?.message}
						name='sex'
						options={[
							{
								value: 'male',
								label: 'Masculino',
							},
							{
								value: 'female',
								label: 'Feminino',
							},
						]}
						className='w-full lg:w-[33%]'
					/>
				</div>

				<div className='flex flex-col lg:flex-row w-full gap-2'>
					<InputForm
						label='CRMV:'
						register={register}
						name='licenseNumber'
						error={errors.licenseNumber?.message}
						className='w-full lg:w-1/4'
					/>

					<SelectForm
						label='UF:'
						control={control}
						error={errors.licenseState?.message}
						name='licenseState'
						options={ufs}
						className='w-full lg:w-1/4'
					/>

					<InputForm
						label='Especialidade: '
						register={register}
						name='specialty'
						error={errors.specialty?.message}
						className='w-full lg:w-2/4'
					/>
				</div>

				<div className='flex flex-col lg:flex-row w-full gap-2'>
					<SelectForm
						label='Disponível de: '
						control={control}
						name='availableFromWeekDay'
						options={weekDays}
						error={errors.availableFromWeekDay?.message}
					/>

					<SelectForm
						label='Disponível até: '
						control={control}
						name='availableToWeekDay'
						options={weekDays}
						error={errors.availableToWeekDay?.message}
					/>
				</div>

				<div className='flex flex-col lg:flex-row w-full gap-2'>
					<SelectForm
						label='Horário de início:'
						name='availableFromTime'
						control={control}
						options={timesOfDay}
						className='w-full'
						error={errors.availableFromTime?.message}
					/>

					<SelectForm
						label='Horário de Término:'
						name='availableToTime'
						control={control}
						options={timesOfDay}
						className='w-full'
						error={errors.availableToTime?.message}
					/>
				</div>
			</form>

			<DialogFooter>
				<div className='flex flex-col lg:flex-row gap-2 w-full'>
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

export default DoctorFormClient;
