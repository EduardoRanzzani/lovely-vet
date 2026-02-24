'use client';

import { deleteService } from '@/api/actions/services.actions';
import { MAX_PAGE_SIZE, PaginatedData } from '@/api/config/consts';
import { Services } from '@/api/schema/services.schema';
import DeleteButton from '@/components/list/delete-button';
import SearchInput from '@/components/list/search-input';
import TableComponent from '@/components/list/table-component';
import { Separator } from '@/components/ui/separator';
import { TableCell, TableRow } from '@/components/ui/table';
import { formatCurrencyFromCents } from '@/helpers/currency';
import { handleNavigation } from '@/lib/utils';
import { DollarSignIcon, NotepadTextIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import { toast } from 'sonner';
import AddServiceButton from './add-service-button';
import EditServiceButton from './edit-service-button';

interface ServicesListClientProps {
	services: Promise<PaginatedData<Services>>;
}

const ServicesListClient = ({ services }: ServicesListClientProps) => {
	const servicesResolved = use(services);
	const searchParams = useSearchParams();

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());
		handleNavigation(params);
	};

	const columns = [
		{ header: 'Nome', accessorKey: 'name' },
		{ header: 'Preço', accessorKey: 'priceInCents' },
		{ header: 'Descrição', accessorKey: 'description' },
		{ header: 'Ações', accessorKey: 'actions' },
	];

	const handleDelete = (serviceId: string) => {
		deleteServiceAction.execute({
			id: serviceId,
		});
	};

	const deleteServiceAction = useAction(deleteService, {
		onSuccess: () => {
			toast.success('Serviço deletado com sucesso!');
		},
		onError: (err) => {
			console.error('Erro ao deletar serviço:', err);
			toast.error(
				'Ocorreu um erro ao tentar deletar o serviço. Tente novamente mais tarde.',
			);
		},
	});

	const renderRow = (service: Services) => {
		return (
			<TableRow key={service.id}>
				<TableCell>{service.name}</TableCell>
				<TableCell>{formatCurrencyFromCents(service.priceInCents)}</TableCell>
				<TableCell>{service.description}</TableCell>
				<TableCell className='w-20 space-x-2'>
					<EditServiceButton service={service} />

					<DeleteButton action={() => handleDelete(service.id)} />
				</TableCell>
			</TableRow>
		);
	};

	const renderMobile = (service: Services) => {
		return (
			<div key={service.id} className='flex flex-col gap-4'>
				<div className='flex items-center justify-between'>
					<h3 className='font-bold'>{service.name}</h3>

					<div className='flex flex-col gap-2'>
						<EditServiceButton service={service} />

						<DeleteButton action={() => handleDelete(service.id)} />
					</div>
				</div>

				<Separator />

				<div className='flex flex-col gap-2'>
					<p className='flex items-center gap-4'>
						<span className='text-sm font-semibold'>
							<NotepadTextIcon className='h-4 w-4' />
						</span>
						<span className='text-sm'>{service.description}</span>
					</p>

					<p className='flex items-center gap-4'>
						<span className='text-sm font-semibold'>
							<DollarSignIcon className='h-4 w-4' />
						</span>
						<span className='text-sm'>
							{formatCurrencyFromCents(service.priceInCents)}
						</span>
					</p>
				</div>
			</div>
		);
	};

	return (
		<div className='flex flex-col w-full gap-4'>
			<div className='flex flex-col lg:flex-row items-center justify-between gap-4'>
				<SearchInput />

				<AddServiceButton />
			</div>

			<TableComponent
				emptyMessage='Nenhum serviço encontrado...'
				columns={columns}
				renderRow={renderRow}
				renderMobile={renderMobile}
				data={servicesResolved?.data}
				currentPage={servicesResolved?.metadata.currentPage}
				totalPages={servicesResolved?.metadata.pageCount}
				totalElements={servicesResolved?.metadata.totalCount}
				pageSize={MAX_PAGE_SIZE}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};

export default ServicesListClient;
