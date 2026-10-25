import type { Product } from "../types/product";

export const productsMock: Product[] = [
  {
    id: "1",
    code: "PRD-001",
    name: "Sauce tomate",
    category: "Sauce",
    unit: "Bouteille",
    sellingPriceAr: 6500,
    active: true
  },
  {
    id: "2",
    code: "PRD-002",
    name: "Purée de tomate",
    category: "Purée",
    unit: "Pot",
    sellingPriceAr: 7000,
    active: true
  },
  {
    id: "3",
    code: "PRD-003",
    name: "Concentré de tomate",
    category: "Concentré",
    unit: "Pot",
    sellingPriceAr: 8500,
    active: true
  }
];
