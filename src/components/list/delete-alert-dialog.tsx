import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { BanIcon, CheckIcon, Trash2Icon } from 'lucide-react';
import { Button, buttonVariants } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { ReactElement } from 'react';

interface DeleteButtonProps {
	tooltip?: string;
	disabled?: boolean;
	icon?: ReactElement;
	action: () => void;
}

const DeleteAlertButton = ({
	action,
	icon = <Trash2Icon />,
	tooltip = 'Deletar',
	disabled = false,
}: DeleteButtonProps) => {
	return (
		<AlertDialog>
			<Tooltip>
				<TooltipTrigger asChild>
					<AlertDialogTrigger asChild>
						<Button variant='destructive' size={'icon'} disabled={disabled}>
							{icon}
						</Button>
					</AlertDialogTrigger>
				</TooltipTrigger>
				<TooltipContent>{tooltip}</TooltipContent>
			</Tooltip>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
					<AlertDialogDescription className='space-y-1'>
						Tem certeza que deseja excluir o registro? Essa ação não poderá ser
						desfeita.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter className='grid grid-cols-2 gap-3 sm:space-x-0'>
					<AlertDialogCancel
						className={cn(
							buttonVariants({
								variant: 'destructive',
								size: 'default',
							}),
							'mt-0 w-full hover:bg-destructive/90 hover:text-white', // 'mt-0' remove a margem padrão do mobile
						)}
					>
						<BanIcon className='mr-2 h-4 w-4' />
						Cancelar
					</AlertDialogCancel>

					<AlertDialogAction onClick={() => action()} className='w-full'>
						<CheckIcon className='mr-2 h-4 w-4' />
						Confirmar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteAlertButton;
