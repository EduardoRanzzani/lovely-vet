'use client';
import { getBreeds } from '@/api/actions/breeds.actions';
import { getCustomers } from '@/api/actions/customers.actions';
import { upsertPet } from '@/api/actions/pets.actions';
import { getSpecies } from '@/api/actions/species.actions';
import { BreedsWithSpecies } from '@/api/schema/breeds.schema';
import { CustomerWithUser } from '@/api/schema/customers.schema';
import {
	createPetWithTutorAndBreedSchema,
	CreatePetWithTutorAndBreedSchema,
	PetsWithTutorAndBreed,
} from '@/api/schema/pets.schema';
import { Species } from '@/api/schema/species.schema';
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

interface PetFormClientProps {
	pet?: PetsWithTutorAndBreed;
	onSuccess?: () => void;
}

const PetFormClient = ({ pet, onSuccess }: PetFormClientProps) => {
	const [filteredBreeds, setFilteredBreeds] = useState<BreedsWithSpecies[]>([]);
	const [breeds, setBreeds] = useState<BreedsWithSpecies[]>([]);
	const [species, setSpecies] = useState<Species[]>([]);
	const [customers, setCustomers] = useState<CustomerWithUser[]>([]);

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<CreatePetWithTutorAndBreedSchema>({
		resolver: zodResolver(createPetWithTutorAndBreedSchema),
		shouldUnregister: true,
		defaultValues: {
			name: pet?.name || '',
			birthDate: pet?.birthDate || new Date().toISOString().split('T')[0],
			speciesId: pet?.breed?.speciesId || '',
			breedId: pet?.breed?.id || '',
			gender: pet?.gender || 'male',
			sterile: pet?.sterile ? 'true' : 'false',
			color: pet?.color || '',
			weight: pet?.weight || '',
			observations: pet?.observations || '',
		},
	});

	// Dentro do PetFormClient
	useEffect(() => {
		const fetchData = async () => {
			// Busca todos em paralelo para ganhar performance
			const [speciesData, breedsData, customersData] = await Promise.all([
				getSpecies(),
				getBreeds(),
				getCustomers(),
			]);

			setSpecies(speciesData);
			setBreeds(breedsData);
			setCustomers(customersData);

			// Se estiver editando um pet, agora que as listas existem,
			// garantimos que o formulário tenha os valores e os filtros corretos.
			if (pet) {
				// Filtra as raças para que o Select de Raça mostre as opções certas
				setFilteredBreeds(
					breedsData.filter((b) => b.speciesId === pet.breed.speciesId),
				);

				// Força o reset do formulário com os dados do pet
				if (pet) {
					setFilteredBreeds(
						breedsData.filter((b) => b.speciesId === pet.breed.speciesId),
					);

					reset({
						id: pet.id,
						name: pet.name,
						birthDate: pet.birthDate,
						tutorId: pet.customerId, // Mapeando customerId do banco para tutorId do form
						speciesId: pet.breed.speciesId,
						breedId: pet.breed.id,
						gender: pet.gender as 'male' | 'female',
						sterile: pet.sterile ? 'true' : 'false',
						color: pet.color ?? '', // Se for null no banco, vira string vazia
						weight: pet.weight ?? '', // Se for null no banco, vira string vazia
						photo: pet.photo ?? undefined, // Converte null para undefined
						observations: pet.observations ?? '',
					});
				}
			}
		};

		fetchData();
	}, [pet, reset]); // Removi o setValue individual para usar o reset completo

	const { mutate: handleUpsertCustomer, isPending } = useMutation({
		mutationFn: upsertPet,
		onSuccess: () => {
			toast.success(
				pet ? 'Pet atualizado com sucesso!' : 'Pet cadastrado com sucesso!',
			);
			reset();
			onSuccess?.();
		},
		onError: (error) => {
			console.log(error);
			toast.error('Erro ao salvar o pet: ' + error.message);
		},
	});

	useEffect(() => {
		if (pet?.breed?.speciesId) {
			handleSpeciesChange(pet.breed.speciesId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pet]);

	const handleSpeciesChange = (
		specieId: string | number | (string | number)[],
	) => {
		setFilteredBreeds(breeds.filter((breed) => breed.speciesId === specieId));
	};

	const formSubmit = (data: CreatePetWithTutorAndBreedSchema) => {
		handleUpsertCustomer(data);
	};

	return (
		<DialogContent
			onInteractOutside={(e) => e.preventDefault()}
			showCloseButton={false}
			className='max-w-lg'
		>
			<DialogHeader>
				<DialogTitle>{pet ? 'Atualizar Pet' : 'Cadastrar Pet'}</DialogTitle>
				<DialogDescription>
					{pet
						? 'Atualize as informações do pet selecionadl'
						: 'Adicione um novo pet ao sistema'}
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

				<div className='flex flex-col lg:flex-row items-center gap-2 w-full'>
					<InputForm
						label='Nascimento:'
						type='date'
						register={register}
						name='birthDate'
						error={errors.birthDate?.message}
						className='w-1/3'
					/>

					<SelectForm
						label='Gênero:'
						control={control}
						error={errors.gender?.message}
						name='gender'
						options={[
							{
								value: 'male',
								label: 'Macho',
								key: 'male',
							},
							{
								value: 'female',
								label: 'Fêmea',
								key: 'female',
							},
						]}
						className='w-1/3'
					/>

					<SelectForm
						label='Castrado?'
						control={control}
						error={errors.sterile?.message}
						name='sterile'
						options={[
							{
								value: 'true',
								label: 'Sim',
								key: 'true',
							},
							{
								value: 'false',
								label: 'Não',
								key: 'false',
							},
						]}
						className='w-1/3'
					/>
				</div>

				<div className='flex flex-col lg:flex-row items-center gap-2 w-full'>
					<SelectForm
						label='Espécie:'
						name='speciesId'
						control={control}
						error={errors.speciesId?.message}
						onSelect={(selectedId) => handleSpeciesChange(selectedId)}
						options={species.map((specie) => ({
							value: specie.id,
							label: specie.name,
							key: specie.id,
						}))}
						className='w-1/4'
					/>

					<SelectForm
						label='Raça:'
						name='breedId'
						control={control}
						error={errors.breedId?.message}
						options={filteredBreeds.map((breed) => ({
							value: breed.id,
							label: breed.name,
							key: breed.id,
						}))}
						className='w-2/4'
					/>

					<InputForm
						label='Peso:'
						register={register}
						name='weight'
						error={errors.weight?.message}
						className='w-1/4'
					/>
				</div>

				<div className='flex flex-col lg:flex-row items-center gap-2 w-full'>
					<InputForm
						label='Pelagem:'
						register={register}
						name='color'
						error={errors.color?.message}
						className='w-1/3'
					/>

					<SelectForm
						label='Tutor:'
						control={control}
						error={errors.tutorId?.message}
						name='tutorId'
						options={customers.map((customer) => ({
							value: customer.id,
							label: customer.user.name,
							key: customer.id,
						}))}
						className='w-2/3'
					/>
				</div>

				<InputForm
					label='Observações:'
					register={register}
					name='observations'
					error={errors.observations?.message}
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

export default PetFormClient;
