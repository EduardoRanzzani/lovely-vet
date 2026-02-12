import { ViaCepResponse } from '@/types/viacep';

export const MAX_PAGE_SIZE = 20;

export type PaginatedData<T> = {
	data: T[];
	metadata: {
		totalCount: number;
		pageCount: number;
		currentPage: number;
		limit: number;
	};
};

export const searchAddressByPostalCode = async (
	postalCode: string,
): Promise<ViaCepResponse> => {
	console.log(postalCode);

	const response = await fetch(`https://viacep.com.br/ws/${postalCode}/json`);
	const data = await response.json();
	console.log(data);
	return data;
};

export const CLERK_ERROR_MESSAGES: Record<string, string> = {
	form_identifier_exists:
		'Este e-mail ou nome de usuário já está sendo utilizado.',
	form_password_pwned:
		'Esta senha foi encontrada em um vazamento de dados. Por favor, escolha outra.',
	form_password_validation_failed:
		'A senha não atende aos requisitos de segurança.',
	form_identifier_format_incorrect:
		'O formato do e-mail ou nome de usuário é inválido.',
	form_data_missing: 'Dados obrigatórios estão faltando no formulário.',
	username_exists: 'Este nome de usuário já está em uso.',
};
