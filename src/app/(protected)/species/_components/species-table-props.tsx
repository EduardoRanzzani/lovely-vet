import { Specie } from '@/api/schema/species.schema';
import { TableCell, TableRow } from '@/components/ui/table';
import EditSpecieButton from './edit-specie-button';
import { Edit } from 'lucide-react';

export const columns = [
	{ header: 'Descrição', accessorKey: 'name' },
	{ header: 'Ações', accessorKey: 'actions' },
];

export const renderRow = (specie: Specie) => {
	return (
		<TableRow key={specie.id}>
			<TableCell>{specie.name}</TableCell>
			<TableCell className='w-20'>
				<EditSpecieButton specie={specie} />
			</TableCell>
		</TableRow>
	);
};

export const renderMobile = (specie: Specie) => {
	return (
		<div key={specie.id} className='flex items-center justify-between'>
			<h3>{specie.name}</h3>
			<EditSpecieButton specie={specie} />
		</div>
	);
};
