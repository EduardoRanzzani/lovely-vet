import { ReactNode } from 'react';
import Pagination from './table-pagination';
import ResponsiveTable from './table-responsive';

type TableComponentProps<T> = {
	columns: {
		header: string | ReactNode;
		accessorKey: string;
		className?: string;
	}[];
	renderRow: (item: T) => ReactNode;
	renderMobile: (item: T) => ReactNode;
	data: T[];
	emptyMessage?: string;
	showPagination?: boolean;
	currentPage?: number;
	totalPages?: number;
	totalElements?: number;
	pageSize?: number;
	onPageChange?: (page: number) => void;
};

const TableComponent = <T,>({
	columns,
	renderRow,
	renderMobile,
	data,
	emptyMessage = 'Nenhum registro encontrado',
	showPagination = true,
	currentPage = 0,
	totalPages = 0,
	totalElements = 0,
	pageSize = 0,
	onPageChange = () => {},
}: TableComponentProps<T>) => {
	return (
		<div className='w-full'>
			<ResponsiveTable
				columns={columns}
				renderRow={renderRow}
				renderMobile={renderMobile}
				emptyMessage={emptyMessage}
				data={data}
			/>
			{showPagination && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					totalElements={totalElements}
					pageSize={pageSize}
					onPageChange={onPageChange}
				/>
			)}
		</div>
	);
};

export default TableComponent;
