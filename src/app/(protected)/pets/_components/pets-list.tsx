'use client';
import { MAX_PAGE_SIZE, PaginatedData } from '@/api/config/consts';
import { PetsWithTutorAndBreed } from '@/api/schema/pets.schema';
import SearchInput from '@/components/list/search-input';
import TableComponent from '@/components/list/table-component';
import { handleNavigation } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import AddPetButton from './add-pet-button';
import { columns, renderMobile, renderRow } from './pets-table-props';

interface PetsListClientProps {
	pets: Promise<PaginatedData<PetsWithTutorAndBreed>>;
}

const PetsListClient = ({ pets }: PetsListClientProps) => {
	const { user } = useUser();
	const role = user?.publicMetadata?.role as string;

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

				{['admin', 'doctor'].includes(role) && <AddPetButton />}
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
