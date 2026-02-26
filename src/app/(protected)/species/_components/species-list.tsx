'use client';

import { deleteSpecie } from '@/api/actions/species.actions';
import { MAX_PAGE_SIZE, PaginatedData } from '@/api/config/consts';
import { Specie } from '@/api/schema/species.schema';
import AddButton from '@/components/list/add-button';
import DeleteAlertButton from '@/components/list/delete-alert-dialog';
import SearchInput from '@/components/list/search-input';
import TableComponent from '@/components/list/table-component';
import { TableCell, TableRow } from '@/components/ui/table';
import { handleNavigation } from '@/lib/utils';
import { useAction } from 'next-safe-action/hooks';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import { toast } from 'sonner';
import EditSpecieButton from './edit-specie-button';
import SpecieFormClient from './specie-form';

interface SpeciesListClientProps {
	species: Promise<PaginatedData<Specie>>;
}

const SpeciesListClient = ({ species }: SpeciesListClientProps) => {
	const speciesResolved = use(species);
	const searchParams = useSearchParams();

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());
		handleNavigation(params);
	};

	const handleDelete = (specieId: string) => {
		deleteSpecieAction.execute({
			id: specieId,
		});
	};

	const deleteSpecieAction = useAction(deleteSpecie, {
		onSuccess: () => {
			toast.success('Espécie deletada com sucesso!');
		},
		onError: (err) => {
			console.error('Erro ao deletar espécie:', err);
			toast.error(
				'Ocorreu um erro ao tentar deletar a espécie. Tente novamente mais tarde.',
			);
		},
	});

	const columns = [
		{ header: 'Descrição', accessorKey: 'name' },
		{ header: 'Ações', accessorKey: 'actions' },
	];

	const renderRow = (specie: Specie) => {
		return (
			<TableRow key={specie.id}>
				<TableCell>{specie.name}</TableCell>
				<TableCell className='w-20 space-x-2'>
					<EditSpecieButton specie={specie} />

					<DeleteAlertButton action={() => handleDelete(specie.id)} />
				</TableCell>
			</TableRow>
		);
	};

	const renderMobile = (specie: Specie) => {
		return (
			<div key={specie.id} className='flex flex-col gap-4'>
				<div className='flex items-center justify-between'>
					<span className='flex flex-col'>
						<h3 className='font-bold'>{specie.name}</h3>
					</span>

					<span className='flex flex-col gap-2'>
						<EditSpecieButton specie={specie} />

						<DeleteAlertButton action={() => handleDelete(specie.id)} />
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
					text='Adicionar Espécie'
					renderForm={(close) => <SpecieFormClient onSuccess={close} />}
				/>
			</div>

			<TableComponent
				emptyMessage='Nenhuma espécie encontrada...'
				columns={columns}
				renderRow={renderRow}
				renderMobile={renderMobile}
				data={speciesResolved?.data}
				currentPage={speciesResolved?.metadata.currentPage}
				totalPages={speciesResolved?.metadata.pageCount}
				totalElements={speciesResolved?.metadata.totalCount}
				pageSize={MAX_PAGE_SIZE}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};
export default SpeciesListClient;
