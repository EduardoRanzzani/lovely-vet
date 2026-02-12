import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
	Control,
	Controller,
	FieldValues,
	Path,
	PathValue,
} from 'react-hook-form'; // Adicionado FieldValues e Path

interface SelectOption {
	key?: string;
	value: string | number;
	label: string;
}

// Transformamos a interface em Generic para aceitar os tipos do formulário
interface SelectFormProps<T extends FieldValues> {
	label: string;
	error?: string;
	options: SelectOption[];
	name: Path<T>; // Garante que o 'name' seja uma chave válida do formulário
	control: Control<T>; // Tipagem correta do Control
	required?: boolean;
	className?: string;
	placeholder?: string;
	multiple?: boolean;
	onSelect?: (value: string | number | (string | number)[]) => void;
}

// O componente agora também é Generic
const SelectForm = <T extends FieldValues>({
	label,
	error,
	options,
	name,
	control,
	required,
	className,
	placeholder = 'Selecione...',
	multiple = false,
	onSelect,
}: SelectFormProps<T>) => {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState('');
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<Controller
			name={name}
			control={control}
			// Importante: Default value como undefined ou array vazio para evitar erro de uncontrolled/controlled
			render={({ field }) => {
				const values: (string | number)[] = multiple
					? Array.isArray(field.value)
						? field.value
						: []
					: field.value !== undefined &&
						  field.value !== null &&
						  field.value !== ''
						? [field.value as string | number]
						: [];

				const selectedLabels = options
					.filter((o) => values.includes(o.value))
					.map((o) => o.label)
					.join(', ');

				const filteredOptions = options.filter((opt) =>
					opt.label.toLowerCase().includes(search.toLowerCase()),
				);

				const handleSelect = (value: string | number) => {
					// Definimos o tipo como a união exata dos possíveis retornos
					let newValue: PathValue<T, Path<T>>;

					if (multiple) {
						const currentValues = (
							Array.isArray(field.value) ? field.value : []
						) as (string | number)[];
						const updatedArray = currentValues.includes(value)
							? currentValues.filter((v) => v !== value)
							: [...currentValues, value];

						newValue = updatedArray as PathValue<T, Path<T>>;
					} else {
						newValue = value as PathValue<T, Path<T>>;
						setOpen(false);
					}

					field.onChange(newValue);
					onSelect?.(newValue as string | number | (string | number)[]);
				};

				const selectAll = () => {
					const allValues = options.map((o) => o.value);
					field.onChange(allValues);
					onSelect?.(allValues);
				};

				const deselectAll = () => {
					field.onChange([]);
					onSelect?.([]);
				};

				return (
					<div
						className={cn('flex flex-col relative', className)}
						ref={containerRef}
					>
						<label className='text-xs font-medium mb-1'>
							{label} {required && <span className='text-red-500'>*</span>}
						</label>

						<div
							className={cn(
								'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:opacity-50 md:text-sm',
								'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
								error ? 'border-destructive' : '',
								'flex items-center justify-between cursor-pointer',
							)}
							onClick={() => setOpen(!open)}
						>
							<span
								className={`truncate ${!selectedLabels ? 'text-zinc-400' : ''}`}
								title={selectedLabels}
							>
								{selectedLabels || placeholder}
							</span>
							{open ? (
								<ChevronUp className='w-4 h-4 text-zinc-400 dark:text-zinc-200' />
							) : (
								<ChevronDown className='w-4 h-4 text-zinc-400 dark:text-zinc-200' />
							)}
						</div>

						{open && (
							<div
								className='absolute left-0 right-0 border border-zinc-300 rounded-md bg-white dark:bg-zinc-800 dark:border-zinc-600 shadow-md z-50 max-h-60 w-full overflow-y-auto mt-1'
								style={{ top: '100%' }}
							>
								<div className='sticky top-0 z-10 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-600'>
									<div className='px-3 py-2'>
										<Input
											type='text'
											value={search}
											onChange={(e) => setSearch(e.target.value)}
											placeholder='Pesquisar...'
											className='h-8'
											onClick={(e) => e.stopPropagation()} // Impede fechar ao clicar no input
										/>
									</div>

									{multiple && (
										<div className='flex justify-between px-3 py-1 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-600'>
											<button
												type='button'
												onClick={(e) => {
													e.stopPropagation();
													selectAll();
												}}
												className='text-xs text-indigo-600 hover:underline'
											>
												Selecionar tudo
											</button>
											<button
												type='button'
												onClick={(e) => {
													e.stopPropagation();
													deselectAll();
												}}
												className='text-xs text-indigo-600 hover:underline'
											>
												Desmarcar tudo
											</button>
										</div>
									)}
								</div>

								{filteredOptions.map((opt) => (
									<div
										key={opt.key || opt.value}
										className='px-3 py-2 text-sm cursor-pointer hover:bg-indigo-100 dark:hover:bg-zinc-700 transition flex items-center gap-2'
										onClick={(e) => {
											e.stopPropagation();
											handleSelect(opt.value);
										}}
									>
										{multiple && (
											<input
												type='checkbox'
												checked={values.includes(opt.value)}
												readOnly
												className='w-4 h-4 text-indigo-600 border-gray-300 rounded'
											/>
										)}
										<span>{opt.label}</span>
									</div>
								))}

								{filteredOptions.length === 0 && (
									<div className='px-3 py-2 text-sm text-zinc-400'>
										Nenhum resultado
									</div>
								)}
							</div>
						)}

						{error && <p className='text-red-500 text-[10px] mt-1'>{error}</p>}
					</div>
				);
			}}
		/>
	);
};

export default SelectForm;
