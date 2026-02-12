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
