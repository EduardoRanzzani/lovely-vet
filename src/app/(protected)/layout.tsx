import AppSidebar from '@/components/sidebar/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { ReactNode } from 'react';

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<div className='flex items-center justify-between'>
					<SidebarTrigger className='m-4' />
				</div>
				<Separator />
				<main className='w-full'>{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default ProtectedLayout;
