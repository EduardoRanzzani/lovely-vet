import { UserButton } from '@clerk/nextjs';

const DashboardPage = () => {
	return (
		<div className='flex flex-col gap-3'>
			<h1>DashboardPage</h1>

			<UserButton />
		</div>
	);
};

export default DashboardPage;
