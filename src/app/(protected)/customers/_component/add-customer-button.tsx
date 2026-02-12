'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import CustomerFormClient from './customer-form';

const AddCustomerButton = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className='w-full lg:w-60'>
					<PlusIcon />
					Adicionar Cliente
				</Button>
			</DialogTrigger>

			<CustomerFormClient onSuccess={() => setIsOpen(false)} />
		</Dialog>
	);
};

export default AddCustomerButton;
