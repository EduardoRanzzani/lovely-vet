import {
	ChevronFirstIcon,
	ChevronLast,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react';
import { Button } from '../ui/button';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalElements: number;
	pageSize: number;
	onPageChange: (page: number) => void;
}

const Pagination = ({
	currentPage,
	totalPages,
	totalElements,
	pageSize,
	onPageChange,
}: PaginationProps) => {
	const start = (currentPage - 1) * pageSize + 1;
	const end = Math.min(currentPage * pageSize, totalElements);

	// Mostra blocos de até 5 páginas ao redor da atual
	const generatePages = () => {
		const pages: (number | string)[] = [];
		const visibleRange = 5; // quantas páginas contínuas mostrar
		let startPage = Math.max(1, currentPage - Math.floor(visibleRange / 2));
		let endPage = startPage + visibleRange - 1;

		if (endPage > totalPages) {
			endPage = totalPages;
			startPage = Math.max(1, endPage - visibleRange + 1);
		}

		// Sempre mostrar 1
		if (startPage > 1) {
			pages.push(1);
			if (startPage > 2) {
				pages.push('...');
			}
		}

		// Range principal
		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		// Sempre mostrar último
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				pages.push('...');
			}
			pages.push(totalPages);
		}

		return pages;
	};

	return (
		<div className='flex flex-col items-center justify-between gap-2 text-gray-700 mt-5'>
			{/* Texto com faixa exibida */}
			<span className='text-sm'>
				Exibindo {totalElements > 0 ? start : 0} a {end} do total de{' '}
				{totalElements} - Página {currentPage} de {totalPages}
			</span>

			{/* Botões */}
			<div className='flex items-center space-x-1'>
				{/* Primeira */}
				<Button
					variant={'outline'}
					disabled={currentPage === 1}
					onClick={() => onPageChange(1)}
					className='p-2 rounded-md bg-gray-100 disabled:opacity-50 hover:bg-gray-200'
				>
					<ChevronFirstIcon size={16} />
				</Button>

				{/* Anterior */}
				<Button
					variant={'outline'}
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className='p-2 rounded-md bg-gray-100 disabled:opacity-50 hover:bg-gray-200'
				>
					<ChevronLeft size={16} />
				</Button>

				{/* Páginas */}
				{generatePages().map((page, idx) =>
					page === '...' ? (
						<span key={idx} className='p-2 text-gray-400 select-none'>
							...
						</span>
					) : (
						<Button
							key={idx}
							variant={'outline'}
							onClick={() => onPageChange(Number(page))}
							className={`px-3 py-2 rounded-md ${
								page === currentPage
									? 'bg-primary font-bold'
									: 'bg-zinc-100 hover:bg-gray-200'
							}`}
						>
							{page}
						</Button>
					),
				)}

				{/* Próxima */}
				<Button
					variant={'outline'}
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className='p-2 rounded-md bg-gray-100 disabled:opacity-50 hover:bg-gray-200'
				>
					<ChevronRight size={16} />
				</Button>

				{/* Última */}
				<Button
					variant={'outline'}
					onClick={() => onPageChange(totalPages)}
					disabled={currentPage === totalPages}
					className='p-2 rounded-md bg-gray-100 disabled:opacity-50 hover:bg-gray-200'
				>
					<ChevronLast size={16} />
				</Button>
			</div>
		</div>
	);
};

export default Pagination;
