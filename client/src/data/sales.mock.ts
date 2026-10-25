import type { Sale } from "../types/sale";

export const salesMock: Sale[] = [
  {
    id: "1",
    code: "VTE-20260910-001",
    customerCode: "CLI-001",
    customerName: "Marché Central",
    productName: "Sauce tomate",
    quantity: 40,
    unitPriceAr: 6500,
    totalAr: 260000,
    date: "2026-09-10",
    status: "Payée"
  },
  {
    id: "2",
    code: "VTE-20260910-002",
    customerCode: "CLI-002",
    customerName: "Auberge du Lac",
    productName: "Purée de tomate",
    quantity: 25,
    unitPriceAr: 7000,
    totalAr: 175000,
    date: "2026-09-10",
    status: "Payée"
  },
  {
    id: "3",
    code: "VTE-20260909-003",
    customerCode: "CLI-003",
    customerName: "Distribution Itasy",
    productName: "Concentré de tomate",
    quantity: 60,
    unitPriceAr: 8500,
    totalAr: 510000,
    date: "2026-09-09",
    status: "Payée"
  }
];
