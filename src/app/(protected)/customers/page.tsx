import { getCustomersPaginated } from '@/api/actions/customers.actions';
import { MAX_PAGE_SIZE } from '@/api/config/consts';
import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageHeaderContent,
	PageTitle,
} from '@/components/shared/page-container';

interface CustomersPageProps {
	searchParams: Promise<{ page?: string; filter?: string; keyword?: string }>;
}

const CustomersPage = async ({ searchParams }: CustomersPageProps) => {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const filter = params.filter || 'all';

	const dataPromise = getCustomersPaginated(page, MAX_PAGE_SIZE, filter);

	return (
		<PageContainer>
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Listagem de Clientes</PageTitle>
					<PageDescription>
						Listagem de todos os clientes cadastrados no sistema
					</PageDescription>
				</PageHeaderContent>
			</PageHeader>

			<PageContent>
				<></>
				{/* <CustomerListClient customers={dataPromise} /> */}
			</PageContent>
		</PageContainer>
	);
};

export default CustomersPage;
