import { upsertPrescriptionsTemplate } from '@/api/actions/prescriptions-template.actions';
import { DoctorsWithUser } from '@/api/schema/doctors.schema';
import {
	createPrescriptionTemplateSchema,
	CreatePrescriptionTemplateSchema,
	PrescriptionTemplateWithRelations,
} from '@/api/schema/prescriptions-template.schema.';
import InputForm from '@/components/form/input-form';
import SelectForm from '@/components/form/select-form';
import EditorForm from '@/components/form/text-editor-form';
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
import { BanIcon, Loader2Icon, SaveIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface PrescriptionTemplateFormClientProps {
	prescriptionTemplate?: PrescriptionTemplateWithRelations;
	doctors: DoctorsWithUser[];
	onSuccess: () => void;
}

const PrescriptionTemplateFormClient = ({
	prescriptionTemplate,
	doctors,
	onSuccess,
}: PrescriptionTemplateFormClientProps) => {
	const form = useForm<CreatePrescriptionTemplateSchema>({
		resolver: zodResolver(createPrescriptionTemplateSchema),
		shouldUnregister: true,
		defaultValues: {
			title: prescriptionTemplate?.title || '',
			content: prescriptionTemplate?.content || '',
			doctorId: prescriptionTemplate?.doctorId || '',
		},
	});

	const formSubmit = (data: CreatePrescriptionTemplateSchema) => {
		upsertPrescriptionTemplateAction.execute({
			...data,
			id: prescriptionTemplate?.id,
		});
	};

	const upsertPrescriptionTemplateAction = useAction(
		upsertPrescriptionsTemplate,
		{
			onSuccess: () => {
				onSuccess?.();
				toast.success('Modelo de receita salva com sucesso!');
				form.reset();
			},
			onError: (err) => {
				console.error({ err });
				toast.error('Ocorreu um erro ao salvar o modelo de receita!');
			},
		},
	);

	return (
		<DialogContent
			onInteractOutside={(e) => e.preventDefault()}
			showCloseButton={false}
			className='max-w-lg h-screen xs:h-auto overflow-scroll'
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(formSubmit)}
					className='flex flex-col gap-4 w-full min-w-0'
				>
					<DialogHeader>
						<DialogTitle>
							{prescriptionTemplate
								? 'Atualizar Modelo de Receita'
								: 'Cadastrar Modelo de Receita'}
						</DialogTitle>
						<DialogDescription>
							{prescriptionTemplate
								? 'Atualize as informações do modelo de receita selecionado'
								: 'Adicione um novo modelo de receita ao sistema'}
						</DialogDescription>
					</DialogHeader>

					<InputForm
						label='Título:'
						register={form.register}
						name='title'
						error={form.formState.errors.title?.message}
					/>

					<SelectForm
						label='Veterinário:'
						name='doctorId'
						control={form.control}
						error={form.formState.errors.doctorId?.message}
						options={doctors.map((doctor) => ({
							value: doctor.id,
							label: doctor.user.name,
						}))}
					/>

					<EditorForm
						label='Conteúdo:'
						control={form.control}
						name='content'
						className='w-full'
						error={form.formState.errors.content?.message}
					/>

					<DialogFooter>
						<div className='flex flex-col lg:flex-row gap-4 w-full mt-4'>
							<DialogClose asChild>
								<Button
									type='button'
									variant={'destructive'}
									onClick={() => {
										if (!upsertPrescriptionTemplateAction.isPending)
											form.reset();
									}}
									className='flex-1'
								>
									<BanIcon />
									Cancelar
								</Button>
							</DialogClose>

							<Button
								type='submit'
								disabled={upsertPrescriptionTemplateAction.isPending}
								className='flex-1'
							>
								{upsertPrescriptionTemplateAction.isPending ? (
									<Loader2Icon className='h-5 w-5 animate-spin' />
								) : (
									<>
										<SaveIcon />
										Salvar
									</>
								)}
							</Button>
						</div>
					</DialogFooter>
				</form>
			</Form>
		</DialogContent>
	);
};

export default PrescriptionTemplateFormClient;
