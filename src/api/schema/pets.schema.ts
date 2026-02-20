import {
	breedsTable,
	customersTable,
	petsTable,
	speciesTable,
	usersTable,
} from '@/db/schema';
import z from 'zod';

// Tipo para leitura (Select)
export type PetsWithTutorAndBreed = typeof petsTable.$inferSelect & {
	breed: typeof breedsTable.$inferSelect & {
		specie: typeof speciesTable.$inferSelect;
	};
	tutor: typeof customersTable.$inferSelect & {
		user: typeof usersTable.$inferSelect;
	};
};

// Schema mestre com transformação
export const createPetWithTutorAndBreedSchema = z.object({
	id: z.uuid().optional(),
	name: z.string().min(1, 'Nome é obrigatório'),
	birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
	tutorId: z.string().uuid('Tutor inválido'),
	specieId: z.string().uuid('Espécie inválida'),
	breedId: z.string().uuid('Raça inválida'),
	sterile: z.string().min(1, 'Informe se o pet é castrado'),
	photo: z.string().optional().nullable(),
	color: z.string().min(1, 'Pelagem é obrigatória'),
	gender: z.enum(['male', 'female']).default('female'),
	// O formulário lida com STRING, o banco recebe NUMBER (gramas)
	weight: z
		.string()
		.min(1, 'Peso é obrigatório')
		.transform((val) => {
			const parsed = parseFloat(val.replace(',', '.'));
			return isNaN(parsed) ? 0 : Math.round(parsed * 1000);
		}),
	observations: z.string().optional().nullable(),
});

// Tipo do dado de SAÍDA (o que vai para o Server Action)
export type CreatePetWithTutorAndBreedSchema = z.output<
	typeof createPetWithTutorAndBreedSchema
>;

// Tipo do dado de ENTRADA (o que o React Hook Form usa internamente)
export type CreatePetWithTutorAndBreedInput = z.input<
	typeof createPetWithTutorAndBreedSchema
>;
