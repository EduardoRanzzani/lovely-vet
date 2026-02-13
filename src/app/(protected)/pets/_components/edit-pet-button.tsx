'use client';

import { PetsWithTutorAndBreed } from '@/api/schema/pets.schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import PetFormClient from './pet-form';

interface EditPetButtonProps {
	pet: PetsWithTutorAndBreed;
}

const EditPetButton = ({ pet }: EditPetButtonProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size={'icon'}>
					<PencilIcon />
				</Button>
			</DialogTrigger>

			<PetFormClient pet={pet} onSuccess={() => setIsOpen(false)} />
		</Dialog>
	);
};

export default EditPetButton;
