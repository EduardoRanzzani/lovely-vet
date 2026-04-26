import {
	breedsTable,
	customersTable,
	petsTable,
	petWeightsTable,
	speciesTable,
	usersTable,
} from '@/db/schema';

export type PetWeight = typeof petWeightsTable.$inferSelect;

export type PetWeightWithRelations = typeof petWeightsTable.$inferSelect & {
	pet: typeof petsTable.$inferSelect & {
		breed: typeof breedsTable.$inferSelect & {
			specie: typeof speciesTable.$inferSelect;
		};
		tutor: typeof customersTable.$inferSelect & {
			user: typeof usersTable.$inferSelect;
		};
	};
};
