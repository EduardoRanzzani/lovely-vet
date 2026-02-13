import { CustomerWithUser } from '@/api/schema/customers.schema';
import { getInitials } from '@/api/util';
import { GoogleMapsIcon } from '@/components/icons/icon-googlemaps';
import { WhatsappIcon } from '@/components/icons/icon-whatsapp';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TableCell, TableRow } from '@/components/ui/table';
import { IdCardIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';
import EditCustomerButton from './edit-customer-button';

export const columns = [
	{ header: 'Nome', accessorKey: 'name' },
	{ header: 'CPF', accessorKey: 'cpf' },
	{ header: 'Telefone', accessorKey: 'phone' },
	{ header: 'Endereço', accessorKey: 'address' },
	{ header: 'Ações', accessorKey: 'actions' },
];

export const renderRow = (customer: CustomerWithUser) => {
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
					<p className='text-xs text-muted-foreground'>{customer.user.email}</p>
				</span>
			</TableCell>
			<TableCell>{customer.cpf}</TableCell>
			<TableCell>{customer.phone}</TableCell>
			<TableCell>{fullAddress}</TableCell>
			<TableCell>
				<EditCustomerButton customer={customer} />
			</TableCell>
		</TableRow>
	);
};

export const renderMobile = (customer: CustomerWithUser) => {
	const fullAddress = `${customer.address}, ${customer.addressNumber} - ${customer.neighborhood}. ${customer.city}/${customer.state}`;
	const whatsappUrl = `https://wa.me/55${customer.phone.replace(/\D/g, '')}/?text=Ol%C3%A1,%20gostaria%20de%20falar%20com%20${customer.user.name}`;
	const googleMapsUrl = `https://www.google.com/maps/place/${fullAddress}`;

	return (
		<div key={customer.id} className='flex flex-col gap-4'>
			<div className='flex gap-4'>
				<Avatar className='h-9 w-9 rounded-full' draggable={false}>
					{customer.user.image ? (
						<AvatarImage src={customer.user.image} alt={customer.user.name} />
					) : (
						<AvatarFallback className='rounded-full'>LV</AvatarFallback>
					)}
				</Avatar>

				<span className='flex flex-col'>
					<h3>{customer.user.name}</h3>
					<p className='text-xs text-muted-foreground'>{customer.user.email}</p>
				</span>
			</div>

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
					<span className='text-sm flex gap-2 items-center'>{fullAddress}</span>
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
