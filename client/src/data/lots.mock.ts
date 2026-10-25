import type { HarvestLot } from "../types/lot";

export const lotsMock: HarvestLot[] = [
  {
    id: "1",
    code: "TOM-20260910-P001-001",
    producerCode: "P001",
    producerName: "Rakoto Jean",
    parcelCode: "PAR-001",
    product: "Tomate",
    harvestDate: "2026-09-10",
    harvestTime: "06:20",
    quantityKg: 250,
    crates: 12,
    qualityClass: "A",
    status: "Conforme"
  },
  {
    id: "2",
    code: "TOM-20260910-P002-002",
    producerCode: "P002",
    producerName: "Rasoa Marie",
    parcelCode: "PAR-002",
    product: "Tomate",
    harvestDate: "2026-09-10",
    harvestTime: "06:45",
    quantityKg: 320,
    crates: 16,
    qualityClass: "A",
    status: "Conforme"
  },
  {
    id: "3",
    code: "TOM-20260910-P003-003",
    producerCode: "P003",
    producerName: "Randria Paul",
    parcelCode: "PAR-003",
    product: "Tomate",
    harvestDate: "2026-09-10",
    harvestTime: "07:00",
    quantityKg: 180,
    crates: 9,
    qualityClass: "B",
    status: "Conforme"
  },
  {
    id: "4",
    code: "TOM-20260910-P004-004",
    producerCode: "P004",
    producerName: "Rabe Hery",
    parcelCode: "PAR-004",
    product: "Tomate",
    harvestDate: "2026-09-10",
    harvestTime: "07:15",
    quantityKg: 275,
    crates: 14,
    qualityClass: "C",
    status: "Déclassé"
  },
  {
    id: "5",
    code: "TOM-20260910-P005-005",
    producerCode: "P005",
    producerName: "Ramanana Lala",
    parcelCode: "PAR-005",
    product: "Tomate",
    harvestDate: "2026-09-10",
    harvestTime: "07:40",
    quantityKg: 210,
    crates: 11,
    qualityClass: "REJET",
    status: "Rejeté"
  },
  {
    id: "6",
    code: "TOM-20260909-P006-006",
    producerCode: "P006",
    producerName: "Rakotomalala Eric",
    parcelCode: "PAR-006",
    product: "Tomate",
    harvestDate: "2026-09-09",
    harvestTime: "06:10",
    quantityKg: 295,
    crates: 15,
    qualityClass: "A",
    status: "Conforme"
  }
];
