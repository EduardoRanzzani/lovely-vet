'use client';

import { MAX_PAGE_SIZE, PaginatedData } from '@/api/config/consts';
import { Services } from '@/api/schema/services.schema';
import SearchInput from '@/components/list/search-input';
import TableComponent from '@/components/list/table-component';
import { handleNavigation } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import { columns, renderMobile, renderRow } from './services-table-props';
import AddServiceButton from './add-service-button';

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
