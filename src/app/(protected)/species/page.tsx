import { getSpeciesPaginated } from '@/api/actions/species.actions';
import { MAX_PAGE_SIZE } from '@/api/config/consts';
import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageHeaderContent,
	PageTitle,
} from '@/components/shared/page-container';
import SpeciesListClient from './_components/species-list';

interface SpeciesPageProps {
	searchParams: Promise<{ page?: string; filter?: string; keyword?: string }>;
}

const SpeciesPage = async ({ searchParams }: SpeciesPageProps) => {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const filter = params.filter || '';

	const dataPromise = getSpeciesPaginated(page, MAX_PAGE_SIZE, filter);

	return (
		<PageContainer>
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Listagem de Espécies</PageTitle>
					<PageDescription>
						Listagem de todos as espécies de pets cadastradas no sistema
					</PageDescription>
				</PageHeaderContent>
			</PageHeader>

			<PageContent>
				<SpeciesListClient species={dataPromise} />
			</PageContent>
		</PageContainer>
	);
};

export default SpeciesPage;
