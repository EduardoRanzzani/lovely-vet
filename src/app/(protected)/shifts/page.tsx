import { getShifts } from '@/api/actions/shifts.actions';
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
import ShiftsCalendarClient from './_components/shifts-calendar';
import { getDoctors } from '@/api/actions/doctors.actions';

interface ShiftsPageProps {
	searchParams: Promise<{ month?: string }>;
}

const ShiftsPage = async ({ searchParams }: ShiftsPageProps) => {
	const params = await searchParams;

	// Captura o mês da URL ou define o mês atual como fallback
	const currentMonth = params.month;

	// Busca os dados
	const shiftsPromise = getShifts(currentMonth);
	const doctors = await getDoctors();

	return (
		<PageContainer>
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Agenda de Plantões</PageTitle>
				</PageHeaderContent>
			</PageHeader>

			<PageContent>
				<PageDescription>
					Visualize e gerencie os plantões do mês selecionado.
				</PageDescription>
				<Suspense
					fallback={
						<>
							<ListSkeleton />
							<LoadingDialog />
						</>
					}
				>
					<ShiftsCalendarClient
						shiftsPromise={shiftsPromise}
						doctors={doctors}
					/>
				</Suspense>
			</PageContent>
		</PageContainer>
	);
};

export default ShiftsPage;
