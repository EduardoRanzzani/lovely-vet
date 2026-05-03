import { ListSkeleton } from '@/components/list/list-skeleton';
import {
	PageContainer,
	PageContent,
	PageHeader,
	PageHeaderContent,
	PageTitle,
} from '@/components/shared/page-container';
import LoadingDialog from '@/components/ui/loading';
import { Suspense } from 'react';
import AdminFormClient from './_components/admin-form';

const AdminPage = async () => {
	return (
		<PageContainer>
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Mudar cadastro Prod/Dev</PageTitle>
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
				></Suspense>

				<AdminFormClient />
			</PageContent>
		</PageContainer>
	);
};

export default AdminPage;
