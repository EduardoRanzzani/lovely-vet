import z from 'zod';

export const createNoteSchema = z.object({
	id: z.uuid().optional(),
	petId: z.uuid().optional(),
	content: z.string().nonempty({ message: 'O campo content é obrigatório' }),
});

export type CreateNoteSchema = z.infer<typeof createNoteSchema>;
