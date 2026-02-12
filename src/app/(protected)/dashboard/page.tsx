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
import { eq } from 'drizzle-orm';
import OnboardingCustomerFormDialog from '../customers/_component/onboarding-customer-form';

const DashboardPage = async () => {
	const { userId, isAuthenticated } = await auth();
	if (!isAuthenticated) return <div>Redirecinando para login...</div>;

	const existingUser = await db.query.usersTable.findFirst({
		where: eq(usersTable.clerkUserId, userId),
	});

	if (!existingUser) {
		return <h1 className='text-center'>Usuário não encontrado</h1>;
	}

	const existingClient = await db.query.customersTable.findFirst({
		where: eq(customersTable.userId, existingUser.id),
	});

	const needsToCreateCustomer = existingUser && !existingClient;

	return (
		<PageContainer>
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Dashboard</PageTitle>
					<PageDescription>
						Olá, {existingUser.name}! Aqui você vai encontrar as métricas de
						todos os atendimentos e agendamentos próximos.
					</PageDescription>
				</PageHeaderContent>
			</PageHeader>

			<PageContent>
				<OnboardingCustomerFormDialog isOpen={needsToCreateCustomer} />
			</PageContent>
		</PageContainer>
	);
};

export default DashboardPage;
