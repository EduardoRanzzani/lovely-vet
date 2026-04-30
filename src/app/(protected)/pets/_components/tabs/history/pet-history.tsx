import DeleteAlertButton from '@/components/list/delete-alert-dialog';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HistoryItemProps {
	title: string;
	subtitle?: string;
	date: Date;
	icon: React.ReactNode;
	colorClass: string;
	content: React.ReactNode;
	canDelete?: boolean;
	onDelete?: () => void;
}

export const HistoryItem = ({
	title,
	subtitle,
	date,
	icon,
	colorClass,
	content,
	canDelete,
	onDelete,
}: HistoryItemProps) => {
	return (
		<div className='flex gap-4 mb-8 relative group'>
			{/* Linha vertical da timeline */}
			<div className='absolute left-5 top-10 -bottom-8 w-0.5 bg-muted last:hidden' />

			{/* Ícone */}
			<div
				className={`z-10 flex items-center justify-center w-10 h-10 rounded-full shrink-0 shadow-md ${colorClass} border`}
			>
				{icon}
			</div>

			{/* Conteúdo */}
			<div
				className={cn(
					'flex flex-col gap-1 w-full border rounded-lg p-4 shadow-md relative',
					`${colorClass}`,
				)}
			>
				<div className='flex justify-between items-center'>
					<div className='flex justify-between items-start pr-6'>
						<div className='flex flex-col'>
							<h4 className='font-bold text-sm'>{title}</h4>
							{subtitle && (
								<p className='text-xs text-muted-foreground'>{subtitle}</p>
							)}
							<p className='text-[10px] font-medium uppercase text-muted-foreground'>
								{format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
							</p>
						</div>
					</div>

					{/* Botão de Deletar Condicional */}

					{canDelete && (
						<DeleteAlertButton
							disabled={!canDelete}
							action={() => onDelete?.()}
						/>
					)}
				</div>

				<div className='mt-2 text-sm text-zinc-700 leading-relaxed'>
					{content}
				</div>
			</div>
		</div>
	);
};
