import type { Reception } from "../types/reception";

export const receptionsMock: Reception[] = [
  {
    id: "1",
    code: "REC-20260910-001",
    lotCode: "TOM-20260910-P001-001",
    transportCode: "TR-20260910-001",
    announcedWeightKg: 250,
    receivedWeightKg: 244,
    lossKg: 6,
    lossRate: 2.4,
    decision: "Accepté",
    date: "2026-09-10"
  },
  {
    id: "2",
    code: "REC-20260910-002",
    lotCode: "TOM-20260910-P004-004",
    transportCode: "TR-20260910-002",
    announcedWeightKg: 275,
    receivedWeightKg: 258,
    lossKg: 17,
    lossRate: 6.18,
    decision: "Déclassé",
    date: "2026-09-10"
  }
];
