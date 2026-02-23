'use client';

import { deletePet } from '@/api/actions/pets.actions';
import { MAX_PAGE_SIZE, PaginatedData } from '@/api/config/consts';
import { BreedsWithSpecies } from '@/api/schema/breeds.schema';
import { CustomerWithUser } from '@/api/schema/customers.schema';
import { PetWithTutorAndBreed } from '@/api/schema/pets.schema';
import { Specie } from '@/api/schema/species.schema';
import { calculateAge, getInitials } from '@/api/util';
import DeleteButton from '@/components/list/delete-button';
import SearchInput from '@/components/list/search-input';
import TableComponent from '@/components/list/table-component';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge'; // Opcional: para status ou gênero
import { TableCell, TableRow } from '@/components/ui/table';
import { handleNavigation } from '@/lib/utils';
import { useAction } from 'next-safe-action/hooks';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import { toast } from 'sonner';
import AddPetButton from './add-pet-button';
import EditPetButton from './edit-pet-button';
import { formatWeight } from '@/helpers/weight';

interface PetsListClientProps {
	pets: Promise<PaginatedData<PetWithTutorAndBreed>>;
	species: Specie[];
	breeds: BreedsWithSpecies[];
	customers: CustomerWithUser[];
}

const PetsListClient = ({
	pets,
	species,
	breeds,
	customers,
}: PetsListClientProps) => {
	const petsResolved = use(pets);
	const searchParams = useSearchParams();

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());
		handleNavigation(params);
	};

	// Formata gramas para Kg com uma casa decimal
	const handleDelete = (petId: string) => {
		deletePetAction.execute({
			id: petId,
		});
	};

	const deletePetAction = useAction(deletePet, {
		onSuccess: () => {
			toast.success('Pet deletado com sucesso!');
		},
		onError: (err) => {
			console.error('Erro ao deletar pet:', err);
			toast.error(
				'Ocorreu um erro ao tentar deletar o pet. Tente novamente mais tarde.',
			);
		},
	});

	const columns = [
		{ header: 'Nome', accessorKey: 'name' },
		{ header: 'Idade', accessorKey: 'age' },
		{ header: 'Peso', accessorKey: 'weight' },
		{ header: 'Castrado?', accessorKey: 'sterile' },
		{ header: 'Tutor', accessorKey: 'tutor' },
		{ header: 'Ações', accessorKey: 'actions' },
	];

	const renderRow = (pet: PetWithTutorAndBreed) => {
		return (
			<TableRow key={pet.id} className='group'>
				<TableCell className='flex gap-4 items-center'>
					<Avatar className='h-10 w-10 border'>
						{pet.photo ? (
							<AvatarImage src={pet.photo} alt={pet.name} />
						) : (
							<AvatarFallback className='bg-primary text-accent-foreground'>
								{getInitials(pet.name)}
							</AvatarFallback>
						)}
					</Avatar>
					<span className='flex flex-col'>
						<span className='font-medium'>{pet.name}</span>
						<p className='text-xs text-muted-foreground'>
							{pet.breed.specie.name} • {pet.breed.name} • {pet.color}
						</p>
					</span>
				</TableCell>

				{/* birthDate é string "YYYY-MM-DD", calculateAge precisa lidar com isso */}
				<TableCell>{calculateAge(new Date(pet.birthDate))}</TableCell>

				<TableCell>{formatWeight(pet.weightInGrams)}</TableCell>

				<TableCell>
					<Badge variant={pet.sterile ? 'default' : 'outline'}>
						{pet.sterile ? 'Sim' : 'Não'}
					</Badge>
				</TableCell>

				<TableCell>
					<div className='flex flex-col'>
						<span className='text-sm font-medium'>{pet.tutor.user.name}</span>
						<span className='text-[10px] text-muted-foreground uppercase'>
							{pet.tutor.phone}
						</span>
					</div>
				</TableCell>

				<TableCell className='w-20 space-x-2'>
					<EditPetButton
						pet={pet}
						species={species}
						breeds={breeds}
						customers={customers}
					/>

					<DeleteButton action={() => handleDelete(pet.id)} />
				</TableCell>
			</TableRow>
		);
	};

	const renderMobile = (pet: PetWithTutorAndBreed) => {
		return (
			<div
				key={pet.id}
				className='p-4 border rounded-lg bg-card text-card-foreground shadow-sm'
			>
				<div className='flex gap-4 items-center justify-between'>
					<div className='flex gap-3'>
						<Avatar className='h-12 w-12 border'>
							{pet.photo ? (
								<AvatarImage src={pet.photo} alt={pet.name} />
							) : (
								<AvatarFallback>{getInitials(pet.name)}</AvatarFallback>
							)}
						</Avatar>

						<div className='flex flex-col'>
							<h3 className='font-bold'>{pet.name}</h3>
							<p className='text-xs text-muted-foreground'>
								{pet.breed.name} ({pet.gender === 'male' ? 'M' : 'F'})
							</p>
							<p className='text-xs font-medium mt-1'>
								Tutor: {pet.tutor.user.name}
							</p>
						</div>
					</div>

					<EditPetButton
						pet={pet}
						species={species}
						breeds={breeds}
						customers={customers}
					/>
				</div>
			</div>
		);
	};

	return (
		<div className='flex flex-col w-full gap-4'>
			<div className='flex flex-col lg:flex-row items-center justify-between gap-4'>
				<SearchInput />

				<AddPetButton species={species} breeds={breeds} customers={customers} />
			</div>

			<TableComponent
				emptyMessage='Nenhum pet encontrado...'
				columns={columns}
				renderRow={renderRow}
				renderMobile={renderMobile}
				data={petsResolved?.data}
				currentPage={petsResolved?.metadata.currentPage}
				totalPages={petsResolved?.metadata.pageCount}
				totalElements={petsResolved?.metadata.totalCount}
				pageSize={MAX_PAGE_SIZE}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};

export default PetsListClient;
