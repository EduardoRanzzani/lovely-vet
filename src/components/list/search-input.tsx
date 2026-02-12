'use client';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { SearchIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { useEffect, useState } from 'react';

const SearchInput = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathName = usePathname();

	const [value, setValue] = useState<string>('');
	const debouncedValue = useDebounce(value);

	const currentQuery = searchParams.get('filter');

	useEffect(() => {
		if (currentQuery === debouncedValue) return;
		if (!currentQuery && !debouncedValue) return;

		const url = qs.stringifyUrl(
			{
				url: pathName,
				query: {
					filter: debouncedValue,
				},
			},
			{
				skipEmptyString: true,
				skipNull: true,
			},
		);
		router.push(url);
	}, [currentQuery, debouncedValue, pathName, router]);

	return (
		<div className='flex-1 w-full lg:max-w-100 relative '>
			<Input
				className='pl-9 peer'
				placeholder='Informe um texto para buscar...'
				value={value}
				onChange={({ target }) => setValue(target.value)}
			/>
			<SearchIcon
				className='absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground transition-all'
				size={16}
			/>
		</div>
	);
};

export default SearchInput;
