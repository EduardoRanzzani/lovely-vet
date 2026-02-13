import { breedsTable, speciesTable } from '@/db/schema';

export type BreedsWithSpecies = typeof breedsTable.$inferSelect & {
	specie: typeof speciesTable.$inferSelect;
};
