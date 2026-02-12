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
