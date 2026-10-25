export const formatMoney = (
  value: number
): string => {
  return `${new Intl.NumberFormat("fr-FR").format(value)} Ar`;
};
