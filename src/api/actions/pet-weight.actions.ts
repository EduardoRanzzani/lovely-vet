import { db } from '@/db';
import { petWeightsTable } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { desc, eq } from 'drizzle-orm';
import { PetWeight, PetWeightWithRelations } from '../schema/pet-weight.schema';

export const getPetWeights = async (): Promise<PetWeightWithRelations[]> => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	const weightHistory = await db.query.petWeightsTable.findMany({
		with: {
			pet: {
				with: {
					breed: {
						with: {
							specie: true,
						},
					},
					petTutors: {
						with: {
							tutor: {
								with: {
									user: true,
								},
							},
						},
					},
				},
			},
		},
	});

	return weightHistory as PetWeightWithRelations[];
};

export const getLastPetWeight = async (
	petId: string,
): Promise<PetWeight | null> => {
	const authenticatedUser = await currentUser();
	if (!authenticatedUser) throw new Error('Usuário não autenticado');

	const lastWeight = await db.query.petWeightsTable.findFirst({
		where: eq(petWeightsTable.petId, petId),
		orderBy: [desc(petWeightsTable.measuredAt)],
	});

	return lastWeight as PetWeight;
};
