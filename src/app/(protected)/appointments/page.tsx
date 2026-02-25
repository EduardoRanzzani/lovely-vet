import { getAppointmentsPaginated } from '@/api/actions/appointments.actions';
import { getDoctors } from '@/api/actions/doctors.actions';
import { getPets } from '@/api/actions/pets.actions';
import { getServices } from '@/api/actions/services.actions';
import { MAX_PAGE_SIZE } from '@/api/config/consts';
import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageHeaderContent,
	PageTitle,
} from '@/components/shared/page-container';
import AppointmentsListClient from './_components/appointments-list';

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

	const dataPromise = getAppointmentsPaginated(page, MAX_PAGE_SIZE, filter);

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
				<AppointmentsListClient
					appointments={dataPromise}
					services={services}
					pets={pets}
					doctors={doctors}
				/>
			</PageContent>
		</PageContainer>
	);
};

export default AppointmentsPage;
