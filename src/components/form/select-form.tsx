// 'use client';

// import { Check, ChevronsUpDown, X } from 'lucide-react';
// import * as React from 'react';
// import {
// 	Control,
// 	Controller,
// 	FieldValues,
// 	Path,
// 	PathValue,
// } from 'react-hook-form';

// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import {
// 	Command,
// 	CommandEmpty,
// 	CommandGroup,
// 	CommandInput,
// 	CommandItem,
// 	CommandList,
// } from '@/components/ui/command';
// import {
// 	Popover,
// 	PopoverContent,
// 	PopoverTrigger,
// } from '@/components/ui/popover';
// import { cn } from '@/lib/utils';

// // Tipo para as opções do select
// export interface SelectOption {
// 	value: string | number;
// 	label: string;
// 	group?: string;
// }

// interface SelectFormProps<T extends FieldValues> {
// 	label: string;
// 	options: SelectOption[];
// 	name: Path<T>;
// 	control: Control<T>;
// 	error?: string;
// 	required?: boolean;
// 	placeholder?: string;
// 	className?: string;
// 	multiple?: boolean;
// }

// const SelectForm = <T extends FieldValues>({
// 	label,
// 	options,
// 	name,
// 	control,
// 	error,
// 	required,
// 	placeholder = 'Selecione...',
// 	className,
// 	multiple = false,
// }: SelectFormProps<T>) => {
// 	const [open, setOpen] = React.useState(false);

// 	// Tipo auxiliar para garantir que o TS não infira 'never'
// 	type ValidValue = string | number;

// 	// Agrupamento de opções memorizado
// 	const groups = React.useMemo(() => {
// 		return options.reduce(
// 			(acc, option) => {
// 				const groupName = option.group || 'Geral';
// 				if (!acc[groupName]) acc[groupName] = [];
// 				acc[groupName].push(option);
// 				return acc;
// 			},
// 			{} as Record<string, SelectOption[]>,
// 		);
// 	}, [options]);

// 	return (
// 		<Controller
// 			name={name}
// 			control={control}
// 			render={({ field }) => {
// 				// Normalização segura: convertemos o valor do field para um array tipado
// 				const currentValues: ValidValue[] = Array.isArray(field.value)
// 					? (field.value as ValidValue[])
// 					: field.value !== undefined &&
// 						  field.value !== null &&
// 						  field.value !== ''
// 						? [field.value as ValidValue]
// 						: [];

// 				const handleSelect = (val: ValidValue) => {
// 					if (multiple) {
// 						const isSelected = currentValues.includes(val);
// 						const newValue = isSelected
// 							? currentValues.filter((v) => v !== val)
// 							: [...currentValues, val];

// 						field.onChange(newValue as PathValue<T, Path<T>>);
// 					} else {
// 						field.onChange(val as PathValue<T, Path<T>>);
// 						setOpen(false);
// 					}
// 				};

// 				const handleRemove = (val: ValidValue) => {
// 					if (multiple) {
// 						const newValue = currentValues.filter((v) => v !== val);
// 						field.onChange(newValue as PathValue<T, Path<T>>);
// 					} else {
// 						field.onChange('' as PathValue<T, Path<T>>);
// 					}
// 				};

// 				return (
// 					<div className={cn('flex flex-col gap-1.5', className)}>
// 						<label className='text-xs font-medium'>
// 							{label} {required && <span className='text-red-500'>*</span>}
// 						</label>

// 						<Popover open={open} onOpenChange={setOpen}>
// 							<PopoverTrigger asChild>
// 								<Button
// 									variant='outline'
// 									role='combobox'
// 									aria-expanded={open}
// 									className={cn(
// 										'w-full justify-between font-normal min-h-9 h-auto py-1.5 px-3 text-left',
// 										currentValues.length === 0 && 'text-muted-foreground',
// 										error && 'border-destructive',
// 									)}
// 								>
// 									<div className='flex flex-wrap gap-1 items-center overflow-hidden'>
// 										{currentValues.length > 0 ? (
// 											multiple ? (
// 												currentValues.map((val) => {
// 													const option = options.find((o) => o.value === val);
// 													return (
// 														<Badge
// 															key={val}
// 															variant='secondary'
// 															className='font-normal flex items-center gap-1 pr-1'
// 														>
// 															<span className='truncate max-w-[150px]'>
// 																{option?.label ?? val}
// 															</span>
// 															<X
// 																className='h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground shrink-0'
// 																onClick={(e) => {
// 																	e.stopPropagation();
// 																	handleRemove(val);
// 																}}
// 															/>
// 														</Badge>
// 													);
// 												})
// 											) : (
// 												(options.find((opt) => opt.value === field.value)
// 													?.label ?? field.value)
// 											)
// 										) : (
// 											<span>{placeholder}</span>
// 										)}
// 									</div>
// 									<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
// 								</Button>
// 							</PopoverTrigger>
// 							<PopoverContent
// 								className='w-[--radix-popover-trigger-width] p-0'
// 								align='start'
// 							>
// 								<Command>
// 									<CommandInput
// 										placeholder={`Buscar ${label.toLowerCase()}...`}
// 									/>
// 									<CommandList className='max-h-64 overflow-y-auto'>
// 										<CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
// 										{Object.entries(groups).map(([groupName, items]) => (
// 											<CommandGroup key={groupName} heading={groupName}>
// 												{items.map((option) => (
// 													<CommandItem
// 														key={option.value}
// 														value={option.label}
// 														onSelect={() => handleSelect(option.value)}
// 													>
// 														<div
// 															className={cn(
// 																'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
// 																currentValues.includes(option.value)
// 																	? 'bg-primary text-primary-foreground'
// 																	: 'opacity-50 [&_svg]:invisible',
// 															)}
// 														>
// 															<Check className='h-4 w-4' />
// 														</div>
// 														<span>{option.label}</span>
// 													</CommandItem>
// 												))}
// 											</CommandGroup>
// 										))}
// 									</CommandList>
// 								</Command>
// 							</PopoverContent>
// 						</Popover>

// 						{error && (
// 							<p className='text-xs text-destructive mt-0.5'>{error}</p>
// 						)}
// 					</div>
// 				);
// 			}}
// 		/>
// 	);
// };

// export default SelectForm;
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
						className={cn('flex flex-col relative w-full', className)}
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
