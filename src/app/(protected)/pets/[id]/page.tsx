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
import { notFound } from 'next/navigation';
import PetDetailsClient from '../_components/pet-details';

interface PetDetailsPageProps {
	params: Promise<{ id: string }>;
}

const PetDetailsPage = async ({ params }: PetDetailsPageProps) => {
	const { id } = await params;
	const pet = await getPetById(id);

	if (!pet) notFound();

	const species = await getSpecies();
	const breeds = await getBreeds();
	const customers = await getCustomers();

	return (
		<PageContainer>
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Detalhes do Pet</PageTitle>
					<PageDescription>Detalhes do cadastro do pet</PageDescription>
				</PageHeaderContent>
			</PageHeader>

			<PageContent>
				<PetDetailsClient
					pet={pet}
					species={species}
					breeds={breeds}
					customers={customers}
				/>
			</PageContent>
		</PageContainer>
	);
};

export default PetDetailsPage;
