import { PetsWithTutorAndBreed } from '@/api/schema/pets.schema';
import { calculateAge, getInitials } from '@/api/util';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TableCell, TableRow } from '@/components/ui/table';
import EditPetButton from './edit-pet-button';

export const columns = [
	{ header: 'Nome', accessorKey: 'name' },
	{ header: 'Idade', accessorKey: 'age' },
	{ header: 'Pelagem', accessorKey: 'color' },
	{ header: 'Sexo', accessorKey: 'gender' },
	{ header: 'Castrado?', accessorKey: 'sterile' },
	{ header: 'Tutor', accessorKey: 'tutor' },
	{ header: 'Ações', accessorKey: 'actions' },
];

export const renderRow = (pet: PetsWithTutorAndBreed) => {
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
			<TableCell>
				<EditPetButton pet={pet} />
			</TableCell>
		</TableRow>
	);
};

export const renderMobile = (pet: PetsWithTutorAndBreed) => {
	return (
		<div key={pet.id} className='flex flex-col gap-4'>
			<div className='flex gap-4'>
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
			</div>
		</div>
	);
};
