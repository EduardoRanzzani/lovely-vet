'use client';

import { PaginatedData } from '@/api/config/consts';
import { Specie } from '@/api/schema/species.schema';
import SearchInput from '@/components/list/search-input';
import TableComponent from '@/components/list/table-component';
import { handleNavigation } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import { columns, renderMobile, renderRow } from './species-table-props';
import AddSpecieButton from './add-specie-button';

interface SpeciesListClientProps {
	species: Promise<PaginatedData<Specie>>;
}

const SpeciesListClient = ({ species }: SpeciesListClientProps) => {
	const speciesResolved = use(species);
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

				<AddSpecieButton />	
			</div>

			<TableComponent
				emptyMessage='Nenhuma espécie encontrada...'
				columns={columns}
				renderRow={renderRow}
				renderMobile={renderMobile}
				data={speciesResolved?.data}
				currentPage={speciesResolved?.metadata.currentPage}
				totalPages={speciesResolved?.metadata.pageCount}
				totalElements={speciesResolved?.metadata.totalCount}
				pageSize={10}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};
export default SpeciesListClient;
