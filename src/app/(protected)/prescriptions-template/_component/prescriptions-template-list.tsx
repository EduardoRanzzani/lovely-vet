'use client';
import { deletePrescriptionTemplate } from '@/api/actions/prescriptions-template.actions';
import { MAX_PAGE_SIZE, PaginatedData } from '@/api/config/consts';
import { DoctorsWithUser } from '@/api/schema/doctors.schema';
import { PrescriptionTemplateWithRelations } from '@/api/schema/prescriptions-template.schema.';
import AddButton from '@/components/list/add-button';
import DeleteAlertButton from '@/components/list/delete-alert-dialog';
import EditButton from '@/components/list/edit-button';
import SearchInput from '@/components/list/search-input';
import TableComponent from '@/components/list/table-component';
import { TableCell, TableRow } from '@/components/ui/table';
import { handleNavigation } from '@/lib/utils';
import { useAction } from 'next-safe-action/hooks';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import { toast } from 'sonner';
import PrescriptionTemplateFormClient from './prescription-template-form';

interface PrescriptionsTemplateListClientProps {
	prescriptionsTemplate: Promise<
		PaginatedData<PrescriptionTemplateWithRelations>
	>;
	doctors: DoctorsWithUser[];
}

const PrescriptionsTemplateListClient = ({
	prescriptionsTemplate,
	doctors,
}: PrescriptionsTemplateListClientProps) => {
	const prescriptionTemplatesResolved = use(prescriptionsTemplate);
	const searchParams = useSearchParams();

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());
		handleNavigation(params);
	};

	const handleDelete = (id: string) => {
		deletePrescriptionTemplateAction.execute({
			id: id,
		});
	};

	const deletePrescriptionTemplateAction = useAction(
		deletePrescriptionTemplate,
		{
			onSuccess: () => {
				toast.success('Modelo de receita deletado com sucesso!');
			},
			onError: (err) => {
				console.error('Erro ao deletar modelo de receita:', { err });
				toast.error(
					'Ocorreu um erro ao tentar deletar o modelo de receita. Tente novamente mais tarde.',
				);
			},
		},
	);

	const columns = [
		{ header: 'Título', accessorKey: 'title' },
		{ header: 'Ações', accessorKey: 'actions' },
	];

	const renderRow = (
		prescriptionTemplate: PrescriptionTemplateWithRelations,
	) => {
		return (
			<TableRow key={prescriptionTemplate.id}>
				<TableCell>{prescriptionTemplate.title}</TableCell>
				<TableCell className='w-20 space-x-2'>
					<EditButton
						tooltip={`Editar ${prescriptionTemplate.title}`}
						renderForm={(close) => (
							<PrescriptionTemplateFormClient
								prescriptionTemplate={prescriptionTemplate}
								doctors={doctors}
								onSuccess={close}
							/>
						)}
					/>

					<DeleteAlertButton
						action={() => handleDelete(prescriptionTemplate.id)}
					/>
				</TableCell>
			</TableRow>
		);
	};

	const renderMobile = (
		prescriptionTemplate: PrescriptionTemplateWithRelations,
	) => {
		return (
			<div key={prescriptionTemplate.id} className='flex flex-col gap-4'>
				<div className='flex items-center justify-between'>
					<h3 className='font-bold'>{prescriptionTemplate.title}</h3>

					<span className='flex flex-col gap-2'>
						<EditButton
							tooltip={`Editar ${prescriptionTemplate.title}`}
							renderForm={(close) => (
								<PrescriptionTemplateFormClient
									prescriptionTemplate={prescriptionTemplate}
									doctors={doctors}
									onSuccess={close}
								/>
							)}
						/>

						<DeleteAlertButton
							action={() => handleDelete(prescriptionTemplate.id)}
						/>
					</span>
				</div>
			</div>
		);
	};

	return (
		<div className='flex flex-col w-full gap-4'>
			<div className='flex flex-col lg:flex-row items-center justify-between gap-4'>
				<SearchInput />

				<AddButton
					text='Adicionar Modelo'
					renderForm={(close) => (
						<PrescriptionTemplateFormClient
							doctors={doctors}
							onSuccess={close}
						/>
					)}
				/>
			</div>

			<TableComponent
				emptyMessage='Nenhum modelo de receita cadastrado...'
				columns={columns}
				renderRow={renderRow}
				renderMobile={renderMobile}
				data={prescriptionTemplatesResolved?.data}
				currentPage={prescriptionTemplatesResolved?.metadata.currentPage}
				totalPages={prescriptionTemplatesResolved?.metadata.pageCount}
				totalElements={prescriptionTemplatesResolved?.metadata.totalCount}
				pageSize={MAX_PAGE_SIZE}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};

export default PrescriptionsTemplateListClient;
