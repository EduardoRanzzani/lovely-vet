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
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BanIcon, BriefcaseMedicalIcon, SaveIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

interface DialogServicesProps {
	petId: string;
}

const formSchema = z.object({
	test: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

const DialogServices = ({ petId }: DialogServicesProps) => {
	const [open, setOpen] = useState<boolean>(false);

	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			test: '',
		},
	});

	const formSubmit = (data: FormSchema) => {
		// insertServiceAction.execute({
		// 	...data,
		// 	petId: petId,
		// });

		console.log('');
	};

	// const insertServiceAction = useAction(insertService, {
	// 	onSuccess: () => {
	// 		toast.success('Atendimento salvo com sucesso!');
	// 		setOpen(false);
	// 		form.reset();
	// 	},
	// 	onError: (err) => {
	// 		console.error('Erro ao salvar o atendimento:', { err });
	// 		toast.error('Ocorreu um erro ao salvar o atendimento.');
	// 	},
	// });

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			form.reset();
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button className='bg-appointment hover:bg-appointment/80'>
					<BriefcaseMedicalIcon />
					Atendimento
				</Button>
			</DialogTrigger>

			<DialogContent
				onInteractOutside={(e) => e.preventDefault()}
				showCloseButton={false}
			>
				<DialogHeader>
					<DialogTitle>Registrar Atendimento</DialogTitle>
					<DialogDescription>
						Preencha as informações do atendimento realizado
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(formSubmit)}
						className='flex flex-col gap-2'
					>
						<DialogFooter>
							<div className='flex flex-col lg:flex-row gap-4 w-full mt-4'>
								<DialogClose asChild>
									<Button
										type='button'
										variant={'destructive'}
										// onClick={() => {
										// if (!upsertPetAction.isPending) form.reset();
										// }}
										className='flex-1'
									>
										<BanIcon />
										Cancelar
									</Button>
								</DialogClose>

								<Button
									type='submit'
									// disabled={upsertPetAction.isPending}
									className='flex-1'
								>
									{/* {upsertPetAction.isPending ? ( */}
									{/* <Loader2Icon className='h-5 w-5 animate-spin' /> */}
									{/* ) : ( */}
									{/* <> */}
									<SaveIcon />
									Salvar
									{/* </> */}
									{/* )} */}
								</Button>
							</div>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>

			{/* {insertServiceAction.isPending && <LoadingDialog />} */}
		</Dialog>
	);
};

export default DialogServices;
