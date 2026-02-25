import { ReactNode } from 'react';
import { Card, CardDescription } from '../ui/card';

type MobileTableProps<T> = {
	data: T[];
	renderMobile: (item: T) => ReactNode;
	emptyMessage?: string;
};

const MobileTable = <T,>({
	data,
	renderMobile,
	emptyMessage = 'Nenhum registro encontrado...',
}: MobileTableProps<T>) => {
	if (!data || data.length === 0) {
		return (
			<Card className='border rounded-lg p-4 w-full'>
				<CardDescription className='text-center'>
					<span className='italic'>{emptyMessage}</span>
				</CardDescription>
			</Card>
		);
	}

	return (
		<div className='space-y-4 border px-2 pt-2 pb-4 rounded-md shadow-md w-full'>
			{data.map((item, index) => (
				<Card key={index} className='border rounded-lg p-4'>
					{renderMobile(item)}
				</Card>
			))}
		</div>
	);
};

export default MobileTable;
