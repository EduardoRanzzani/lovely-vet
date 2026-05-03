import { TimelineItem } from '@/api/schema/timeline.schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import {
	FileIcon,
	FlaskConicalIcon,
	ScaleIcon,
	SquarePenIcon,
	StethoscopeIcon,
	SyringeIcon,
} from 'lucide-react';
import DialogNotes from '../dialogs/dialog-notes';
import DialogServices from '../dialogs/dialog-services';
import PetTimelineClient from './history/pet-history-timeline';

interface TabHistoryProps {
	historyEvents: TimelineItem[];
	petId: string;
	canDelete: boolean;
	onDelete: (item: TimelineItem) => void;
}

const TabHistory = ({
	historyEvents,
	petId,
	canDelete,
	onDelete,
}: TabHistoryProps) => {
	return (
		<TabsContent value='history' className='w-full'>
			<div className='flex flex-col lg:flex-row gap-4'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-2 lg:w-3/5 bg-card lg:max-h-30'>
					<DialogServices petId={petId} />

					<Button className='bg-weight hover:bg-weight/80'>
						<ScaleIcon />
						Peso
					</Button>

					<Button className='bg-pathology hover:bg-pathology/80'>
						<StethoscopeIcon />
						Patologia
					</Button>

					<Button className='bg-document hover:bg-document/80'>
						<FileIcon />
						Documento
					</Button>

					<Button className='bg-exam hover:bg-exam/80'>
						<FlaskConicalIcon /> Exame
					</Button>

					<Button className='bg-vaccine hover:bg-vaccine/80'>
						<SyringeIcon />
						Vacina
					</Button>

					<Button className='bg-prescription hover:bg-prescription/80'>
						<SquarePenIcon />
						Receita
					</Button>

					<DialogNotes petId={petId} />
				</div>

				<div className='flex-1 w-full border p-6 rounded-xl bg-muted/20 max-h-100'>
					<div className='flex items-center justify-between mb-2 pb-4 border-b'>
						<h3 className='font-bold text-lg'>Histórico Clínico</h3>
						<Badge
							variant={'outline'}
							className='text-xs px-2 py-1 rounded-full border shadow-sm'
						>
							{historyEvents.length} registro
							{historyEvents.length !== 1 ? 's' : ''}
						</Badge>
					</div>

					<div className='pr-2 pb-20'>
						<PetTimelineClient
							historyEvents={historyEvents}
							canDelete={canDelete}
							onDelete={onDelete}
						/>
					</div>
				</div>
			</div>
		</TabsContent>
	);
};

export default TabHistory;
