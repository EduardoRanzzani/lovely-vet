import { getDoctors } from '@/api/actions/doctors.actions';
import { getPets } from '@/api/actions/pets.actions';
import { getServices } from '@/api/actions/services.actions';
import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageHeaderContent,
	PageTitle,
} from '@/components/shared/page-container';

interface AppointmentsPageProps {
	searchParams: Promise<{ page?: string; filter?: string; keyword?: string }>;
}

const AppointmentsPage = async ({ searchParams }: AppointmentsPageProps) => {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const filter = params.filter || '';

	const pets = await getPets();
	const doctors = await getDoctors();
	const services = await getServices();

	return (
		<PageContainer>
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Listagem de Agendamentos</PageTitle>
					<PageDescription>
						Listagem de todos os agendamentos registrados no sistema
					</PageDescription>
				</PageHeaderContent>
			</PageHeader>

			<PageContent>
				<h1>teste</h1>
				{/* <AppointmentsListClient
					appointments={dataPromise}
					services={services}
					pets={pets}
					doctors={doctors}
				/> */}
			</PageContent>
		</PageContainer>
	);
};

export default AppointmentsPage;
