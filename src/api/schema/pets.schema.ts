import {
	breedsTable,
	customersTable,
	petsTable,
	speciesTable,
	usersTable,
} from '@/db/schema';
import z from 'zod';

export type PetsWithTutorAndBreed = typeof petsTable.$inferSelect & {
	breed: typeof breedsTable.$inferSelect & {
		specie: typeof speciesTable.$inferSelect;
	};
	tutor: typeof customersTable.$inferSelect & {
		user: typeof usersTable.$inferSelect;
	};
};

export const createPetWithTutorAndBreedSchema = z.object({
	id: z.uuid().optional(),
	name: z.string().nonempty({ message: 'Nome é obrigatório' }),
	birthDate: z
		.string()
		.nonempty({ message: 'Data de nascimento é obrigatória' }),
	tutorId: z.uuid({ message: 'Tutor é obrigatório' }).nonempty({
		message: 'Tutor é obrigatório',
	}),
	specieId: z
		.uuid({ message: 'Espécie é obrigatório' })
		.nonempty({ message: 'Espécie é obrigatório' }),
	breedId: z
		.uuid({ message: 'Raça é obrigatório' })
		.nonempty({ message: 'Raça é obrigatório' }),
	sterile: z.string().nonempty({ message: 'Informe se o pet é cadastrado' }),
	photo: z.string().optional(),
	color: z.string().nonempty({ message: 'Pelagem é obrigatória' }),
	gender: z
		.enum(['male', 'female'])
		.nonoptional({ message: 'Gênero é obrigatório' }),
	weight: z.string().nonempty({ message: 'Peso é obrigatório' }),
	observations: z.string().optional(),
});

export type CreatePetWithTutorAndBreedSchema = z.infer<
	typeof createPetWithTutorAndBreedSchema
>;
