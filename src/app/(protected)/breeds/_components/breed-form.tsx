import { upsertBreed } from '@/api/actions/breeds.actions';
import { getSpecies } from '@/api/actions/species.actions';
import {
	BreedsWithSpecies,
	createBreedSchema,
	CreateBreedSchema,
} from '@/api/schema/breeds.schema';
import { Specie } from '@/api/schema/species.schema';
import InputForm from '@/components/form/input-form';
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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface BreedFormClientProps {
	breed?: BreedsWithSpecies;
	onSuccess?: () => void;
}

const BreedFormClient = ({ breed, onSuccess }: BreedFormClientProps) => {
	const [species, setSpecies] = useState<Specie[]>([]);

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateBreedSchema>({
		resolver: zodResolver(createBreedSchema),
		shouldUnregister: true,
		defaultValues: {
			name: breed?.name || '',
			specieId: breed?.specieId || '',
		},
	});

	useEffect(() => {
		const fetchData = async () => {
			const species = await getSpecies();
			setSpecies(species);
		};

		if (breed) {
			reset({
				id: breed.id,
				name: breed.name,
				specieId: breed.specieId,
			});
		}

		fetchData();
	}, [breed, reset]);

	const { mutate: handleUpsertBreed, isPending } = useMutation({
		mutationFn: upsertBreed,
		onSuccess: () => {
			toast.success(
				breed ? 'Raça atualizada com sucesso!' : 'Raça cadastrada com sucesso!',
			);
			reset();
			onSuccess?.();
		},
		onError: (error) => {
			console.log(error);
			toast.error('Erro ao salvar a raça: ' + error.message);
		},
	});

	const formSubmit = (data: CreateBreedSchema) => {
		handleUpsertBreed(data);
	};

	return (
		<DialogContent
			onInteractOutside={(e) => e.preventDefault()}
			showCloseButton={false}
			className='max-w-lg'
		>
			<DialogHeader>
				<DialogTitle>{breed ? 'Atualizar Raça' : 'Cadastrar Raça'}</DialogTitle>
				<DialogDescription>
					{breed
						? 'Atualize as informações da raça selecionada'
						: 'Adicione uma nova raça ao sistema'}
				</DialogDescription>
			</DialogHeader>

			<form
				id='registerForm'
				onSubmit={handleSubmit(formSubmit)}
				className='flex flex-col gap-4'
			>
				<SelectForm
					label='Espécie:'
					name='specieId'
					control={control}
					error={errors.specieId?.message}
					options={species.map((specie) => ({
						value: specie.id,
						label: specie.name,
						key: specie.id,
					}))}
				/>

				<InputForm
					label='Descrição:'
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

export default BreedFormClient;
