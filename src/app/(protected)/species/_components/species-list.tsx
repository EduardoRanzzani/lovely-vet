'use client';

import { MAX_PAGE_SIZE, PaginatedData } from '@/api/config/consts';
import { Specie } from '@/api/schema/species.schema';
import SearchInput from '@/components/list/search-input';
import TableComponent from '@/components/list/table-component';
import { TableCell, TableRow } from '@/components/ui/table';
import { handleNavigation } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import AddSpecieButton from './add-specie-button';
import EditSpecieButton from './edit-specie-button';

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

	const columns = [
		{ header: 'Descrição', accessorKey: 'name' },
		{ header: 'Ações', accessorKey: 'actions' },
	];

	const renderRow = (specie: Specie) => {
		return (
			<TableRow key={specie.id}>
				<TableCell>{specie.name}</TableCell>
				<TableCell className='w-20'>
					<EditSpecieButton specie={specie} />
				</TableCell>
			</TableRow>
		);
	};

	const renderMobile = (specie: Specie) => {
		return (
			<div key={specie.id} className='flex items-center justify-between'>
				<h3>{specie.name}</h3>
				<EditSpecieButton specie={specie} />
			</div>
		);
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
				pageSize={MAX_PAGE_SIZE}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};
export default SpeciesListClient;
