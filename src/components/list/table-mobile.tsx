import { ReactNode } from 'react';

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
				<div
					key={index}
					className='border border-zinc-200 rounded-lg p-4 bg-white'
				>
					{renderMobile(item)}
				</div>
			))}
		</div>
	);
};

export default MobileTable;
