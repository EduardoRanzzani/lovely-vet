import { getDoctorsPaginated } from '@/api/actions/doctors.actions';
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
import DoctorsListClient from './_components/doctors-list';

interface DoctorsPageProps {
	searchParams: Promise<{ page?: string; filter?: string; keyword?: string }>;
}

const DoctorsPage = async ({ searchParams }: DoctorsPageProps) => {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const filter = params.filter || '';

	const dataPromise = getDoctorsPaginated(page, MAX_PAGE_SIZE, filter);

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
				<Suspense
					fallback={
						<>
							<ListSkeleton />
							<LoadingDialog />
						</>
					}
				>
					<DoctorsListClient doctors={dataPromise} />
				</Suspense>
			</PageContent>
		</PageContainer>
	);
};

export default DoctorsPage;
