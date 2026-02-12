'use client';

import { createCustomer } from '@/api/actions/customers.actions';
import { searchAddressByPostalCode } from '@/api/config/consts';
import { createCustomerSchema } from '@/api/schema/customers.schema';
import InputForm from '@/components/form/input-form';
import InputFormMask from '@/components/form/input-form-mask';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { SaveIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const OnboardingCustomerFormDialog = ({ isOpen }: { isOpen: boolean }) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<z.infer<typeof createCustomerSchema>>({
		resolver: zodResolver(createCustomerSchema),
		defaultValues: {
			phone: '',
			cpf: '',
			postalCode: '',
			addressNumber: '',
			address: '',
			neighborhood: '',
			city: '',
			state: '',
		},
	});

	const handlePostalCodeChange = async (postalCode: string) => {
		const fullAddress = await searchAddressByPostalCode(postalCode);
		setValue('address', fullAddress.logradouro);
		setValue('neighborhood', fullAddress.bairro);
		setValue('city', fullAddress.localidade);
		setValue('state', fullAddress.uf);
	};

	const resetForm = () => {
		setValue('phone', '');
		setValue('cpf', '');
		setValue('postalCode', '');
		setValue('address', '');
		setValue('addressNumber', '');
		setValue('neighborhood', '');
		setValue('city', '');
		setValue('state', '');
	};

	const { mutate: handleCreateCustomer, isPending } = useMutation({
		mutationFn: createCustomer,
		onSuccess: () => {
			toast.success('Dados atualizados com sucesso!');
			resetForm();
		},
		onError: (error) => {
			console.error(error);
			toast.error(
				'Não foi possível atualizar os dados. Tente novamente mais tarde',
			);
		},
	});

	const submitForm = (data: z.infer<typeof createCustomerSchema>) => {
		console.log('teste');
		handleCreateCustomer(data);
	};

	return (
		<Dialog open={isOpen}>
			<DialogContent
				className='sm:max-w-xl'
				onPointerDownOutside={(e) => e.preventDefault()}
				showCloseButton={false}
			>
				<DialogHeader>
					<DialogTitle>Complete seu cadastro</DialogTitle>
					<DialogDescription>
						Precisamos de mais alguns dados para finalizar o seu cadastro no
						sistema.
					</DialogDescription>
				</DialogHeader>

				<form
					id='registerForm'
					onSubmit={handleSubmit(submitForm)}
					className='flex flex-col gap-2'
				>
					<span className='flex gap-4'>
						<InputFormMask
							label='Telefone:'
							register={register}
							error={errors.phone?.message}
							format='(##) #####-####'
							mask='x'
							name='phone'
						/>

						<InputFormMask
							label='CPF:'
							register={register}
							error={errors.cpf?.message}
							format='###.###.###-##'
							mask='x'
							name='cpf'
						/>
					</span>

					<span className='flex gap-4'>
						<InputFormMask
							label='CEP:'
							register={register}
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
					</span>

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

					<span className='flex gap-4'>
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
					</span>
				</form>

				<DialogFooter>
					<Button
						type='submit'
						disabled={isPending}
						className='w-full'
						form='registerForm'
					>
						<SaveIcon />
						Salvar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default OnboardingCustomerFormDialog;
