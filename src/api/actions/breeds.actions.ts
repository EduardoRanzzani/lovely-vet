'use server';

import { db } from '@/db';
import { BreedsWithSpecies } from '../schema/breeds.schema';
import { asc } from 'drizzle-orm';
import { breedsTable } from '@/db/schema';

export const getBreeds = async (): Promise<BreedsWithSpecies[]> => {
	const breeds = await db.query.breedsTable.findMany({
		with: {
			specie: true,
		},
		orderBy: asc(breedsTable.name),
	});

	return breeds;
};
