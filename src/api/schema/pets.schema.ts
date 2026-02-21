import {
	breedsTable,
	customersTable,
	petsTable,
	speciesTable,
	usersTable,
} from '@/db/schema';
import z from 'zod';

export type PetWithTutorAndBreed = typeof petsTable.$inferSelect & {
	breed: typeof breedsTable.$inferSelect & {
		specie: typeof speciesTable.$inferSelect;
	};
	tutor: typeof customersTable.$inferSelect & {
		user: typeof usersTable.$inferSelect;
	};
};

export const createPetWithTutorAndBreedSchema = z.object({
	id: z.uuid().optional().nullable(), // uuid() do zod costuma ser .string().uuid()
	name: z.string().min(1, { message: 'Nome é obrigatório' }),
	birthDate: z.date({ message: 'Data de nascimento é obrigatória' }),
	breedId: z.uuid({ message: 'Raça inválida' }),
	specieId: z.uuid({ message: 'Espécie inválida' }),
	customerId: z.uuid({ message: 'Tutor inválido' }),
	color: z.string().min(1, { message: 'Pelagem é obrigatória' }),
	gender: z.enum(['male', 'female'], { message: 'Selecione uma das opções' }), // Removido .default()
	sterile: z.boolean({ message: 'Selecione uma das opções' }), // Removido .default()
	status: z.enum(['alive', 'dead', 'missing']), // Removido .default()
	weightInGrams: z.number(),
	photo: z.string().optional().nullable(),
});

export type CreatePetWithTutorAndBreedSchema = z.infer<
	typeof createPetWithTutorAndBreedSchema
>;
