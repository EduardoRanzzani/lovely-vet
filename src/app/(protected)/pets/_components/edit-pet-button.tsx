'use client';

import { BreedsWithSpecies } from '@/api/schema/breeds.schema';
import { CustomerWithUser } from '@/api/schema/customers.schema';
import { PetsWithTutorAndBreed } from '@/api/schema/pets.schema';
import { Specie } from '@/api/schema/species.schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import PetFormClient from './pet-form';

interface EditPetButtonProps {
	pet: PetsWithTutorAndBreed;
	species: Specie[];
	breeds: BreedsWithSpecies[];
	customers: CustomerWithUser[];
}

const EditPetButton = ({
	pet,
	species,
	breeds,
	customers,
}: EditPetButtonProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size={'icon'}>
					<PencilIcon />
				</Button>
			</DialogTrigger>

			<PetFormClient
				pet={pet}
				onSuccess={() => setIsOpen(false)}
				species={species}
				breeds={breeds}
				customers={customers}
			/>
		</Dialog>
	);
};

export default EditPetButton;
