'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
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
	value: string | number | boolean;
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
	maxVisible?: number;
	onSelect?: (
		value: string | number | boolean | (string | number | boolean)[],
	) => void;
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
	maxVisible = 2,
	onSelect,
}: SelectFormProps<T>) => {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState('');
	const containerRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLDivElement>(null);

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
				const values: (string | number | boolean)[] = multiple
					? Array.isArray(field.value)
						? field.value
						: []
					: field.value !== undefined &&
						  field.value !== null &&
						  field.value !== ''
						? [field.value as string | number | boolean]
						: [];

				const selectedOptions = options.filter((o) => values.includes(o.value));

				const filteredOptions = options.filter((opt) =>
					opt.label.toLowerCase().includes(search.toLowerCase()),
				);

				const handleSelect = (value: string | number | boolean) => {
					let newValue: PathValue<T, Path<T>>;

					if (multiple) {
						const currentValues = (
							Array.isArray(field.value) ? field.value : []
						) as (string | number | boolean)[];
						const updatedArray = currentValues.includes(value)
							? currentValues.filter((v) => v !== value)
							: [...currentValues, value];
						newValue = updatedArray as PathValue<T, Path<T>>;
					} else {
						newValue = value as PathValue<T, Path<T>>;
						setOpen(false);
						triggerRef.current?.focus();
					}

					field.onChange(newValue);
					onSelect?.(
						newValue as
							| string
							| number
							| boolean
							| (string | number | boolean)[],
					);
				};

				return (
					<div
						className={cn('flex flex-col relative w-full', className)}
						ref={containerRef}
					>
						<label className='mb-1 text-xs font-medium'>
							{label} {required && <span className='text-red-500'>*</span>}
						</label>

						<div
							ref={triggerRef}
							tabIndex={0}
							aria-expanded={open}
							onKeyDown={handleKeyDown}
							className={cn(
								'border-input h-10 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-all outline-none',
								'flex items-center justify-between cursor-pointer gap-2',
								'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
								error ? 'border-destructive' : 'focus-visible:border-ring',
							)}
							onClick={() => setOpen(!open)}
						>
							<div className='flex items-center flex-1 min-w-0 gap-1 overflow-hidden'>
								{selectedOptions.length > 0 ? (
									multiple ? (
										/* RENDERIZAÇÃO MULTIPLE: BADGES */
										<>
											<div className='flex items-center gap-1 overflow-hidden flex-nowrap'>
												{selectedOptions.slice(0, maxVisible).map((opt) => (
													<span
														key={opt.key || opt.value.toString()}
														className='bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-2 py-0.5 rounded-sm text-[11px] font-medium flex items-center shrink-0 border border-zinc-200 dark:border-zinc-700 whitespace-nowrap max-w-30'
													>
														<span className='truncate'>{opt.label}</span>
														<X
															className='w-3 h-3 ml-1 cursor-pointer hover:text-destructive'
															onClick={(e) => {
																e.stopPropagation();
																handleSelect(opt.value);
															}}
														/>
													</span>
												))}
											</div>
											{selectedOptions.length > maxVisible && (
												<span className='text-[10px] font-bold text-muted-foreground bg-zinc-50 dark:bg-zinc-900 px-1.5 py-0.5 rounded border shrink-0'>
													+{selectedOptions.length - maxVisible}
												</span>
											)}
										</>
									) : (
										/* RENDERIZAÇÃO SINGLE: TEXTO PURO */
										<span className='truncate text-zinc-900 dark:text-zinc-100'>
											{selectedOptions[0].label}
										</span>
									)
								) : (
									<span className='truncate text-zinc-400'>{placeholder}</span>
								)}
							</div>

							<div className='flex items-center opacity-50 shrink-0'>
								{open ? (
									<ChevronUp className='w-4 h-4' />
								) : (
									<ChevronDown className='w-4 h-4' />
								)}
							</div>
						</div>

						{/* LISTBOX / DROPDOWN */}
						{open && (
							<div
								className='absolute left-0 right-0 z-50 flex flex-col w-full mt-1 overflow-hidden bg-white border rounded-md shadow-lg border-zinc-300 dark:bg-zinc-950 dark:border-zinc-800 max-h-60'
								style={{ top: '100%' }}
							>
								<div className='p-2 border-b border-zinc-100 dark:border-zinc-800'>
									<Input
										autoFocus
										type='text'
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										placeholder='Pesquisar...'
										className='h-8 focus-visible:ring-1'
										onKeyDown={(e) => {
											if (e.key === 'Escape') setOpen(false);
											e.stopPropagation();
										}}
									/>
								</div>

								<div className='flex-1 overflow-y-auto'>
									{filteredOptions.map((opt) => {
										const isSelected = values.includes(opt.value);
										return (
											<div
												key={opt.key || opt.value.toString()}
												tabIndex={0}
												className={cn(
													'px-3 py-2 text-sm cursor-pointer transition flex items-center gap-2 outline-none',
													'hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:bg-zinc-100 dark:focus:bg-zinc-800',
													isSelected &&
														'bg-zinc-50 dark:bg-zinc-900 font-medium',
												)}
												onClick={(e) => {
													e.stopPropagation();
													handleSelect(opt.value);
												}}
											>
												{multiple && (
													<input
														type='checkbox'
														checked={isSelected}
														readOnly
														className='w-4 h-4 rounded border-zinc-300 accent-primary'
													/>
												)}
												<span className='truncate'>{opt.label}</span>
											</div>
										);
									})}
									{filteredOptions.length === 0 && (
										<div className='px-3 py-4 text-sm text-center text-zinc-400'>
											Nenhum resultado encontrado
										</div>
									)}
								</div>
							</div>
						)}
						{error && <p className='mt-1 text-xs text-destructive'>{error}</p>}
					</div>
				);
			}}
		/>
	);
};

export default SelectForm;
