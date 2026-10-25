export const formatNumber = (
  value: number,
  maximumFractionDigits = 2
): string => {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits
  }).format(value);
};
