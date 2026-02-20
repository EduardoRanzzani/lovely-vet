import {
	appointmentsTable,
	doctorsTable,
	petsTable,
	servicesTable,
	usersTable,
} from '@/db/schema';
import z from 'zod';

export type AppointmentsWithPetAndServiceAndDoctor =
	typeof appointmentsTable.$inferSelect & {
		pet: typeof petsTable.$inferSelect;
		service: typeof servicesTable.$inferSelect;
		doctor: typeof doctorsTable.$inferSelect & {
			user: typeof usersTable.$inferSelect;
		};
	};

export const createAppointmentSchema = z.object({
	id: z.uuid().optional(),
	petId: z
		.uuid({ message: 'O pet é obrigatório' })
		.nonempty({ message: 'O pet é obrigatório' }),
	serviceId: z
		.uuid({ message: 'O serviço é obrigatório' })
		.nonempty({ message: 'O serviço é obrigatório' }),
	veterinarianId: z
		.uuid({ message: 'O veterinário é obrigatório' })
		.nonempty({ message: 'O veterinário é obrigatório' }),
	scheduledAt: z
		.date({ message: 'A data é obrigatória' })
		.nonoptional({ message: 'A data é obrigatória' }),
	status: z
		.enum([
			'pending',
			'confirmed',
			'in_progress',
			'completed',
			'cancelled',
			'no_show',
		])
		.default('pending')
		.nonoptional({ message: 'O status é obrigatório' }),
	totalPriceInCents: z
		.number({ message: 'O preço é obrigatório' })
		.nonoptional({ message: 'O preço é obrigatório' }),
	notes: z.string().optional(),
});

export type CreateAppointmentSchema = z.infer<typeof createAppointmentSchema>;
