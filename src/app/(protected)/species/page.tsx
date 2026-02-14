import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageHeaderContent,
	PageTitle,
} from '@/components/shared/page-container';

interface SpeciesPageProps {
	searchParams: Promise<{ page?: string; filter?: string; keyword?: string }>;
}

const SpeciesPage = async ({ searchParams }: SpeciesPageProps) => {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const filter = params.filter || '';

	console.log(page, filter);

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
				<h1>Hello World!</h1>
			</PageContent>
		</PageContainer>
	);
};

export default SpeciesPage;
