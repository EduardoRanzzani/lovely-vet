'use client';

import { MAX_PAGE_SIZE, PaginatedData } from '@/api/config/consts';
import { CustomerWithUser } from '@/api/schema/customers.schema';
import { getInitials } from '@/api/util';
import { GoogleMapsIcon } from '@/components/icons/icon-googlemaps';
import { WhatsappIcon } from '@/components/icons/icon-whatsapp';
import SearchInput from '@/components/list/search-input';
import TableComponent from '@/components/list/table-component';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TableCell, TableRow } from '@/components/ui/table';
import { handleNavigation } from '@/lib/utils';
import { IdCardIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import AddCustomerButton from './add-customer-button';
import EditCustomerButton from './edit-customer-button';

interface CustomersListClientProps {
	customers: Promise<PaginatedData<CustomerWithUser>>;
}

const CustomersListClient = ({ customers }: CustomersListClientProps) => {
	const customersResolved = use(customers);
	const searchParams = useSearchParams();

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());
		handleNavigation(params);
	};

	const columns = [
		{ header: 'Nome', accessorKey: 'name' },
		{ header: 'CPF', accessorKey: 'cpf' },
		{ header: 'Telefone', accessorKey: 'phone' },
		{ header: 'Endereço', accessorKey: 'address' },
		{ header: 'Ações', accessorKey: 'actions' },
	];

	const renderRow = (customer: CustomerWithUser) => {
		const fullAddress = `${customer.address}, ${customer.addressNumber} - ${customer.neighborhood}. ${customer.city}/${customer.state}`;

		return (
			<TableRow key={customer.id}>
				<TableCell className='flex gap-4 items-center'>
					<Avatar className='h-10 w-10 rounded-full'>
						{customer.user.image ? (
							<AvatarImage src={customer.user.image} alt={customer.user.name} />
						) : (
							<AvatarFallback className='rounded-full'>
								{getInitials(customer.user.name)}
							</AvatarFallback>
						)}
					</Avatar>
					<span className='flex flex-col'>
						<h3>{customer.user.name}</h3>
						<p className='text-xs text-muted-foreground'>
							{customer.user.email}
						</p>
					</span>
				</TableCell>
				<TableCell>{customer.cpf}</TableCell>
				<TableCell>{customer.phone}</TableCell>
				<TableCell>{fullAddress}</TableCell>
				<TableCell className='w-20'>
					<EditCustomerButton customer={customer} />
				</TableCell>
			</TableRow>
		);
	};

	const renderMobile = (customer: CustomerWithUser) => {
		const fullAddress = `${customer.address}, ${customer.addressNumber} - ${customer.neighborhood}. ${customer.city}/${customer.state}`;
		const whatsappUrl = `https://wa.me/55${customer.phone.replace(/\D/g, '')}/?text=Ol%C3%A1,%20gostaria%20de%20falar%20com%20${customer.user.name}`;
		const googleMapsUrl = `https://www.google.com/maps/place/${fullAddress}`;

		return (
			<div key={customer.id} className='flex flex-col gap-4'>
				<span className='flex items-center justify-between'>
					<div className='flex gap-4'>
						<Avatar className='h-10 w-10 rounded-full' draggable={false}>
							{customer.user.image ? (
								<AvatarImage
									src={customer.user.image}
									alt={customer.user.name}
								/>
							) : (
								<AvatarFallback className='rounded-full'>
									{getInitials(customer.user.name)}
								</AvatarFallback>
							)}
						</Avatar>

						<span className='flex flex-col'>
							<h3 className='font-bold'>{customer.user.name}</h3>
							<p className='text-xs text-muted-foreground'>
								{customer.user.email}
							</p>
						</span>
					</div>

					<EditCustomerButton customer={customer} />
				</span>

				<Separator />

				<div className='flex flex-col gap-2'>
					<p className='flex gap-2 items-center'>
						<span className='text-sm font-semibold'>
							<IdCardIcon className='w-4 h-4' />
						</span>
						<span className='text-sm'>{customer.cpf}</span>
					</p>

					<p className='flex gap-2 items-center'>
						<span className='text-sm font-semibold'>
							<PhoneIcon className='w-4 h-4' />
						</span>
						<span className='text-sm'>{customer.phone}</span>
					</p>

					<Button asChild variant={'outline'}>
						<Link target='_blank' href={whatsappUrl}>
							<WhatsappIcon />
							Enviar Whatsapp
						</Link>
					</Button>

					<p className='flex gap-2 items-center'>
						<span className='text-sm font-semibold'>
							<MapPinIcon className='w-4 h-4' />
						</span>
						<span className='text-sm flex gap-2 items-center'>
							{fullAddress}
						</span>
					</p>

					<Button asChild variant={'outline'}>
						<Link href={googleMapsUrl} target='_blank'>
							<GoogleMapsIcon className='w-4 h-4' />
							Abrir no Google Maps
						</Link>
					</Button>
				</div>
			</div>
		);
	};

	return (
		<div className='flex flex-col w-full gap-4'>
			<div className='flex flex-col lg:flex-row items-center justify-between gap-4'>
				<SearchInput />

				<AddCustomerButton />
			</div>

			<TableComponent
				emptyMessage='Nenhum cliente encontrado...'
				columns={columns}
				renderRow={renderRow}
				renderMobile={renderMobile}
				data={customersResolved?.data}
				currentPage={customersResolved?.metadata.currentPage}
				totalPages={customersResolved?.metadata.pageCount}
				totalElements={customersResolved?.metadata.totalCount}
				pageSize={MAX_PAGE_SIZE}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};

export default CustomersListClient;
