'use client';

import { BreedsWithSpecies } from '@/api/schema/breeds.schema';
import { CustomerWithUser } from '@/api/schema/customers.schema';
import { Species } from '@/api/schema/species.schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import PetFormClient from './pet-form';

interface EditPetButtonProps {
	species: Species[];
	breeds: BreedsWithSpecies[];
	customers: CustomerWithUser[];
}

const EditPetButton = ({ species, breeds, customers }: EditPetButtonProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size={'icon'}>
					<PencilIcon />
				</Button>
			</DialogTrigger>

			<PetFormClient
				onSuccess={() => setIsOpen(false)}
				species={species}
				breeds={breeds}
				customers={customers}
			/>
		</Dialog>
	);
};

export default EditPetButton;
