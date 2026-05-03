'use client';

import { changeUserId } from '@/api/actions/admin.actions';
import { Button } from '@/components/ui/button';
import { FolderCodeIcon, Loader2Icon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';

const AdminFormClient = () => {
	const changeToProd = async () => {
		changeUserIdAction.execute({ environment: 'prod' });
	};

	const changeToDev = async () => {
		changeUserIdAction.execute({ environment: 'dev' });
	};

	const changeUserIdAction = useAction(changeUserId, {
		onSuccess: () => {
			toast.success('Usuário alterado com sucesso!');
		},
		onError: (err) => {
			console.error({ err });
			toast.error('Ocorreu um erro ao alterar o usuário!');
		},
	});

	return (
		<div className='flex flex-col gap-4 w-200'>
			<h1 className='text-2xl font-bold'>Mudar cadastro</h1>
			<p>Alterar o id de usuário para acessar itens de dev/prod</p>

			<div className='flex gap-4'>
				<Button className='flex-1' onClick={changeToProd}>
					{changeUserIdAction.isPending ? (
						<>
							<Loader2Icon className='animate-spin' />
							Mudando...
						</>
					) : (
						<>
							<FolderCodeIcon />
							Mudar para prod
						</>
					)}
				</Button>

				<Button className='flex-1' onClick={changeToDev}>
					{changeUserIdAction.isPending ? (
						<>
							<Loader2Icon className='animate-spin' />
							Mudando...
						</>
					) : (
						<>
							<FolderCodeIcon />
							Mudar para dev
						</>
					)}
				</Button>
			</div>
		</div>
	);
};

export default AdminFormClient;
