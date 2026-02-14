import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import BreedFormClient from './breed-form';

const AddBreedButton = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className='w-full lg:w-60'>
					<PlusIcon />
					Adicionar Raça
				</Button>
			</DialogTrigger>

			<BreedFormClient onSuccess={() => setIsOpen(false)} />
		</Dialog>
	);
};

export default AddBreedButton;
