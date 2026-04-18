import {
	createShiftSchema,
	CreateShiftSchema,
	ShiftWithDoctor,
} from '@/api/schema/shifts.schema';
import { Button } from '@/components/ui/button';
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BanIcon, SaveIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ShiftFormProps {
	shift?: ShiftWithDoctor;
	selectedDate?: Date | null;
	onSuccess?: () => void;
}

const ShiftFormClient = ({
	shift,
	selectedDate,
	onSuccess,
}: ShiftFormProps) => {
	const form = useForm<CreateShiftSchema>({
		resolver: zodResolver(createShiftSchema),
		shouldUnregister: true,
		defaultValues: {
			startTime: shift?.startTime || selectedDate || new Date(),
			endTime: shift?.endTime || selectedDate || new Date(),
			doctorId: shift?.doctorId || '',
		},
	});

	const formSubmit = (data: CreateShiftSchema) => {
		console.log(data);
	};

	return (
		<DialogContent
			onInteractOutside={(e) => e.preventDefault()}
			showCloseButton={false}
		>
			<DialogHeader>
				<DialogTitle>
					{shift ? 'Editar Plantão' : 'Cadastrar Plantão'}
				</DialogTitle>
				<DialogDescription>
					{shift
						? 'Edite as informações do seu plantão selecionado'
						: 'Adicione um novo plantão na agenda'}
				</DialogDescription>
			</DialogHeader>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(formSubmit)}
					className='flex flex-col gap-4'
				>
					<DialogFooter>
						<div className='flex flex-col lg:flex-row gap-4 w-full mt-4'>
							<DialogClose asChild>
								<Button
									type='button'
									variant={'destructive'}
									className='flex-1'
								>
									<BanIcon />
									Cancelar
								</Button>
							</DialogClose>

							<Button type='submit' className='flex-1'>
								<SaveIcon />
								Salvar
							</Button>
						</div>
					</DialogFooter>
				</form>
			</Form>
		</DialogContent>
	);
};

export default ShiftFormClient;
