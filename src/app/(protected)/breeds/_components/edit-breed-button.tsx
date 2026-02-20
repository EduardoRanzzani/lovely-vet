import { BreedsWithSpecies } from '@/api/schema/breeds.schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import BreedFormClient from './breed-form';
import { Specie } from '@/api/schema/species.schema';

interface EditBreedButtonProps {
	breed: BreedsWithSpecies;
	species: Specie[];
}

const EditBreedButton = ({ breed, species }: EditBreedButtonProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size={'icon'}>
					<PencilIcon />
				</Button>
			</DialogTrigger>

			{isOpen && (
				<BreedFormClient
					breed={breed}
					onSuccess={() => setIsOpen(false)}
					species={species}
				/>
			)}
		</Dialog>
	);
};

export default EditBreedButton;
