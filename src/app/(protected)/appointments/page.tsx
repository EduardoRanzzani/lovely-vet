import { getAppointmentsPaginated } from '@/api/actions/appointments.actions';
import { MAX_PAGE_SIZE } from '@/api/config/consts';

interface AppointmentsPageProps {
	searchParams: Promise<{ page?: string; filter?: string; keyword?: string }>;
}

const AppointmentsPage = async ({ searchParams }: AppointmentsPageProps) => {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const filter = params.filter || '';

	const dataPromise = getAppointmentsPaginated(page, MAX_PAGE_SIZE, filter);

	return <div>AppointmentsPage</div>;
};

export default AppointmentsPage;
