import { z } from 'zod';

export const createCustomerSchema = z.object({
	phone: z.string().nonempty({ message: 'O campo telefone é obrigatório' }),
	cpf: z.string().nonempty({ message: 'O campo CPF é obrigatório' }),
	postalCode: z.string().nonempty({ message: 'O campo CEP é obrigatório' }),
	address: z.string().nonempty({ message: 'O campo endereço é obrigatório' }),
	addressNumber: z.string().optional(),
	neighborhood: z.string().nonempty('O campo bairro é obrigatório'),
	city: z.string().nonempty('O campo cidade é obrigatório'),
	state: z.string().nonempty('O campo estado é obrigatório'),
});
