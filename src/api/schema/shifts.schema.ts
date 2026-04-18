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
	startTime: z.date({ message: 'Data de início do plantão é obrigatório' }),
	endTime: z.date({ message: 'Data de término do plantão é obrigatório' }),
});

export type CreateShiftSchema = z.infer<typeof createShiftSchema>;
