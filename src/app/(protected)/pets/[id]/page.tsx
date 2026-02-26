import { getPetById } from '@/api/actions/pets.actions';
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

	return (
		<PageContainer>
			<PageHeader>
				<PageHeaderContent>
					<PageTitle>Detalhes do Pet</PageTitle>
					<PageDescription>Detalhes do cadastro do pet</PageDescription>
				</PageHeaderContent>
			</PageHeader>

			<PageContent>
				<PetDetailsClient pet={pet} />
			</PageContent>
		</PageContainer>
	);
};

export default PetDetailsPage;
