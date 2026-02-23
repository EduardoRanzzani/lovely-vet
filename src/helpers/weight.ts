export const formatWeight = (grams: number | null) => {
	if (!grams) return '-';
	return `${(grams / 1000).toFixed(1)} kg`;
};
