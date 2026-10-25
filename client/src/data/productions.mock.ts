import type { Production } from "../types/production";

export const productionsMock: Production[] = [
  {
    id: "1",
    code: "FAB-20260910-001",
    productName: "Sauce tomate",
    inputLots: [
      "TOM-20260910-P001-001",
      "TOM-20260910-P002-002"
    ],
    inputKg: 920,
    outputKg: 672,
    lossKg: 248,
    yieldRate: 73.04,
    date: "2026-09-10",
    status: "Terminée"
  },
  {
    id: "2",
    code: "FAB-20260909-002",
    productName: "Purée de tomate",
    inputLots: [
      "TOM-20260909-P006-006"
    ],
    inputKg: 760,
    outputKg: 540,
    lossKg: 220,
    yieldRate: 71.05,
    date: "2026-09-09",
    status: "Terminée"
  },
  {
    id: "3",
    code: "FAB-20260908-003",
    productName: "Concentré de tomate",
    inputLots: [
      "TOM-20260910-P003-003",
      "TOM-20260910-P004-004"
    ],
    inputKg: 1040,
    outputKg: 735,
    lossKg: 305,
    yieldRate: 70.67,
    date: "2026-09-08",
    status: "Terminée"
  }
];
