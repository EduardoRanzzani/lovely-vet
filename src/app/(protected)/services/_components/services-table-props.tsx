import { Services } from '@/api/schema/services.schema';
import { TableCell, TableRow } from '@/components/ui/table';
import AddServiceButton from './add-service-button';
import { DollarSignIcon, NotepadTextIcon } from 'lucide-react';
import { formatCurrencyFromCents } from '@/helpers/currency';
import EditServiceButton from './edit-service-button';

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
			<TableCell className='w-20'>
				<EditServiceButton service={service} />
			</TableCell>
		</TableRow>
	);
};

export const renderMobile = (service: Services) => {
	return (
		<div key={service.id} className='flex flex-col gap-4'>
			<div className='flex items-center justify-between'>
				<h3 className='text-xl font-bold'>{service.name}</h3>
				<EditServiceButton service={service} />
			</div>
			<p className='flex items-center gap-4'>
				<NotepadTextIcon className='h-5 w-5' /> {service.description}
			</p>
			<span className='flex items-center gap-4'>
				<DollarSignIcon className='h-5 w-5' />
				<p>{formatCurrencyFromCents(service.priceInCents)}</p>
			</span>
		</div>
	);
};
