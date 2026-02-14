import { BreedsWithSpecies } from '@/api/schema/breeds.schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import BreedFormClient from './breed-form';

interface EditBreedButtonProps {
	breed: BreedsWithSpecies;
}

const EditBreedButton = ({ breed }: EditBreedButtonProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size={'icon'}>
					<PencilIcon />
				</Button>
			</DialogTrigger>

			{isOpen && (
				<BreedFormClient breed={breed} onSuccess={() => setIsOpen(false)} />
			)}
		</Dialog>
	);
};

export default EditBreedButton;
