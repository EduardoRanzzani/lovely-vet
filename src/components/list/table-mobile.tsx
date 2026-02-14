import { ReactNode } from 'react';
import { Card } from '../ui/card';

type MobileTableProps<T> = {
	data: T[];
	renderMobile: (item: T) => ReactNode;
};

const MobileTable = <T,>({ data, renderMobile }: MobileTableProps<T>) => {
	if (!data || data.length === 0) {
		return (
			<div className='text-center text-zinc-500'>
				Nenhum registro encontrado...
			</div>
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
