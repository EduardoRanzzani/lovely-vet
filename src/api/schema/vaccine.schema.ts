import {
	breedsTable,
	customersTable,
	petsTable,
	speciesTable,
	usersTable,
	vaccinesTable,
} from '@/db/schema';
import z from 'zod';

export type VaccinesWithRelations = typeof vaccinesTable.$inferSelect & {
	pet: typeof petsTable.$inferSelect & {
		breed: typeof breedsTable.$inferSelect & {
			specie: typeof speciesTable.$inferSelect;
		};
		petTutors: {
			tutor: typeof customersTable.$inferSelect & {
				user: typeof usersTable.$inferSelect;
			};
		}[];
		doctor: typeof usersTable.$inferSelect & {
			user: typeof usersTable.$inferSelect;
		};
	};
};

export const createVaccineSchema = z.object({
	id: z.uuid().optional().nullable(),
	petId: z.uuid({ message: 'Favor informar o pet' }),
	name: z.string({ message: 'Favor informar o nome da vacina' }),
	applicationDate: z.date({ message: 'Favor informar a data da aplicação' }),
	nextDoseDate: z
		.date({ message: 'Favor informar a data da próxima dose' })
		.optional(),
	lotNumber: z
		.string({ message: 'Favor informar o número do lote' })
		.optional(),
	manufacturer: z.string({ message: 'Favor informar o fabricante' }).optional(),
	doctorId: z.uuid({ message: 'Favor informar o veterinário' }),
});

export type CreateVaccineSchema = z.infer<typeof createVaccineSchema>;
