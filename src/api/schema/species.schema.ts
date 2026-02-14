import { speciesTable } from '@/db/schema';
import z from 'zod';

export type Specie = typeof speciesTable.$inferSelect;

export const createSpecieSchema = z.object({
	id: z.uuid().optional(),
	name: z.string().nonempty({ message: 'O campo nome é obrigatório' }),
});

export type CreateSpecieSchema = z.infer<typeof createSpecieSchema>;
