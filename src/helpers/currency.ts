export const formatCurrencyFromCents = (amount: number) => {
	return Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount / 100);
};
