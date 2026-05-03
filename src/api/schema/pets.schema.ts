import {
	appointmentItemsTable,
	appointmentsTable,
	breedsTable,
	customersTable,
	doctorsTable,
	medicalRecordsTable,
	pathologiesTable,
	petAttachmentsTable,
	petNotesTable,
	petsTable,
	prescriptionsTable,
	servicesTable,
	speciesTable,
	usersTable,
	vaccinesTable,
} from '@/db/schema';
import z from 'zod';

export type PetTutorLink = {
	tutor: typeof customersTable.$inferSelect & {
		user: typeof usersTable.$inferSelect;
	};
};

export type PetsWithRelations = typeof petsTable.$inferSelect & {
	breed: typeof breedsTable.$inferSelect & {
		specie: typeof speciesTable.$inferSelect;
	};
	petTutors: PetTutorLink[];
	medicalRecords?: (typeof medicalRecordsTable.$inferSelect & {
		doctor: typeof doctorsTable.$inferSelect & {
			user: typeof usersTable.$inferSelect;
		};
	})[];
	appointments?: (typeof appointmentsTable.$inferSelect & {
		doctor: typeof doctorsTable.$inferSelect & {
			user: typeof usersTable.$inferSelect;
		};
		items: (typeof appointmentItemsTable.$inferSelect & {
			service: typeof servicesTable.$inferSelect;
		})[];
	})[];
	weightHistory?: {
		id?: string; // Opcional para suportar a listagem
		petId?: string; // Opcional
		weightInGrams: number;
		measuredAt: Date;
		createdAt?: Date; // Opcional
	}[];
	vaccines?: (typeof vaccinesTable.$inferSelect & {
		doctor:
			| (typeof doctorsTable.$inferSelect & {
					user: typeof usersTable.$inferSelect;
			  })
			| null;
	})[];
	pathologies?: (typeof pathologiesTable.$inferSelect)[];
	attachments?: (typeof petAttachmentsTable.$inferSelect)[];
	// CORREÇÃO: No schema, a relação se chama 'author'
	notes?: (typeof petNotesTable.$inferSelect & {
		author: typeof usersTable.$inferSelect;
	})[];
	prescriptions?: (typeof prescriptionsTable.$inferSelect & {
		doctor: typeof doctorsTable.$inferSelect & {
			user: typeof usersTable.$inferSelect;
		};
	})[];
	weightInGrams?: number;
};

/** Nomes dos tutores para exibição (pet carregado com `petTutors.tutor.user`). */
export function formatPetTutorNames(
	pet: Pick<PetsWithRelations, 'petTutors'>,
): string {
	return (
		pet.petTutors
			?.map((pt) => pt.tutor.user.name)
			.filter(Boolean)
			.join(', ') ?? ''
	);
}

export const createPetWithTutorAndBreedSchema = z.object({
	id: z.uuid().optional().nullable(), // uuid() do zod costuma ser .string().uuid()
	name: z.string().min(1, { message: 'Nome é obrigatório' }),
	birthDate: z.date({ message: 'Data de nascimento é obrigatória' }),
	breedId: z.uuid({ message: 'Raça inválida' }),
	specieId: z.uuid({ message: 'Espécie inválida' }),
	customerIds: z
		.array(z.uuid({ message: 'Tutor inválido' }))
		.min(1, { message: 'Selecione pelo menos um tutor' }),
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
