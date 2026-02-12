'use client';

import { CustomerWithUser } from '@/api/actions/customers.actions';
import { MAX_PAGE_SIZE, PaginatedData } from '@/api/config/consts';
import SearchInput from '@/components/list/search-input';
import TableComponent from '@/components/list/table-component';
import { useRouter, useSearchParams } from 'next/navigation';
import { startTransition, use } from 'react';
import { columns, renderMobile, renderRow } from './customers-table-props';
import AddCustomerButton from './add-customer-button';

interface CustomersListClientProps {
	customers: Promise<PaginatedData<CustomerWithUser>>;
}

const CustomersListClient = ({ customers }: CustomersListClientProps) => {
	const customersResolved = use(customers);
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleNavigation = (params: URLSearchParams) => {
		startTransition(() => {
			router.push(`?${params.toString()}`);
		});
	};

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());
		handleNavigation(params);
	};

	return (
		<div className='flex flex-col w-full gap-4'>
			<div className='flex flex-col lg:flex-row items-center justify-between gap-4'>
				<SearchInput />

				<AddCustomerButton />
			</div>

			<TableComponent
				emptyMessage='Nenhum cliente encontrado...'
				columns={columns}
				renderRow={renderRow}
				renderMobile={renderMobile}
				data={customersResolved?.data}
				currentPage={customersResolved?.metadata.currentPage}
				totalPages={customersResolved?.metadata.pageCount}
				totalElements={customersResolved?.metadata.totalCount}
				pageSize={MAX_PAGE_SIZE}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};

export default CustomersListClient;
