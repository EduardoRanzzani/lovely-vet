import { upsertSpecie } from '@/api/actions/species.actions';
import {
	createSpecieSchema,
	CreateSpecieSchema,
	Specie,
} from '@/api/schema/species.schema';
import InputForm from '@/components/form/input-form';
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

interface SpecieFormClientProps {
	specie?: Specie;
	onSuccess?: () => void;
}

const SpecieFormClient = ({ specie, onSuccess }: SpecieFormClientProps) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateSpecieSchema>({
		resolver: zodResolver(createSpecieSchema),
		shouldUnregister: true,
		defaultValues: {
			name: specie?.name || '',
		},
	});

	const { mutate: handleUpsertSpecie, isPending } = useMutation({
		mutationFn: upsertSpecie,
		onSuccess: () => {
			toast.success(
				specie
					? 'Espécie atualizada com sucesso!'
					: 'Espécie cadastrada com sucesso!',
			);
			reset();
			onSuccess?.();
		},
		onError: (error) => {
			toast.error('Erro ao salvar a espécie: ' + error.message);
		},
	});

	const formSubmit = (data: CreateSpecieSchema) => {
		handleUpsertSpecie({
			...data,
			id: specie?.id,
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
					{specie ? 'Atualizar Espécie' : 'Cadastrar Espécie'}
				</DialogTitle>
				<DialogDescription>
					{specie
						? 'Atualize as informações da espécie selecionada'
						: 'Adicione uma nova espécie ao sistema'}
				</DialogDescription>
			</DialogHeader>

			<form
				id='registerForm'
				onSubmit={handleSubmit(formSubmit)}
				className='flex flex-col gap-2'
			>
				<InputForm
					label='Descrição'
					register={register}
					name='name'
					error={errors.name?.message}
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

export default SpecieFormClient;
