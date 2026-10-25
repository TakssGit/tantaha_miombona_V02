import type { LotQualityClass } from "../types/lot";

export const calculateLossKg = (
  initialWeight: number,
  finalWeight: number
): number => {
  return Math.max(0, initialWeight - finalWeight);
};

export const calculateLossRate = (
  initialWeight: number,
  finalWeight: number
): number => {
  if (initialWeight <= 0) {
    return 0;
  }

  const loss = calculateLossKg(initialWeight, finalWeight);

  return Number(((loss / initialWeight) * 100).toFixed(2));
};

export const calculateYieldRate = (
  inputWeight: number,
  outputWeight: number
): number => {
  if (inputWeight <= 0) {
    return 0;
  }

  return Number(((outputWeight / inputWeight) * 100).toFixed(2));
};

export const calculateDurationHours = (
  departure: string,
  arrival: string
): number => {
  if (!departure || !arrival) {
    return 0;
  }

  const [departureHour, departureMinute] = departure
    .split(":")
    .map(Number);

  const [arrivalHour, arrivalMinute] = arrival
    .split(":")
    .map(Number);

  let departureMinutes = departureHour * 60 + departureMinute;
  let arrivalMinutes = arrivalHour * 60 + arrivalMinute;

  if (arrivalMinutes < departureMinutes) {
    arrivalMinutes += 24 * 60;
  }

  const difference = arrivalMinutes - departureMinutes;

  return Number((difference / 60).toFixed(2));
};

export const calculateQualityClass = (
  score: number
): LotQualityClass => {
  if (score >= 10) {
    return "A";
  }

  if (score >= 7) {
    return "B";
  }

  if (score >= 4) {
    return "C";
  }

  return "REJET";
};
