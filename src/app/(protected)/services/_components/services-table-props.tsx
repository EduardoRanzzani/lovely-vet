import { Services } from '@/api/schema/services.schema';
import { TableCell, TableRow } from '@/components/ui/table';

export const columns = [
	{ header: 'Nome', accessorKey: 'name' },
	{ header: 'Preço', accessorKey: 'priceInCents' },
	{ header: 'Descrição', accessorKey: 'description' },
	{ header: 'Ações', accessorKey: 'actions' },
];

export const renderRow = (service: Services) => {
	return (
		<TableRow key={service.id}>
			<TableCell>{service.name}</TableCell>
			<TableCell>{service.priceInCents}</TableCell>
			<TableCell>{service.description}</TableCell>
			<TableCell className='w-20'></TableCell>
		</TableRow>
	);
};

export const renderMobile = (service: Services) => {
	return (
		<div key={service.id} className='flex flex-col gap-4'>
			<div className='flex gap-4 items-center justify-between'>
				<span className='flex gap-4'>
					<h3>{service.name}</h3>
					<p className='text-xs text-muted-foreground'>{service.description}</p>
				</span>
			</div>
		</div>
	);
};
