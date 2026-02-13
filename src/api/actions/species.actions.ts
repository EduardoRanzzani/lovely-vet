'use server';

import { db } from '@/db';
import { speciesTable } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { Species } from '../schema/species.schema';

export const getSpecies = async (): Promise<Species[]> => {
	const species = await db.query.speciesTable.findMany({
		orderBy: asc(speciesTable.name),
	});
	return species;
};
