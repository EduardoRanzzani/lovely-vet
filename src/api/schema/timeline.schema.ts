import z from 'zod';

export interface TimelineItem {
	type:
		| 'record'
		| 'prescription'
		| 'weight'
		| 'appointment'
		| 'vaccine'
		| 'pathology'
		| 'attachment'
		| 'note';
	id?: string;
	date: Date;
	title: string;
	doctor?: string;
	content: string;
	icon: React.ReactNode;
	color: string;
}

export const timelineItemSchema = z.object({
	type: z.enum(
		[
			'record',
			'prescription',
			'weight',
			'appointment',
			'vaccine',
			'pathology',
			'attachment',
			'note',
		],
		{
			message: 'Tipo inválido',
		},
	),
	id: z.string({
		message: 'ID é obrigatório',
	}),
	date: z.coerce.date().optional(),
	title: z.string().optional(),
	doctor: z.string().optional(),
	content: z.string().optional(),
	icon: z.any().optional(),
	color: z.string().optional(),
	petId: z.string({ message: 'ID do pet é obrigatório' }),
});
