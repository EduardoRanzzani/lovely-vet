import { getServicesPaginated } from '@/api/actions/services.actions';
import { MAX_PAGE_SIZE } from '@/api/config/consts';
import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageHeaderContent,
	PageTitle,
} from '@/components/shared/page-container';
import ServicesListClient from './_components/services-list';

interface ServicesPageProps {
	searchParams: Promise<{ page?: string; filter?: string; keyword?: string }>;
}

const ServicesPage = async ({ searchParams }: ServicesPageProps) => {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const filter = params.filter || '';

	const dataPromise = getServicesPaginated(page, MAX_PAGE_SIZE, filter);

	return (
		<PageContainer>
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Listagem de Serviços Ofertados</PageTitle>
					<PageDescription>
						Listagem de todos os serviços ofertados cadastrados no sistema
					</PageDescription>
				</PageHeaderContent>
			</PageHeader>

			<PageContent>
				<ServicesListClient services={dataPromise} />
			</PageContent>
		</PageContainer>
	);
};

export default ServicesPage;
