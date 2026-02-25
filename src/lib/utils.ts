import { clsx, type ClassValue } from 'clsx';
import { redirect } from 'next/navigation';
import { startTransition } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const handleNavigation = (params: URLSearchParams) => {
	startTransition(() => {
		redirect(`?${params.toString()}`);
	});
};
