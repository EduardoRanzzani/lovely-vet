'use client';

import { deleteBreed } from '@/api/actions/breeds.actions';
import { MAX_PAGE_SIZE, PaginatedData } from '@/api/config/consts';
import { BreedsWithSpecies } from '@/api/schema/breeds.schema';
import { Specie } from '@/api/schema/species.schema';
import DeleteAlertButton from '@/components/list/delete-alert-dialog';
import SearchInput from '@/components/list/search-input';
import TableComponent from '@/components/list/table-component';
import { TableCell, TableRow } from '@/components/ui/table';
import { handleNavigation } from '@/lib/utils';
import { useAction } from 'next-safe-action/hooks';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import { toast } from 'sonner';
import AddBreedButton from './add-breed-button';
import EditBreedButton from './edit-breed-button';

interface BreedsListClientProps {
	breeds: Promise<PaginatedData<BreedsWithSpecies>>;
	species: Specie[];
}

const BreedsListClient = ({ breeds, species }: BreedsListClientProps) => {
	const breedsResolved = use(breeds);
	const searchParams = useSearchParams();

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());
		handleNavigation(params);
	};

	const handleDelete = (breedId: string) => {
		deleteBreedAction.execute({
			id: breedId,
		});
	};

	const deleteBreedAction = useAction(deleteBreed, {
		onSuccess: () => {
			toast.success('Raça deletada com sucesso!');
		},
		onError: (err) => {
			console.error('Erro ao deletar raça:', err);
			toast.error(
				'Ocorreu um erro ao tentar deletar a raça. Tente novamente mais tarde.',
			);
		},
	});

	const columns = [
		{ header: 'Descrição', accessorKey: 'name' },
		{ header: 'Espécie', accessorKey: 'specie' },
		{ header: 'Ações', accessorKey: 'actions' },
	];

	const renderRow = (breed: BreedsWithSpecies) => {
		return (
			<TableRow key={breed.id}>
				<TableCell>{breed.name}</TableCell>
				<TableCell>{breed.specie.name}</TableCell>
				<TableCell className='w-20 space-x-2'>
					<EditBreedButton breed={breed} species={species} />

					<DeleteAlertButton action={() => handleDelete(breed.id)} />
				</TableCell>
			</TableRow>
		);
	};

	const renderMobile = (breed: BreedsWithSpecies) => {
		return (
			<div key={breed.id} className='flex flex-col gap-4'>
				<div className='flex items-center justify-between'>
					<span className='flex flex-col gap-2'>
						<h3 className='font-bold'>{breed.name}</h3>
						<p className='text-xs text-muted-foreground'>{breed.specie.name}</p>
					</span>

					<div className='flex flex-col gap-2'>
						<EditBreedButton breed={breed} species={species} />

						<DeleteAlertButton action={() => handleDelete(breed.id)} />
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className='flex flex-col w-full gap-4'>
			<div className='flex flex-col lg:flex-row items-center justify-between gap-4'>
				<SearchInput />

				<AddBreedButton species={species} />
			</div>

			<TableComponent
				emptyMessage='Nenhuma espécie encontrada...'
				columns={columns}
				renderRow={renderRow}
				renderMobile={renderMobile}
				data={breedsResolved?.data}
				currentPage={breedsResolved?.metadata.currentPage}
				totalPages={breedsResolved?.metadata.pageCount}
				totalElements={breedsResolved?.metadata.totalCount}
				pageSize={MAX_PAGE_SIZE}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};

export default BreedsListClient;
