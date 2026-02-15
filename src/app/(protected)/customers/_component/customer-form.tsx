'use client';

import { upsertCustomer } from '@/api/actions/customers.actions';
import { searchAddressByPostalCode } from '@/api/config/consts';
import {
	createCustomerWithUserSchema,
	CreateCustomerWithUserSchema,
	CustomerWithUser,
} from '@/api/schema/customers.schema';
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

interface CustomerFormClientProps {
	customer?: CustomerWithUser;
	onSuccess?: () => void;
}

const CustomerFormClient = ({
	customer,
	onSuccess,
}: CustomerFormClientProps) => {
	const {
		register,
		handleSubmit,
		control,
		setValue,
		reset,
		formState: { errors },
	} = useForm<CreateCustomerWithUserSchema>({
		resolver: zodResolver(createCustomerWithUserSchema),
		shouldUnregister: true,
		defaultValues: {
			clerkUserId: customer?.user?.clerkUserId || '',
			name: customer?.user?.name || '',
			email: customer?.user?.email || '',
			phone: customer?.phone || '',
			cpf: customer?.cpf || '',
			sex: customer?.sex || 'male',
			postalCode: customer?.postalCode || '',
			address: customer?.address || '',
			addressNumber: customer?.addressNumber || '',
			neighborhood: customer?.neighborhood || '',
			city: customer?.city || '',
			state: customer?.state || '',
		},
	});

	const handlePostalCodeChange = async (postalCode: string) => {
		const fullAddress = await searchAddressByPostalCode(postalCode);
		setValue('address', fullAddress.logradouro);
		setValue('neighborhood', fullAddress.bairro);
		setValue('city', fullAddress.localidade);
		setValue('state', fullAddress.uf);
	};

	const { mutate: handleUpsertCustomer, isPending } = useMutation({
		mutationFn: upsertCustomer,
		onSuccess: () => {
			toast.success(
				customer
					? 'Cliente atualizado com sucesso!'
					: 'Cliente cadastrado com sucesso!',
			);
			reset();
			onSuccess?.();
		},
		onError: (error) => {
			console.log(error);
			toast.error('Erro ao salvar o cliente: ' + error.message);
		},
	});

	const formSubmit = (data: CreateCustomerWithUserSchema) => {
		handleUpsertCustomer({
			...data,
			id: customer?.id,
			clerkUserId: customer?.user.clerkUserId || '',
		});
	};

	return (
		<DialogContent
			onInteractOutside={(e) => {
				e.preventDefault();
			}}
			showCloseButton={false}
			className='max-w-lg'
		>
			<DialogHeader>
				<DialogTitle>
					{customer ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
				</DialogTitle>
				<DialogDescription>
					{customer
						? 'Atualize as informações do cliente selecionado'
						: 'Adicione um novo cliente ao sistema'}
				</DialogDescription>
			</DialogHeader>

			<form
				id='registerForm'
				onSubmit={handleSubmit(formSubmit)}
				className='flex flex-col gap-2'
			>
				<input type='text' {...register('clerkUserId')} className='hidden' />

				<InputForm
					label='Nome:'
					register={register}
					name='name'
					error={errors.name?.message}
				/>

				<InputForm
					label='Email:'
					register={register}
					name='email'
					error={errors.email?.message}
				/>

				<div className='flex flex-col lg:flex-row gap-2'>
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
								key: 'male',
							},
							{
								value: 'female',
								label: 'Feminino',
								key: 'female',
							},
						]}
						className='w-full lg:w-[33%]'
					/>
				</div>

				<div className='flex flex-col lg:flex-row gap-2'>
					<InputFormMask
						label='CEP:'
						control={control}
						error={errors.postalCode?.message}
						format='#####-###'
						mask='x'
						name='postalCode'
						onBlur={(event) => handlePostalCodeChange(event.target.value)}
					/>

					<InputForm
						label='Número:'
						register={register}
						error={errors.addressNumber?.message}
						name='addressNumber'
						type='number'
					/>
				</div>

				<InputForm
					label='Endereço:'
					register={register}
					name='address'
					error={errors.address?.message}
					disabled
				/>

				<InputForm
					label='Bairro:'
					register={register}
					name='neighborhood'
					error={errors.neighborhood?.message}
					disabled
				/>

				<div className='flex flex-col lg:flex-row gap-2'>
					<InputForm
						label='Cidade:'
						register={register}
						name='city'
						error={errors.city?.message}
						disabled
					/>

					<InputForm
						label='Estado:'
						register={register}
						name='state'
						error={errors.state?.message}
						disabled
					/>
				</div>
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

export default CustomerFormClient;
