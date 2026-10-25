import type { Collection } from "../types/collection";

export const collectionsMock: Collection[] = [
  {
    id: "1",
    code: "COL-20260910-001",
    lotCode: "TOM-20260910-P001-001",
    center: "Centre de collecte principal",
    grossWeightKg: 250,
    acceptedWeightKg: 248,
    date: "2026-09-10",
    time: "08:05",
    status: "Conforme"
  },
  {
    id: "2",
    code: "COL-20260910-002",
    lotCode: "TOM-20260910-P002-002",
    center: "Centre de collecte principal",
    grossWeightKg: 320,
    acceptedWeightKg: 317,
    date: "2026-09-10",
    time: "08:20",
    status: "Conforme"
  }
];
