'use client';

import { MAX_PAGE_SIZE, PaginatedData } from '@/api/config/consts';
import { BreedsWithSpecies } from '@/api/schema/breeds.schema';
import SearchInput from '@/components/list/search-input';
import TableComponent from '@/components/list/table-component';
import { handleNavigation } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import AddBreedButton from './add-breed-button';
import { columns, renderMobile, renderRow } from './breeds-table-props';

interface BreedsListClientProps {
	breeds: Promise<PaginatedData<BreedsWithSpecies>>;
}

const BreedsListClient = ({ breeds }: BreedsListClientProps) => {
	const breedsResolved = use(breeds);
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

				<AddBreedButton />
			</div>

			<TableComponent
				emptyMessage='Nenhuma espécie encontrada...'
				columns={columns}
				renderRow={renderRow}
				renderMobile={renderMobile}
				data={breedsResolved?.data}
				currentPage={breedsResolved?.metadata.currentPage}
				totalPages={breedsResolved?.metadata.pageCount}
				totalElements={breedsResolved?.metadata.totalCount}
				pageSize={MAX_PAGE_SIZE}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};

export default BreedsListClient;
