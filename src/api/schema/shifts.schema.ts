import { doctorsTable, shiftsTable, usersTable } from '@/db/schema';
import z from 'zod';

export type ShiftWithDoctor = typeof shiftsTable.$inferSelect & {
	doctor: typeof doctorsTable.$inferSelect & {
		user: typeof usersTable.$inferSelect;
	};
};

export const createShiftSchema = z.object({
	id: z.uuid().optional(),
	doctorId: z
		.uuid({ message: 'O campo veterinário é obrigatório' })
		.nonempty({ message: 'O campo veterinário é obrigatório' }),
	clinicName: z
		.string()
		.nonempty({ message: 'O campo nome da clínica é obrigatório' }),
	startTime: z
		.date({ message: 'Data de início do plantão é obrigatório' })
		.refine((date) => date >= new Date(), {
			message: 'A data de início não pode ser anterior ao horário atual',
		}),
	duration: z.number().min(1, 'Mínimo 1h').max(12, 'Máximo 12h'),
});

export type CreateShiftSchema = z.infer<typeof createShiftSchema>;
