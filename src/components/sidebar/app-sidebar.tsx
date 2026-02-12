'use client';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useUser } from '@clerk/nextjs';
import {
	ChevronRightIcon,
	CogIcon,
	LayoutDashboardIcon,
	PawPrintIcon,
	StethoscopeIcon,
	UsersRoundIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavUser, NavUserType } from './nav-user';

const AppSidebar = () => {
	const { user } = useUser();
	const navUser: NavUserType = {
		image: user?.imageUrl as string,
		name: user?.fullName as string,
		email: user?.primaryEmailAddress?.emailAddress as string,
	};
	const userRole = user?.publicMetadata?.role;

	const pathname = usePathname();

	const items = [
		{ title: 'Dashboard', url: '/dashboard', icon: LayoutDashboardIcon },
		{ title: 'Veterinários', url: '/doctors', icon: StethoscopeIcon },
		{ title: 'Pets', url: '/pets', icon: PawPrintIcon },
		{ title: 'Clientes', url: '/customers', icon: UsersRoundIcon },
	];

	const settings = [
		{ title: 'Cadastro de Raças', url: '/breeds', icon: CogIcon },
	];

	return (
		<Sidebar variant='inset' collapsible='offcanvas'>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						{/* <SidebarMenuButton asChild> */}
						<Link href={'/dashboard'}>
							<span className='flex items-center gap-2 text-3xl'>
								<StethoscopeIcon className='h-7 w-7' />
								<span>LovelyVet</span>
							</span>
						</Link>
						{/* </SidebarMenuButton> */}
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
					<SidebarMenu>
						{items.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild isActive={pathname === item.url}>
									<Link href={item.url} className='flex justify-between'>
										<span className='flex items-center gap-2'>
											<item.icon className='h-5 w-5' />
											<p
												className={`${pathname === item.url && 'font-semibold'}`}
											>
												{item.title}
											</p>
										</span>
										{pathname === item.url && <ChevronRightIcon />}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
				{userRole === 'admin' && (
					<SidebarGroup>
						<SidebarGroupLabel>Configurações</SidebarGroupLabel>
						<SidebarMenu>
							{settings.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild isActive={pathname === item.url}>
										<Link href={item.url} className='flex justify-between'>
											<span className='flex items-center gap-2'>
												<item.icon className='h-5 w-5' />
												<p
													className={`${pathname === item.url && 'font-semibold'}`}
												>
													{item.title}
												</p>
											</span>
											{pathname === item.url && <ChevronRightIcon />}
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroup>
				)}
				<SidebarGroup />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={navUser} />
			</SidebarFooter>
		</Sidebar>
	);
};

export default AppSidebar;
