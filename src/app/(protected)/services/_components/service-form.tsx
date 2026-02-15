import { upsertService } from '@/api/actions/services.actions';
import {
	createServiceSchema,
	CreateServiceSchema,
	Services,
} from '@/api/schema/services.schema';
import InputForm from '@/components/form/input-form';
import MoneyInputForm from '@/components/form/money-input-form';
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

interface ServiceFormClientProps {
	service?: Services;
	onSuccess?: () => void;
}

const ServiceFormClient = ({ service, onSuccess }: ServiceFormClientProps) => {
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<CreateServiceSchema>({
		resolver: zodResolver(createServiceSchema),
		shouldUnregister: true,
		defaultValues: {
			name: service?.name || '',
			description: service?.description || '',
			priceInCents: service?.priceInCents || 0,
		},
	});

	const { mutate: handleUpsertService, isPending } = useMutation({
		mutationFn: upsertService,
		onSuccess: () => {
			toast.success(
				service
					? 'Serviço atualizado com sucesso!'
					: 'Serviço cadastrado com sucesso!',
			);
			reset();
			onSuccess?.();
		},
		onError: (error) => {
			console.log(error);
			toast.error('Erro ao salvar o serviço: ' + error.message);
		},
	});

	const formSubmit = (data: CreateServiceSchema) => {
		handleUpsertService(data);
	};

	return (
		<DialogContent
			onInteractOutside={(e) => e.preventDefault()}
			showCloseButton={false}
			className='max-w-lg'
		>
			<DialogHeader>
				<DialogTitle>
					{service ? 'Editar Serviço' : 'Cadastrar Serviço'}
				</DialogTitle>
				<DialogDescription>
					{service
						? 'Atualize as informações do serviço selecionado'
						: 'Adicione um novo serviço ao sistema'}
				</DialogDescription>
			</DialogHeader>

			<form
				id='registerForm'
				onSubmit={handleSubmit(formSubmit)}
				className='flex flex-col gap-4'
			>
				<InputForm
					label='Nome:'
					register={register}
					name='name'
					error={errors.name?.message}
				/>

				<MoneyInputForm
					label='Valor:'
					control={control}
					name='priceInCents'
					error={errors.priceInCents?.message}
				/>

				<InputForm
					label='Descrição:'
					register={register}
					name='description'
					error={errors.description?.message}
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

export default ServiceFormClient;
