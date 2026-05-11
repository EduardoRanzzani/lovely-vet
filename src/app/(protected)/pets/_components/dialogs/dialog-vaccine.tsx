import {
	createVaccineSchema,
	CreateVaccineSchema,
} from '@/api/schema/vaccine.schema';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { BanIcon, SaveIcon, SyringeIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface DialogVaccineProps {
	petId: string;
}

const DialogVaccine = ({ petId }: DialogVaccineProps) => {
	const [open, setOpen] = useState<boolean>(false);

	const form = useForm<CreateVaccineSchema>({
		resolver: zodResolver(createVaccineSchema),
		shouldUnregister: true,
		defaultValues: {
			petId,
		},
	});

	const formSubmit = (data: CreateVaccineSchema) => {
		console.log(data);
	};

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			form.reset();
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button className='bg-vaccine hover:bg-vaccine/80'>
					<SyringeIcon />
					Vacinas
				</Button>
			</DialogTrigger>
			<DialogContent
				onInteractOutside={(e) => e.preventDefault()}
				showCloseButton={false}
			>
				<DialogHeader>
					<DialogTitle>Nova Vacina</DialogTitle>
					<DialogDescription>
						Informe os dados da vacina aplicada e a data de retorno
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className='mt-4'>
					<DialogClose asChild className='flex-1'>
						<Button variant={'destructive'}>
							<BanIcon /> Cancelar
						</Button>
					</DialogClose>

					<Button type='submit' className='flex-1'>
						<SaveIcon />
						Salvar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DialogVaccine;
