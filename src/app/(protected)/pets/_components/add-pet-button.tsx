'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import PetFormClient from './pet-form';

const AddPetButton = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className='w-full lg:w-60'>
					<PlusIcon />
					Adicionar Pet
				</Button>
			</DialogTrigger>

			<PetFormClient onSuccess={() => setIsOpen(false)} />
		</Dialog>
	);
};

export default AddPetButton;
