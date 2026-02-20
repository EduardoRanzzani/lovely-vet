'use client';

import { MAX_PAGE_SIZE, PaginatedData } from '@/api/config/consts';
import { BreedsWithSpecies } from '@/api/schema/breeds.schema';
import SearchInput from '@/components/list/search-input';
import TableComponent from '@/components/list/table-component';
import { TableCell, TableRow } from '@/components/ui/table';
import { handleNavigation } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import AddBreedButton from './add-breed-button';
import EditBreedButton from './edit-breed-button';
import { Specie } from '@/api/schema/species.schema';

interface BreedsListClientProps {
	breeds: Promise<PaginatedData<BreedsWithSpecies>>;
	species: Specie[];
}

const BreedsListClient = ({ breeds, species }: BreedsListClientProps) => {
	const breedsResolved = use(breeds);
	const searchParams = useSearchParams();

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());
		handleNavigation(params);
	};

	const columns = [
		{ header: 'Descrição', accessorKey: 'name' },
		{ header: 'Espécie', accessorKey: 'specie' },
		{ header: 'Ações', accessorKey: 'actions' },
	];

	const renderRow = (breed: BreedsWithSpecies) => {
		return (
			<TableRow key={breed.id}>
				<TableCell>{breed.name}</TableCell>
				<TableCell>{breed.specie.name}</TableCell>
				<TableCell className='w-20'>
					<EditBreedButton breed={breed} species={species} />
				</TableCell>
			</TableRow>
		);
	};

	const renderMobile = (breed: BreedsWithSpecies) => {
		return (
			<div key={breed.id}>
				<div className='flex gap-4 items-center justify-between'>
					<span className='flex flex-col gap-2'>
						<h3>{breed.name}</h3>
						<p className='text-xs'>{breed.specie.name}</p>
					</span>

					<EditBreedButton breed={breed} species={species} />
				</div>
			</div>
		);
	};

	return (
		<div className='flex flex-col w-full gap-4'>
			<div className='flex flex-col lg:flex-row items-center justify-between gap-4'>
				<SearchInput />

				<AddBreedButton species={species} />
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
