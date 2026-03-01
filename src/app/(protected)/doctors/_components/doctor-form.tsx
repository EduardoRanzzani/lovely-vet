'use client';

import { upsertDoctor } from '@/api/actions/doctors.actions';
import { uploadImageAction } from '@/api/actions/upload-cloudinary';
import { timesOfDay, ufs, weekDays } from '@/api/config/consts';
import {
	CreateDoctorWithUserSchema,
	createDoctorWithUserSchema,
	DoctorsWithUser,
} from '@/api/schema/doctors.schema';
import DropzoneForm from '@/components/form/image-dropzone-form';
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
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BanIcon, Loader2Icon, SaveIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface DoctorFormClientProps {
	doctor?: DoctorsWithUser;
	onSuccess?: () => void;
}

const DoctorFormClient = ({ doctor, onSuccess }: DoctorFormClientProps) => {
	const form = useForm<CreateDoctorWithUserSchema>({
		resolver: zodResolver(createDoctorWithUserSchema),
		shouldUnregister: true,
		defaultValues: {
			userId: doctor?.user?.clerkUserId || '',
			name: doctor?.user?.name || '',
			email: doctor?.user?.email || '',
			image: doctor?.user?.image || '',
			phone: doctor?.phone || '',
			cpf: doctor?.cpf || '',
			gender: (doctor?.gender as 'male' | 'female') || 'female',
			licenseNumber: doctor?.licenseNumber || '',
			licenseState: doctor?.licenseState || 'MS',
			specialty: doctor?.specialty || '',
			// Garantindo que números virem strings para o Select
			availableFromWeekDay:
				doctor?.availableFromWeekDay !== undefined
					? String(doctor.availableFromWeekDay)
					: '1',
			availableToWeekDay:
				doctor?.availableToWeekDay !== undefined
					? String(doctor.availableToWeekDay)
					: '5',
			// Horários costumam vir como "HH:mm:ss" do banco, mas o select pode esperar "HH:mm"
			availableFromTime: doctor?.availableFromTime
				? doctor.availableFromTime.substring(0, 5)
				: '08:00',
			availableToTime: doctor?.availableToTime
				? doctor.availableToTime.substring(0, 5)
				: '19:00',
		},
	});

	const formSubmit = (data: CreateDoctorWithUserSchema) => {
		upsertDoctorAction.execute({
			...data,
			id: doctor?.id,
			userId: doctor?.user?.clerkUserId || '',
		});
	};

	const upsertDoctorAction = useAction(upsertDoctor, {
		onSuccess: () => {
			toast.success(
				doctor
					? 'Veterinário atualizado com sucesso!'
					: 'Veterinário cadastrado com sucesso!',
			);
			form.reset();
			onSuccess?.();
		},
		onError: (error) => {
			console.error({ error });
			toast.error('Ocorreu um erro ao salvar o Veterinário: ' + { error });
		},
	});

	const handlePhotoUpload = async (file: File): Promise<string> => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('folder', 'doctors');

		try {
			const url = await uploadImageAction(formData);
			return url;
		} catch (error) {
			toast.error('Erro ao anexar a imagem!');
			throw error;
		}
	};

	return (
		<DialogContent
			onInteractOutside={(e) => e.preventDefault()}
			showCloseButton={false}
			className='max-w-lg h-auto overflow-scroll'
		>
			<Form {...form}>
				<form
					id='registerForm'
					onSubmit={form.handleSubmit(formSubmit)}
					className='flex flex-col gap-2'
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

					<input type='text' {...form.register('userId')} className='hidden' />

					<InputForm
						label='Nome: '
						register={form.register}
						name='name'
						error={form.formState.errors.name?.message}
					/>

					<InputForm
						label='Email: '
						register={form.register}
						name='email'
						error={form.formState.errors.email?.message}
					/>

					<DropzoneForm
						label='Foto:'
						name='image'
						control={form.control}
						onUpload={handlePhotoUpload}
						error={form.formState.errors.image?.message}
					/>

					<div className='flex flex-row gap-4'>
						<InputFormMask
							label='Telefone:'
							control={form.control}
							error={form.formState.errors.phone?.message}
							format='(##) #####-####'
							mask='x'
							name='phone'
							className='w-full lg:w-[33%]'
						/>

						<InputFormMask
							label='CPF:'
							control={form.control}
							error={form.formState.errors.cpf?.message}
							format='###.###.###-##'
							mask='x'
							name='cpf'
							className='w-full lg:w-[33%]'
						/>
					</div>

					<div className='flex flex-row gap-4'>
						<SelectForm
							label='Sexo:'
							control={form.control}
							error={form.formState.errors.gender?.message}
							name='gender'
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

						<InputForm
							label='CRMV:'
							register={form.register}
							name='licenseNumber'
							error={form.formState.errors.licenseNumber?.message}
							className='w-full lg:w-1/4'
						/>

						<SelectForm
							label='UF:'
							control={form.control}
							error={form.formState.errors.licenseState?.message}
							name='licenseState'
							options={ufs}
							className='w-full lg:w-1/4'
						/>
					</div>

					<InputForm
						label='Especialidade: '
						register={form.register}
						name='specialty'
						error={form.formState.errors.specialty?.message}
						className='w-full lg:w-2/4'
					/>

					<div className='flex flex-row gap-4'>
						<SelectForm
							label='Disponível de: '
							control={form.control}
							name='availableFromWeekDay'
							options={weekDays}
							error={form.formState.errors.availableFromWeekDay?.message}
						/>

						<SelectForm
							label='Disponível até: '
							control={form.control}
							name='availableToWeekDay'
							options={weekDays}
							error={form.formState.errors.availableToWeekDay?.message}
						/>
					</div>

					<div className='flex flex-row gap-4'>
						<SelectForm
							label='Horário de início:'
							name='availableFromTime'
							control={form.control}
							options={timesOfDay}
							className='w-full'
							error={form.formState.errors.availableFromTime?.message}
						/>

						<SelectForm
							label='Horário de Término:'
							name='availableToTime'
							control={form.control}
							options={timesOfDay}
							className='w-full'
							error={form.formState.errors.availableToTime?.message}
						/>
					</div>

					<DialogFooter>
						<div className='flex flex-row gap-4 w-full'>
							<DialogClose asChild>
								<Button
									type='button'
									variant={'destructive'}
									onClick={() => {
										if (!upsertDoctorAction.isPending) form.reset();
									}}
									className='flex-1'
								>
									<BanIcon />
									Cancelar
								</Button>
							</DialogClose>

							<Button
								type='submit'
								disabled={upsertDoctorAction.isPending}
								form='registerForm'
								className='flex-1'
							>
								{upsertDoctorAction.isPending ? (
									<Loader2Icon className='h-5 w-5 animate-spin' />
								) : (
									<>
										<SaveIcon />
										Salvar
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

export default DoctorFormClient;
