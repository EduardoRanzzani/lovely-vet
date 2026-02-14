import { BreedsWithSpecies } from '@/api/schema/breeds.schema';
import { TableCell, TableRow } from '@/components/ui/table';
import EditBreedButton from './edit-breed-button';

export const columns = [
	{ header: 'Descrição', accessorKey: 'name' },
	{ header: 'Espécie', accessorKey: 'specie' },
	{ header: 'Ações', accessorKey: 'actions' },
];

export const renderRow = (breed: BreedsWithSpecies) => {
	return (
		<TableRow key={breed.id}>
			<TableCell>{breed.name}</TableCell>
			<TableCell>{breed.specie.name}</TableCell>
			<TableCell className='w-20'>
				<EditBreedButton breed={breed} />
			</TableCell>
		</TableRow>
	);
};

export const renderMobile = (breed: BreedsWithSpecies) => {
	return (
		<div key={breed.id}>
			<div className='flex gap-4 items-center justify-between'>
				<span className='flex flex-col gap-2'>
					<h3>{breed.name}</h3>
					<p className='text-xs'>{breed.specie.name}</p>
				</span>

				<EditBreedButton breed={breed} />
			</div>
		</div>
	);
};
