import type { Transport } from "../types/transport";

export const transportsMock: Transport[] = [
  {
    id: "1",
    code: "TR-20260910-001",
    driver: "Rakotoarisoa Mamy",
    vehicle: "Camion léger",
    registration: "1234 TAA",
    departure: "08:30",
    arrival: "11:00",
    durationHours: 2.5,
    quantityKg: 980,
    status: "Terminé"
  },
  {
    id: "2",
    code: "TR-20260910-002",
    driver: "Razanaka Tovo",
    vehicle: "Fourgon",
    registration: "5678 TBE",
    departure: "09:15",
    arrival: "14:40",
    durationHours: 5.42,
    quantityKg: 740,
    status: "Terminé"
  },
  {
    id: "3",
    code: "TR-20260910-003",
    driver: "Rajaonarison Solo",
    vehicle: "Camion léger",
    registration: "4587 TBC",
    departure: "10:00",
    arrival: "18:35",
    durationHours: 8.58,
    quantityKg: 810,
    status: "Délai dépassé"
  }
];
