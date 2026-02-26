import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from 'lucide-react';

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
				<button
					onClick={() => onPageChange(1)}
					disabled={currentPage === 1}
					className='p-2 rounded-md bg-gray-100 disabled:opacity-50 hover:bg-gray-200'
				>
					<ChevronsLeft size={16} />
				</button>

				{/* Anterior */}
				<button
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className='p-2 rounded-md bg-gray-100 disabled:opacity-50 hover:bg-gray-200'
				>
					<ChevronLeft size={16} />
				</button>

				{/* Páginas */}
				{generatePages().map((page, idx) =>
					page === '...' ? (
						<span key={idx} className='px-3 py-1 text-gray-400 select-none'>
							...
						</span>
					) : (
						<button
							key={idx}
							onClick={() => onPageChange(Number(page))}
							className={`px-3 py-1 rounded-md ${
								page === currentPage
									? 'bg-primary font-bold'
									: 'bg-zinc-100 hover:bg-gray-200'
							}`}
						>
							{page}
						</button>
					),
				)}

				{/* Próxima */}
				<button
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className='p-2 rounded-md bg-gray-100 disabled:opacity-50 hover:bg-gray-200'
				>
					<ChevronRight size={16} />
				</button>

				{/* Última */}
				<button
					onClick={() => onPageChange(totalPages)}
					disabled={currentPage === totalPages}
					className='p-2 rounded-md bg-gray-100 disabled:opacity-50 hover:bg-gray-200'
				>
					<ChevronsRight size={16} />
				</button>
			</div>
		</div>
	);
};

export default Pagination;
