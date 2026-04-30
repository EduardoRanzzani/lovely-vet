import { TimelineItem } from '@/api/schema/timeline.schema';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import PetTimelineClient from './history/pet-history-timeline';

interface TabTimelineProps {
	historyEvents: TimelineItem[];
	canDelete: boolean;
	onDelete: (item: TimelineItem) => void;
}

const TabTimeline = ({
	historyEvents,
	canDelete,
	onDelete,
}: TabTimelineProps) => {
	return (
		<TabsContent value='timeline'>
			<div className='flex items-center justify-between my-2 pb-4 border-b'>
				<h3 className='font-bold text-lg'>Linha do Tempo</h3>
				<Badge
					variant={'outline'}
					className='text-xs px-2 py-1 rounded-full border shadow-sm'
				>
					{historyEvents.length} registro
					{historyEvents.length !== 1 ? 's' : ''}
				</Badge>
			</div>

			<PetTimelineClient
				historyEvents={historyEvents}
				canDelete={canDelete}
				onDelete={onDelete}
			/>
		</TabsContent>
	);
};

export default TabTimeline;
