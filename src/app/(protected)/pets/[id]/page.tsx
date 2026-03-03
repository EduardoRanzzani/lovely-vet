import { getBreeds } from '@/api/actions/breeds.actions';
import { getCustomers } from '@/api/actions/customers.actions';
import { getPetById } from '@/api/actions/pets.actions';
import { getSpecies } from '@/api/actions/species.actions';
import {
	PageContainer,
	PageContent,
	PageDescription,
	PageHeader,
	PageHeaderContent,
	PageTitle,
} from '@/components/shared/page-container';
import LoadingDialog from '@/components/ui/loading';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import PetDetailsClient from '../_components/pet-details';
import { PetDetailsSkeleton } from '../_components/pet-details-skeleton';

interface PetDetailsPageProps {
	params: Promise<{ id: string }>;
}

const PetDetailsPage = async ({ params }: PetDetailsPageProps) => {
	const { id } = await params;

	const pet = await getPetById(id);
	if (!pet) notFound();

	const speciesPromise = getSpecies();
	const breedsPromise = getBreeds();
	const customersPromise = getCustomers();

	return (
		<PageContainer>
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Detalhes do Pet</PageTitle>
					<PageDescription>Detalhes do cadastro do pet</PageDescription>
				</PageHeaderContent>
			</PageHeader>

			<PageContent>
				<Suspense
					fallback={
						<>
							<PetDetailsSkeleton />
							<LoadingDialog />
						</>
					}
				>
					<PetDetailsClient
						pet={pet}
						speciesPromise={speciesPromise}
						breedsPromise={breedsPromise}
						customersPromise={customersPromise}
					/>
				</Suspense>
			</PageContent>
		</PageContainer>
	);
};

export default PetDetailsPage;
