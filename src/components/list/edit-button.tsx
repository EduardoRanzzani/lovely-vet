import { PencilIcon } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface EditButtonProps {
	form: ReactNode;
	disabled?: boolean;
}

const EditButton = ({ form, disabled = false }: EditButtonProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<Tooltip>
				<TooltipTrigger>
					<DialogTrigger asChild>
						<Button size={'icon'} disabled={disabled}>
							<PencilIcon />
						</Button>
					</DialogTrigger>
				</TooltipTrigger>
				<TooltipContent>Editar o agendamento</TooltipContent>
			</Tooltip>

			{isOpen && form}
		</Dialog>
	);
};

export default EditButton;
