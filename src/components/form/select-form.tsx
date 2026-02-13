'use client';

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
} from 'react-hook-form';

interface SelectOption {
	key?: string;
	value: string | number;
	label: string;
}

interface SelectFormProps<T extends FieldValues> {
	label: string;
	error?: string;
	options: SelectOption[];
	name: Path<T>;
	control: Control<T>;
	required?: boolean;
	className?: string;
	placeholder?: string;
	multiple?: boolean;
	onSelect?: (value: string | number | (string | number)[]) => void;
}

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
	const triggerRef = useRef<HTMLDivElement>(null);

	// Fecha ao clicar fora
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

	// Atalhos de teclado para o container principal
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			setOpen((prev) => !prev);
		}
		if (e.key === 'Escape') {
			setOpen(false);
			triggerRef.current?.focus();
		}
	};

	return (
		<Controller
			name={name}
			control={control}
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
						triggerRef.current?.focus(); // Devolve o foco ao fechar
					}

					field.onChange(newValue);
					onSelect?.(newValue as string | number | (string | number)[]);
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
							ref={triggerRef}
							tabIndex={0}
							role='combobox'
							aria-expanded={open}
							aria-haspopup='listbox'
							onKeyDown={handleKeyDown}
							className={cn(
								'file:text-foreground placeholder:text-muted-foreground border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-all outline-none md:text-sm',
								'flex items-center justify-between cursor-pointer',
								'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
								error ? 'border-destructive' : 'focus-visible:border-ring',
							)}
							onClick={() => setOpen(!open)}
						>
							<span
								className={cn('truncate', !selectedLabels && 'text-zinc-400')}
								title={selectedLabels}
							>
								{selectedLabels || placeholder}
							</span>
							{open ? (
								<ChevronUp className='w-4 h-4' />
							) : (
								<ChevronDown className='w-4 h-4' />
							)}
						</div>

						{open && (
							<div
								className='absolute left-0 right-0 border border-zinc-300 rounded-md bg-white dark:bg-zinc-950 dark:border-zinc-800 shadow-lg z-50 max-h-60 w-full overflow-hidden mt-1 flex flex-col'
								style={{ top: '100%' }}
							>
								<div className='p-2 border-b border-zinc-100 dark:border-zinc-800'>
									<Input
										autoFocus
										type='text'
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										placeholder='Pesquisar...'
										className='h-8'
										onKeyDown={(e) => {
											if (e.key === 'Escape') setOpen(false);
											e.stopPropagation();
										}}
									/>
								</div>

								<div className='overflow-y-auto flex-1'>
									{filteredOptions.map((opt) => (
										<div
											key={opt.key || opt.value}
											tabIndex={0}
											role='option'
											aria-selected={values.includes(opt.value)}
											className={cn(
												'px-3 py-2 text-sm cursor-pointer transition flex items-center gap-2 outline-none',
												'hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:bg-zinc-100 dark:focus:bg-zinc-800',
												values.includes(opt.value) &&
													'bg-zinc-50 dark:bg-zinc-900 font-medium',
											)}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													handleSelect(opt.value);
												}
											}}
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
													className='w-4 h-4 rounded border-zinc-300 accent-primary'
												/>
											)}
											<span>{opt.label}</span>
										</div>
									))}

									{filteredOptions.length === 0 && (
										<div className='px-3 py-4 text-center text-sm text-zinc-400'>
											Nenhum resultado encontrado
										</div>
									)}
								</div>
							</div>
						)}

						{error && <p className='text-xs text-destructive mt-1'>{error}</p>}
					</div>
				);
			}}
		/>
	);
};

export default SelectForm;
