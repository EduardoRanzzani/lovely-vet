import z from 'zod';

export const emailSchema = z.object({
	to: z
		.string()
		.email({ message: "O campo 'destinatário' deve ser um email válido" })
		.nonempty({ message: "O campo 'destinatário' é obrigatório" }),
	subject: z.string().nonempty({ message: "O campo 'assunto' é obrigatório" }),
	body: z.string().nonempty({ message: "O campo 'corpo' é obrigatório" }),
});

export type EmailSchema = z.infer<typeof emailSchema>;

export interface ActionResponse {
	success: boolean;
	message: string;
}
