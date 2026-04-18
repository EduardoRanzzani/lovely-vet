import { getAppointments } from '@/api/actions/appointments.actions';
import { getShifts } from '@/api/actions/shifts.actions';
import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageHeaderContent,
	PageTitle,
} from '@/components/shared/page-container';
import { db } from '@/db';
import { customersTable, usersTable } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { format } from 'date-fns';
import { eq } from 'drizzle-orm';
import OnboardingCustomerFormDialog from '../customers/_component/onboarding-customer-form';
import DashboardCalendarClient from './_components/dashboard-calendar';

interface DashboardPageProps {
	searchParams: Promise<{ month?: string }>;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
	const params = await searchParams;

	const { userId, isAuthenticated } = await auth();
	if (!isAuthenticated) return <div>Redirecinando para login...</div>;

	const existingUser = await db.query.usersTable.findFirst({
		where: eq(usersTable.clerkUserId, userId),
	});

	if (!existingUser) {
		return <h1 className='text-center'>Usuário não encontrado</h1>;
	}

	const existingCustomer = await db.query.customersTable.findFirst({
		where: eq(customersTable.userId, existingUser.id),
	});

	const needsToCreateCustomer = existingUser && !existingCustomer;

	const monthName = params.month || format(new Date(), 'MMMM').toLowerCase();
	const [shifts, appointments] = await Promise.all([
		getShifts(monthName, true),
		getAppointments(monthName),
	]);

	return (
		<PageContainer>
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Dashboard</PageTitle>
				</PageHeaderContent>
			</PageHeader>

			<PageContent>
				<PageDescription>
					Olá, {existingUser.name}! Aqui você vai encontrar as métricas de todos
					os atendimentos e próximos agendamentos.
				</PageDescription>

				<DashboardCalendarClient shifts={shifts} appointments={appointments} />

				{needsToCreateCustomer && (
					<OnboardingCustomerFormDialog isOpen={needsToCreateCustomer} />
				)}
			</PageContent>
		</PageContainer>
	);
};

export default DashboardPage;
