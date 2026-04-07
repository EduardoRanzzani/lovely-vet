import AppSidebar from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ReactNode } from 'react';

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				{/* <div className='flex items-center justify-between'>
					<SidebarTrigger className='m-4' variant={'outline'} />
				</div>
				<Separator /> */}
				<main className='w-full'>{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default ProtectedLayout;
