import { servicesTable } from '@/db/schema';
import z from 'zod';

export type Services = typeof servicesTable.$inferSelect;

export const createServiceSchema = z.object({
	id: z.uuid().optional(),
	name: z.string().nonempty({ message: 'Nome é obrigatório' }),
	description: z.string().nonempty({ message: 'Descrição é obrigatória' }),
	price: z.number().min(1, { message: 'Preço é obrigatório' }),
});

export type CreateServiceSchema = z.infer<typeof createServiceSchema>;
