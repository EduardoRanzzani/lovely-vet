import { CustomerWithUser } from '@/api/schema/customers.schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import CustomerFormClient from './customer-form';

interface EditCustomerButtonProps {
	customer: CustomerWithUser;
}

const EditCustomerButton = ({ customer }: EditCustomerButtonProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size={'icon'}>
					<PencilIcon />
				</Button>
			</DialogTrigger>

			{isOpen && (
				<CustomerFormClient
					customer={customer}
					onSuccess={() => setIsOpen(false)}
				/>
			)}
		</Dialog>
	);
};

export default EditCustomerButton;
