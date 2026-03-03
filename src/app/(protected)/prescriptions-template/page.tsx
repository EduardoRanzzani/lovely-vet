import { getDoctors } from '@/api/actions/doctors.actions';
import { getPrescriptionsTemplatePaginated } from '@/api/actions/prescriptions-template.actions';
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
import PrescriptionsTemplateListClient from './_component/prescriptions-template-list';

interface PrescriptionsTemplatePageProps {
	searchParams: Promise<{ page?: string; filter?: string; keyword?: string }>;
}

const PrescriptionsTemplatePage = async ({
	searchParams,
}: PrescriptionsTemplatePageProps) => {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const filter = params.filter || '';

	const dataPromise = getPrescriptionsTemplatePaginated(
		page,
		MAX_PAGE_SIZE,
		filter,
	);

	const doctors = await getDoctors();

	return (
		<PageContainer>
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Modelos de Receitas</PageTitle>
					<PageDescription>
						Listagem e cadastro de modelos de receita para serem utilizados
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
					<PrescriptionsTemplateListClient
						prescriptionsTemplate={dataPromise}
						doctors={doctors}
					/>
				</Suspense>
			</PageContent>
		</PageContainer>
	);
};

export default PrescriptionsTemplatePage;
