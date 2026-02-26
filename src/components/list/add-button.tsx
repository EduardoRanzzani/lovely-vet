'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useUser } from '@clerk/nextjs';
import { PlusIcon } from 'lucide-react';
import { ReactElement, useState } from 'react';

interface AddButtonProps {
	text: string;
	renderForm: (onSuccess: () => void) => ReactElement;
}

const AddButton = ({ text, renderForm }: AddButtonProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { user } = useUser();
	console.log({ user });

	const isCustomer = user?.publicMetadata?.role === 'customer';

	const handleSuccess = () => {
		setIsOpen(false);
	};

	return (
		<>
			{!isCustomer && (
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogTrigger asChild>
						<Button className='w-full lg:w-60'>
							<PlusIcon />
							{text}
						</Button>
					</DialogTrigger>

					{renderForm(handleSuccess)}
				</Dialog>
			)}
		</>
	);
};

export default AddButton;
