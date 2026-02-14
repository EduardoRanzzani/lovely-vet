import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageHeaderContent,
	PageTitle,
} from '@/components/shared/page-container';

interface BreedsPageProps {
	searchParams: Promise<{ page?: string; filter?: string; keyword?: string }>;
}

const BreedsPage = async ({ searchParams }: BreedsPageProps) => {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const filter = params.filter || '';

	console.log(page, filter);

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
				<h1>Hello World!</h1>
			</PageContent>
		</PageContainer>
	);
};

export default BreedsPage;
