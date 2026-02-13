'use client';
import { MAX_PAGE_SIZE, PaginatedData } from '@/api/config/consts';
import { PetsWithTutorAndBreed } from '@/api/schema/pets.schema';
import SearchInput from '@/components/list/search-input';
import TableComponent from '@/components/list/table-component';
import { handleNavigation } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import { columns, renderMobile, renderRow } from './pets-table-props';
import AddPetButton from './add-pet-button';
import { BreedsWithSpecies } from '@/api/schema/breeds.schema';
import { Species } from '@/api/schema/species.schema';
import { CustomerWithUser } from '@/api/schema/customers.schema';

interface PetsListClientProps {
	pets: Promise<PaginatedData<PetsWithTutorAndBreed>>;
	species: Species[];
	breeds: BreedsWithSpecies[];
	customers: CustomerWithUser[];
}

const PetsListClient = ({
	pets,
	species,
	breeds,
	customers,
}: PetsListClientProps) => {
	const petsResolved = use(pets);
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

				<AddPetButton species={species} breeds={breeds} customers={customers} />
			</div>

			<TableComponent
				emptyMessage='Nenhum pet encontrado...'
				columns={columns}
				renderRow={renderRow}
				renderMobile={renderMobile}
				data={petsResolved?.data}
				currentPage={petsResolved?.metadata.currentPage}
				totalPages={petsResolved?.metadata.pageCount}
				totalElements={petsResolved?.metadata.totalCount}
				pageSize={MAX_PAGE_SIZE}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};

export default PetsListClient;
