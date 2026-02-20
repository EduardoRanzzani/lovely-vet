'use client';
import { BreedsWithSpecies } from '@/api/schema/breeds.schema';
import { CustomerWithUser } from '@/api/schema/customers.schema';
import { Specie } from '@/api/schema/species.schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import PetFormClient from './pet-form';

interface AddPetButtonProps {
	species: Specie[];
	breeds: BreedsWithSpecies[];
	customers: CustomerWithUser[];
}

const AddPetButton = ({ species, breeds, customers }: AddPetButtonProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className='w-full lg:w-60'>
					<PlusIcon />
					Adicionar Pet
				</Button>
			</DialogTrigger>

			<PetFormClient
				species={species}
				breeds={breeds}
				customers={customers}
				onSuccess={() => setIsOpen(false)}
			/>
		</Dialog>
	);
};

export default AddPetButton;
