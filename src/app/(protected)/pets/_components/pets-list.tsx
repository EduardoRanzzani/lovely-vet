'use client';

import { deletePet } from '@/api/actions/pets.actions';
import { MAX_PAGE_SIZE, PaginatedData } from '@/api/config/consts';
import { BreedsWithSpecies } from '@/api/schema/breeds.schema';
import { CustomerWithUser } from '@/api/schema/customers.schema';
import { PetWithTutorAndBreed } from '@/api/schema/pets.schema';
import { Specie } from '@/api/schema/species.schema';
import { calculateAge, getInitials } from '@/api/util';
import { WhatsappIcon } from '@/components/icons/icon-whatsapp';
import DeleteButton from '@/components/list/delete-button';
import SearchInput from '@/components/list/search-input';
import TableComponent from '@/components/list/table-component';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge'; // Opcional: para status ou gênero
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TableCell, TableRow } from '@/components/ui/table';
import { formatWeight } from '@/helpers/weight';
import { handleNavigation } from '@/lib/utils';
import {
	CalendarIcon,
	MarsIcon,
	UserRoundIcon,
	VenusIcon,
	WeightIcon,
} from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import { toast } from 'sonner';
import AddPetButton from './add-pet-button';
import EditPetButton from './edit-pet-button';

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
		const firstName = pet.tutor.user.name.split(' ')[0];
		const whatsappUrl = `https://wa.me/55${pet.tutor.phone.replace(/\D/g, '')}/?text=Ol%C3%A1,%20tudo%20bem%3F%20Gostaria%20de%20falar%20com%20${firstName}%20sobre%20${pet.gender === 'female' ? 'a' : 'o'}%20${pet.name}`;

		return (
			<TableRow key={pet.id} className='group'>
				<TableCell className='flex gap-4 items-center'>
					<Avatar className='h-10 w-10 rounded-full' draggable={false}>
						{pet.photo ? (
							<AvatarImage src={pet.photo} alt={pet.name} />
						) : (
							<AvatarFallback className='rounded-full'>
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
					<div className='flex gap-4'>
						<div className='flex flex-col'>
							<span className='text-sm font-medium'>{pet.tutor.user.name}</span>
							<span className='text-[10px] text-muted-foreground uppercase'>
								{pet.tutor.phone}
							</span>
						</div>
						<Button asChild variant={'outline'}>
							<Link target='_blank' href={whatsappUrl}>
								<WhatsappIcon />
								Conversar
							</Link>
						</Button>
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
		const firstName = pet.tutor.user.name.split(' ')[0];
		const whatsappUrl = `https://wa.me/55${pet.tutor.phone.replace(/\D/g, '')}/?text=Ol%C3%A1,%20tudo%20bem%3F%20Gostaria%20de%20falar%20com%20${firstName}%20sobre%20${pet.gender === 'female' ? 'a' : 'o'}%20${pet.name}`;

		return (
			<div key={pet.id} className='flex flex-col gap-4'>
				<div className='flex items-center justify-between'>
					<div className='flex gap-4'>
						<Avatar className='h-10 w-10 rounded-full' draggable={false}>
							{pet.photo ? (
								<AvatarImage src={pet.photo} alt={pet.name} />
							) : (
								<AvatarFallback className='rounded-full'>
									{getInitials(pet.name)}
								</AvatarFallback>
							)}
						</Avatar>

						<span className='flex flex-col'>
							<h3 className='font-bold'>{pet.name}</h3>
							<p className='text-xs text-muted-foreground'>
								{pet.breed.specie.name} • {pet.breed.name} • {pet.color} •{' '}
								<Badge variant={pet.sterile ? 'default' : 'outline'}>
									{pet.sterile ? 'Castrado' : 'Fértil'}
								</Badge>
							</p>
						</span>
					</div>

					<span className='flex flex-col gap-2'>
						<EditPetButton
							pet={pet}
							species={species}
							breeds={breeds}
							customers={customers}
						/>

						<DeleteButton action={() => handleDelete(pet.id)} />
					</span>
				</div>

				<Separator />

				<div className='flex flex-col gap-2'>
					<p className='flex gap-2 items-center'>
						<span className='text-sm font-semibold'>
							{pet.gender === 'female' ? (
								<VenusIcon className='w-4 h-4' />
							) : (
								<MarsIcon className='w-4 h-4' />
							)}
						</span>
						<span className='text-sm'>
							{pet.gender === 'female' ? 'Fêmea' : 'Macho'}
						</span>
					</p>

					<p className='flex gap-2 items-center'>
						<span className='text-sm font-semibold'>
							<CalendarIcon className='w-4 h-4' />
						</span>
						<span className='text-sm'>
							{calculateAge(new Date(pet.birthDate))}
						</span>
					</p>

					<p className='flex gap-2 items-center'>
						<span className='text-sm font-semibold'>
							<WeightIcon className='w-4 h-4' />
						</span>
						<span className='text-sm'>{formatWeight(pet.weightInGrams)}</span>
					</p>
				</div>

				<Separator />

				<div className='flex flex-col gap-2'>
					<p className='flex gap-2 items-center'>
						<span className='text-sm font-semibold'>
							<UserRoundIcon className='w-4 h-4' />
						</span>
						<span className='flex items-center text-sm gap-4'>
							Tutor: {pet.tutor.user.name}
							<Button asChild variant={'outline'}>
								<Link target='_blank' href={whatsappUrl}>
									<WhatsappIcon />
									Conversar
								</Link>
							</Button>
						</span>
					</p>
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
