'use client';

import { onboardingCustomer } from '@/api/actions/customers.actions';
import { searchAddressByPostalCode } from '@/api/config/consts';
import {
	OnboardingCustomerSchema,
	onboardingCustomerSchema,
} from '@/api/schema/customers.schema';
import InputForm from '@/components/form/input-form';
import InputFormMask from '@/components/form/input-form-mask';
import SelectForm from '@/components/form/select-form';
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

const OnboardingCustomerFormDialog = ({ isOpen }: { isOpen: boolean }) => {
	const {
		control,
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<OnboardingCustomerSchema>({
		resolver: zodResolver(onboardingCustomerSchema),
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
		setValue('sex', 'male');
		setValue('postalCode', '');
		setValue('address', '');
		setValue('addressNumber', '');
		setValue('neighborhood', '');
		setValue('city', '');
		setValue('state', '');
	};

	const { mutate: handleCreateCustomer, isPending } = useMutation({
		mutationFn: onboardingCustomer,
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

	const submitForm = (data: OnboardingCustomerSchema) => {
		handleCreateCustomer(data);
	};

	console.log({ errors });

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
							control={control}
							error={errors.phone?.message}
							format='(##) #####-####'
							mask='x'
							name='phone'
							className='w-[33%]'
						/>

						<InputFormMask
							label='CPF:'
							control={control}
							error={errors.cpf?.message}
							format='###.###.###-##'
							mask='x'
							name='cpf'
							className='w-[33%]'
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
							className='w-[33%]'
						/>
					</span>

					<span className='flex gap-4'>
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
