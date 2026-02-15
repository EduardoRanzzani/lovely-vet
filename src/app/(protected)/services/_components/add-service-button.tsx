import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import ServiceFormClient from './service-form';

const AddServiceButton = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className='w-full lg:w-60'>
					<PlusIcon />
					Adicionar Serviço
				</Button>
			</DialogTrigger>

			<ServiceFormClient onSuccess={() => setIsOpen(false)} />
		</Dialog>
	);
};

export default AddServiceButton;
