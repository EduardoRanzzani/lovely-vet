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
import { Button, buttonVariants } from '../ui/button';
import { BanIcon, CheckIcon, Trash2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeleteButtonProps {
	action: () => void;
}

const DeleteButton = ({ action }: DeleteButtonProps) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant='destructive' size={'icon'}>
					<Trash2Icon />
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
					<AlertDialogDescription>
						Essa ação não poderá ser desfeita.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter className='flex items-center gap-4 w-full'>
					<AlertDialogCancel
						className={cn(
							buttonVariants({
								variant: 'destructive',
								size: 'default',
							}),
							'hover:text-destructive',
						)}
					>
						<BanIcon />
						Cancelar
					</AlertDialogCancel>

					<AlertDialogAction onClick={() => action()}>
						<CheckIcon />
						Confirmar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteButton;
