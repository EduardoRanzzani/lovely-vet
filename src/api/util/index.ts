export const generateUsername = (name: string): string => {
	const nameParts = name.trim().toLowerCase().split(/\s+/);

	// Remove conectores comuns em nomes brasileiros
	const conectores = ['de', 'da', 'do', 'das', 'dos'];
	const filteredParts = nameParts.filter((part) => !conectores.includes(part));

	const firstName = filteredParts[0];
	const lastName =
		filteredParts.length > 1 ? filteredParts[filteredParts.length - 1] : '';

	const generatedUsername = lastName ? `${firstName}${lastName}` : firstName;

	return generatedUsername;
};

export const getInitials = (name: string): string => {
	const words = name.trim().split(/\s+/);
	const first = words[0][0].toUpperCase();
	const last = words.length > 1 ? words[words.length - 1][0].toUpperCase() : '';
	return first + last;
};

export const calculateAge = (dateOfBirth: Date): string => {
	const today = new Date();
	let years = today.getFullYear() - dateOfBirth.getFullYear();
	let months = today.getMonth() - dateOfBirth.getMonth();
	let days = today.getDate() - dateOfBirth.getDate();

	// Se o mês atual for antes do mês de nascimento, ajusta os anos e meses
	if (months < 0) {
		years--;
		months += 12;
	}

	// Verifica se o dia do mês já passou, se não, ajusta os meses
	if (today.getDate() < dateOfBirth.getDate()) {
		months--;
		if (months < 0) {
			years--;
			months += 12;
		}
	}

	if (days < 0) {
		const lastMonth = new Date(
			today.getFullYear(),
			today.getMonth(),
			0,
		).getDate();
		days += lastMonth;
	}

	const textYears = `${
		years < 1 ? '' : years === 1 ? '1 ano' : `${years} anos`
	}`;
	const textMonths = `${
		months < 1 ? '' : months === 1 ? '1 mês' : `${months} meses`
	}`;
	const textDays = `${days < 1 ? '' : days === 1 ? '1 dia' : `${days} dias`}`;

	let result = '';

	if (years > 0) {
		result = textYears + (months > 0 ? ` e ${textMonths}` : '');
	} else if (months > 0) {
		result = textMonths + (days > 0 ? ` e ${textDays}` : '');
	} else {
		result = textDays;
	}

	return result;
};
