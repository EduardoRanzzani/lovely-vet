import { breedsTable, speciesTable } from '@/db/schema';
import z from 'zod';

export type BreedsWithSpecies = typeof breedsTable.$inferSelect & {
	specie: typeof speciesTable.$inferSelect;
};

export const createBreedSchema = z.object({
	id: z.uuid().optional(),
	name: z.string().nonempty({ message: 'O campo nome é obrigatório' }),
	specieId: z
		.uuid({ message: 'O campo espécie é obrigatório' })
		.nonempty({ message: 'O campo espécie é obrigatório' }),
});

export type CreateBreedSchema = z.infer<typeof createBreedSchema>;
