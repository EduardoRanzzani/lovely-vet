import { upsertSpecie } from '@/api/actions/species.actions';
import {
	createSpecieSchema,
	CreateSpecieSchema,
	Specie,
} from '@/api/schema/species.schema';
import InputForm from '@/components/form/input-form';
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

interface SpecieFormClientProps {
	specie?: Specie;
	onSuccess?: () => void;
}

const SpecieFormClient = ({ specie, onSuccess }: SpecieFormClientProps) => {
	const form = useForm<CreateSpecieSchema>({
		resolver: zodResolver(createSpecieSchema),
		shouldUnregister: true,
		defaultValues: {
			name: specie?.name || '',
		},
	});

	const formSubmit = (data: CreateSpecieSchema) => {
		upsertSpecieAction.execute({
			...data,
			id: specie?.id,
		});
	};

	const upsertSpecieAction = useAction(upsertSpecie, {
		onSuccess: () => {
			onSuccess?.();
			toast.success('Espécie salva com sucesso!');
			form.reset();
		},
		onError: (err) => {
			console.error({ err });
			toast.error('Ocorreu um erro ao salvar a espécie!');
		},
	});

	return (
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
						<DialogTitle>
							{specie ? 'Atualizar Espécie' : 'Cadastrar Espécie'}
						</DialogTitle>
						<DialogDescription>
							{specie
								? 'Atualize as informações da espécie selecionada'
								: 'Adicione uma nova espécie ao sistema'}
						</DialogDescription>
					</DialogHeader>

					<InputForm
						label='Descrição'
						register={form.register}
						name='name'
						error={form.formState.errors.name?.message}
					/>

					<DialogFooter>
						<div className='flex flex-col lg:flex-row gap-4 w-full mt-4'>
							<DialogClose asChild>
								<Button
									type='button'
									variant={'destructive'}
									onClick={() => {
										if (!upsertSpecieAction.isPending) form.reset();
									}}
									className='flex-1'
								>
									<BanIcon />
									Cancelar
								</Button>
							</DialogClose>

							<Button
								type='submit'
								disabled={upsertSpecieAction.isPending}
								className='flex-1'
							>
								{upsertSpecieAction.isPending ? (
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

export default SpecieFormClient;
