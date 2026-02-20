'use client';

import { MAX_PAGE_SIZE, PaginatedData } from '@/api/config/consts';
import { Services } from '@/api/schema/services.schema';
import SearchInput from '@/components/list/search-input';
import TableComponent from '@/components/list/table-component';
import { TableCell, TableRow } from '@/components/ui/table';
import { formatCurrencyFromCents } from '@/helpers/currency';
import { handleNavigation } from '@/lib/utils';
import { DollarSignIcon, NotepadTextIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import AddServiceButton from './add-service-button';
import EditServiceButton from './edit-service-button';

interface ServicesListClientProps {
	services: Promise<PaginatedData<Services>>;
}

const ServicesListClient = ({ services }: ServicesListClientProps) => {
	const servicesResolved = use(services);
	const searchParams = useSearchParams();

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());
		handleNavigation(params);
	};

	const columns = [
		{ header: 'Nome', accessorKey: 'name' },
		{ header: 'Preço', accessorKey: 'priceInCents' },
		{ header: 'Descrição', accessorKey: 'description' },
		{ header: 'Ações', accessorKey: 'actions' },
	];

	const renderRow = (service: Services) => {
		return (
			<TableRow key={service.id}>
				<TableCell>{service.name}</TableCell>
				<TableCell>{formatCurrencyFromCents(service.priceInCents)}</TableCell>
				<TableCell>{service.description}</TableCell>
				<TableCell className='w-20'>
					<EditServiceButton service={service} />
				</TableCell>
			</TableRow>
		);
	};

	const renderMobile = (service: Services) => {
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

	return (
		<div className='flex flex-col w-full gap-4'>
			<div className='flex flex-col lg:flex-row items-center justify-between gap-4'>
				<SearchInput />

				<AddServiceButton />
			</div>

			<TableComponent
				emptyMessage='Nenhum serviço encontrado...'
				columns={columns}
				renderRow={renderRow}
				renderMobile={renderMobile}
				data={servicesResolved?.data}
				currentPage={servicesResolved?.metadata.currentPage}
				totalPages={servicesResolved?.metadata.pageCount}
				totalElements={servicesResolved?.metadata.totalCount}
				pageSize={MAX_PAGE_SIZE}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};

export default ServicesListClient;
