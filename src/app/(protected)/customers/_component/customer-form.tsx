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
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BanIcon, Loader2Icon, SaveIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
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
	const form = useForm<CreateCustomerWithUserSchema>({
		resolver: zodResolver(createCustomerWithUserSchema),
		shouldUnregister: true,
		defaultValues: {
			userId: customer?.user?.clerkUserId || '',
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
		form.setValue('address', fullAddress.logradouro);
		form.setValue('neighborhood', fullAddress.bairro);
		form.setValue('city', fullAddress.localidade);
		form.setValue('state', fullAddress.uf);
	};

	const formSubmit = (data: CreateCustomerWithUserSchema) => {
		upsertCustomerAction.execute({
			...data,
			id: customer?.id,
			userId: customer?.user?.clerkUserId || '',
		});
	};

	const upsertCustomerAction = useAction(upsertCustomer, {
		onSuccess: () => {
			onSuccess?.();
			toast.success('Cliente salvo com sucesso!');
			form.reset();
		},
		onError: (err) => {
			console.error({ err });
			toast.error('Ocorreu um erro ao salvar o cliente!');
		},
	});

	return (
		<DialogContent
			onInteractOutside={(e) => {
				e.preventDefault();
			}}
			showCloseButton={false}
			className='max-w-lg'
		>
			<Form {...form}>
				<form
					id='registerForm'
					onSubmit={form.handleSubmit(formSubmit)}
					className='flex flex-col gap-2'
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

					<input type='text' {...form.register('userId')} className='hidden' />

					<InputForm
						label='Nome:'
						register={form.register}
						name='name'
						error={form.formState.errors.name?.message}
					/>

					<InputForm
						label='Email:'
						register={form.register}
						name='email'
						error={form.formState.errors.email?.message}
					/>

					<div className='flex flex-col lg:flex-row gap-2'>
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

						<SelectForm
							label='Sexo:'
							control={form.control}
							error={form.formState.errors.sex?.message}
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
							control={form.control}
							error={form.formState.errors.postalCode?.message}
							format='#####-###'
							mask='x'
							name='postalCode'
							onBlur={(event) => handlePostalCodeChange(event.target.value)}
						/>

						<InputForm
							label='Número:'
							register={form.register}
							error={form.formState.errors.addressNumber?.message}
							name='addressNumber'
							type='number'
						/>
					</div>

					<InputForm
						label='Endereço:'
						register={form.register}
						name='address'
						error={form.formState.errors.address?.message}
						disabled
					/>

					<InputForm
						label='Bairro:'
						register={form.register}
						name='neighborhood'
						error={form.formState.errors.neighborhood?.message}
						disabled
					/>

					<div className='flex flex-col lg:flex-row gap-2'>
						<InputForm
							label='Cidade:'
							register={form.register}
							name='city'
							error={form.formState.errors.city?.message}
							disabled
						/>

						<InputForm
							label='Estado:'
							register={form.register}
							name='state'
							error={form.formState.errors.state?.message}
							disabled
						/>
					</div>

					<DialogFooter>
						<div className='flex flex-col lg:flex-row gap-4 w-full'>
							<DialogClose asChild>
								<Button
									type='button'
									variant={'destructive'}
									onClick={() => {
										if (!upsertCustomerAction.isPending) form.reset();
									}}
									className='flex-1'
								>
									<BanIcon />
									Cancelar
								</Button>
							</DialogClose>

							<Button
								type='submit'
								disabled={upsertCustomerAction.isPending}
								className='flex-1'
							>
								{upsertCustomerAction.isPending ? (
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
				</form>
			</Form>
		</DialogContent>
	);
};

export default CustomerFormClient;
