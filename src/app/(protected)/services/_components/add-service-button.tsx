import { Specie } from '@/api/schema/species.schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import ServiceFormClient from './service-form';

interface AddServiceButtonProps {
	species: Specie[];
}

const AddServiceButton = ({ species }: AddServiceButtonProps) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className='w-full lg:w-60'>
					<PlusIcon />
					Adicionar Serviço
				</Button>
			</DialogTrigger>

			<ServiceFormClient species={species} onSuccess={() => setIsOpen(false)} />
		</Dialog>
	);
};

export default AddServiceButton;
