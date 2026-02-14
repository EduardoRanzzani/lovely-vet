import { getBreedsPaginated } from '@/api/actions/breeds.actions';
import { MAX_PAGE_SIZE } from '@/api/config/consts';
import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageHeaderContent,
	PageTitle,
} from '@/components/shared/page-container';
import BreedsListClient from './_components/breeds-list';

interface BreedsPageProps {
	searchParams: Promise<{ page?: string; filter?: string; keyword?: string }>;
}

const BreedsPage = async ({ searchParams }: BreedsPageProps) => {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const filter = params.filter || '';

	const dataPromise = getBreedsPaginated(page, MAX_PAGE_SIZE, filter);

	return (
		<PageContainer>
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Listagem de Raças</PageTitle>
					<PageDescription>
						Listagem de todos as raças de pets cadastradas no sistema
					</PageDescription>
				</PageHeaderContent>
			</PageHeader>

			<PageContent>
				<BreedsListClient breeds={dataPromise} />
			</PageContent>
		</PageContainer>
	);
};

export default BreedsPage;
