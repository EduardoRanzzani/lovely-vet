'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { LucideIcon } from 'lucide-react';
import { ReactElement, useState } from 'react';

interface DialogButtonProps {
	text: string;
	icon: LucideIcon;
	renderForm: (onSuccess: () => void) => ReactElement;
}

const DialogButton = ({ text, icon: Icon, renderForm }: DialogButtonProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleSuccess = () => {
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className='w-full lg:w-60 flex items-center gap-2'>
					<Icon />
					{text}
				</Button>
			</DialogTrigger>

			{isOpen && renderForm(handleSuccess)}
		</Dialog>
	);
};

export default DialogButton;
