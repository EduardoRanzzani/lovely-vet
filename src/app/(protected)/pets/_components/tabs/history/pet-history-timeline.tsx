'use client';

import { TimelineItem } from '@/api/schema/timeline.schema';
import NoHistoryTimeline from './no-history-timeline';
import { HistoryItem } from './pet-history';

interface PetTimelineClientProps {
	historyEvents: TimelineItem[];
	canDelete: boolean;
	onDelete: (item: TimelineItem) => void;
}

const PetTimelineClient = ({
	historyEvents,
	canDelete,
	onDelete,
}: PetTimelineClientProps) => {
	return (
		<div className='max-h-70 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted'>
			{historyEvents.length > 0 ? (
				historyEvents.map((event, idx) => (
					<HistoryItem
						key={idx}
						title={event.title}
						subtitle={event.doctor}
						date={event.date}
						icon={event.icon}
						colorClass={event.color}
						content={event.content}
						canDelete={canDelete}
						onDelete={() => onDelete(event)}
					/>
				))
			) : (
				<NoHistoryTimeline />
			)}
		</div>
	);
};

export default PetTimelineClient;
