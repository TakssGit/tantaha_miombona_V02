const compactDate = (date: string): string => {
  return date.replace(/-/g, "");
};

export const generateLotCode = (
  date: string,
  producerCode: string,
  sequence: number
): string => {
  return `TOM-${compactDate(date)}-${producerCode}-${String(sequence).padStart(3, "0")}`;
};

export const generateCode = (
  prefix: string,
  date: string,
  sequence: number
): string => {
  return `${prefix}-${compactDate(date)}-${String(sequence).padStart(3, "0")}`;
};