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
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const formSchema = z.object({
	test: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

const DialogServices = () => {
	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
	});

	const formSubmit = (data: FormSchema) => {
		toast.success(JSON.stringify(data));
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className='bg-atendimento hover:bg-atendimento/80'>
					<BriefcaseMedicalIcon />
					Atendimento
				</Button>
			</DialogTrigger>

			<DialogContent
				onInteractOutside={(e) => e.preventDefault()}
				showCloseButton={false}
				className='max-w-lg'
			>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(formSubmit)}
						className='flex flex-col gap-2'
					>
						<DialogHeader>
							<DialogTitle>Registrar Atendimento</DialogTitle>
							<DialogDescription>
								Preencha as informações do atendimento realizado
							</DialogDescription>
						</DialogHeader>

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
		</Dialog>
	);
};

export default DialogServices;
