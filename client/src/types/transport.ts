export interface Transport {
  id: string;
  code: string;
  driver: string;
  vehicle: string;
  registration: string;
  date?: string;
  departure: string;
  arrival: string;
  durationHours: number;
  quantityKg: number;
  lotCodes?: string[];
  status: string;
}
