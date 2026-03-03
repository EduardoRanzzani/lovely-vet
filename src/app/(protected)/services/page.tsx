import { getServicesPaginated } from '@/api/actions/services.actions';
import { getSpecies } from '@/api/actions/species.actions';
import { MAX_PAGE_SIZE } from '@/api/config/consts';
import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageHeaderContent,
	PageTitle,
} from '@/components/shared/page-container';
import { ListSkeleton } from '@/components/ui/list-skeleton';
import LoadingDialog from '@/components/ui/loading';
import { Suspense } from 'react';
import ServicesListClient from './_components/services-list';

interface ServicesPageProps {
	searchParams: Promise<{ page?: string; filter?: string; keyword?: string }>;
}

const ServicesPage = async ({ searchParams }: ServicesPageProps) => {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const filter = params.filter || '';

	const dataPromise = getServicesPaginated(page, MAX_PAGE_SIZE, filter);
	const species = await getSpecies();

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
				<Suspense
					fallback={
						<>
							<ListSkeleton />
							<LoadingDialog />
						</>
					}
				>
					<ServicesListClient services={dataPromise} species={species} />
				</Suspense>
			</PageContent>
		</PageContainer>
	);
};

export default ServicesPage;
