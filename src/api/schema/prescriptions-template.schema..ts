import {
	doctorsTable,
	prescriptionTemplatesTable,
	usersTable,
} from '@/db/schema';
import z from 'zod';

export type PrescriptionTemplateWithRelations =
	typeof prescriptionTemplatesTable.$inferSelect & {
		doctor: typeof doctorsTable.$inferSelect & {
			user: typeof usersTable.$inferSelect;
		};
	};

export const createPrescriptionTemplateSchema = z.object({
	id: z.uuid().optional(),
	title: z.string().nonempty({ message: 'O campo título é obrigatório' }),
	content: z.string().refine((val) => val !== '<p></p>' && val.trim() !== '', {
		message: 'O conteúdo da receita não pode estar vazio',
	}),
	doctorId: z
		.uuid({ message: 'O campo médico é obrigatório' })
		.nonempty({ message: 'O campo médico é obrigatório' }),
});

export type CreatePrescriptionTemplateSchema = z.infer<
	typeof createPrescriptionTemplateSchema
>;
