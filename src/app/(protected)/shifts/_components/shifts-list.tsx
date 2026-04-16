'use client';

import { CustomCalendar } from '@/components/ui/custom-calendar';

const ShiftsListClient = () => {
	const events = [
		{
			id: '1',
			title: 'Plantão Noturno',
			start: '2026-04-16T19:00:00',
			end: '2026-04-17T07:00:00',
			// Usamos a cor primária do Shadcn via CSS ou passamos a cor aqui
			className: 'bg-primary text-primary-foreground border-primary',
		},
	];

	return <CustomCalendar></CustomCalendar>;
};

export default ShiftsListClient;
