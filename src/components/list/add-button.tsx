'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { ReactElement, useState } from 'react';

interface AddButtonProps {
	text: string;
	renderForm: (onSuccess: () => void) => ReactElement;
}

const AddButton = ({ text, renderForm }: AddButtonProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleSuccess = () => {
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className='w-full lg:w-60'>
					<PlusIcon />
					{text}
				</Button>
			</DialogTrigger>

			{renderForm(handleSuccess)}
		</Dialog>
	);
};

export default AddButton;
