'use client';
import { MAX_PAGE_SIZE, PaginatedData } from '@/api/config/consts';
import { BreedsWithSpecies } from '@/api/schema/breeds.schema';
import { CustomerWithUser } from '@/api/schema/customers.schema';
import { PetsWithTutorAndBreed } from '@/api/schema/pets.schema';
import { Specie } from '@/api/schema/species.schema';
import { calculateAge, getInitials } from '@/api/util';
import SearchInput from '@/components/list/search-input';
import TableComponent from '@/components/list/table-component';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TableCell, TableRow } from '@/components/ui/table';
import { handleNavigation } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import AddPetButton from './add-pet-button';
import EditPetButton from './edit-pet-button';

interface PetsListClientProps {
	pets: Promise<PaginatedData<PetsWithTutorAndBreed>>;
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

	const columns = [
		{ header: 'Nome', accessorKey: 'name' },
		{ header: 'Idade', accessorKey: 'age' },
		{ header: 'Pelagem', accessorKey: 'color' },
		{ header: 'Sexo', accessorKey: 'gender' },
		{ header: 'Castrado?', accessorKey: 'sterile' },
		{ header: 'Tutor', accessorKey: 'tutor' },
		{ header: 'Ações', accessorKey: 'actions' },
	];

	const renderRow = (pet: PetsWithTutorAndBreed) => {
		return (
			<TableRow key={pet.id}>
				<TableCell className='flex gap-4 items-center'>
					<Avatar className='h-10 w-10 rounded-full'>
						{pet.photo ? (
							<AvatarImage src={pet.photo} alt={pet.name} />
						) : (
							<AvatarFallback className='rounded-full'>
								{getInitials(pet.name)}
							</AvatarFallback>
						)}
					</Avatar>
					<span className='flex flex-col'>
						<h3>{pet.name}</h3>
						<p className='text-xs text-muted-foreground'>
							{pet.breed.specie.name} - {pet.breed.name}
						</p>
					</span>
				</TableCell>
				<TableCell>{calculateAge(new Date(pet.birthDate))}</TableCell>
				<TableCell>{pet.color}</TableCell>
				<TableCell>{pet.gender === 'male' ? 'Macho' : 'Fêmea'}</TableCell>
				<TableCell>{pet.sterile ? 'Sim' : 'Não'}</TableCell>
				<TableCell>{pet.tutor.user.name}</TableCell>
				<TableCell className='w-20'>
					<EditPetButton
						pet={pet}
						species={species}
						breeds={breeds}
						customers={customers}
					/>
				</TableCell>
			</TableRow>
		);
	};

	const renderMobile = (pet: PetsWithTutorAndBreed) => {
		return (
			<div key={pet.id} className='flex flex-col gap-4'>
				<div className='flex gap-4 items-center justify-between'>
					<span className='flex gap-4'>
						<Avatar className='h-9 w-9 rounded-full' draggable={false}>
							{pet.photo ? (
								<AvatarImage src={pet.photo} alt={pet.name} />
							) : (
								<AvatarFallback className='rounded-full'>LV</AvatarFallback>
							)}
						</Avatar>

						<span className='flex flex-col'>
							<h3>{pet.name}</h3>
							<p className='text-xs text-muted-foreground'>{pet.breed.name}</p>
						</span>
					</span>

					{/* <EditPetButton pet={pet} /> */}
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
