import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageHeaderContent,
	PageTitle,
} from '@/components/shared/page-container';
import React from 'react';

interface DoctorsPageProps {
	searchParams: Promise<{ page?: string; filter?: string; keyword?: string }>;
}

const DoctorsPage = async ({ searchParams }: DoctorsPageProps) => {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const filter = params.filter || '';

	console.log(page, filter);

	return (
		<PageContainer>
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Listagem de Veterinários</PageTitle>
					<PageDescription>
						Listagem de todos os veterinários cadastrados no sistema
					</PageDescription>
				</PageHeaderContent>
			</PageHeader>

			<PageContent>
				<h1>Hello World!</h1>
			</PageContent>
		</PageContainer>
	);
};

export default DoctorsPage;
