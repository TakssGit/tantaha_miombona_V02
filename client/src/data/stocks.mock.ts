import type {
  StockItem
} from "../types/stock";

export const stocksMock: StockItem[] = [
  {
    id: "1",
    productCode: "PRD-001",
    productName: "Sauce tomate",
    finishedLotCode:
      "PF-20260910-001",
    inputQuantity: 672,
    outputQuantity: 145,
    availableQuantity: 527,
    unit: "kg",
    minimumQuantity: 120,
    status: "Disponible"
  },
  {
    id: "2",
    productCode: "PRD-002",
    productName: "Purée de tomate",
    finishedLotCode:
      "PF-20260909-002",
    inputQuantity: 540,
    outputQuantity: 460,
    availableQuantity: 80,
    unit: "kg",
    minimumQuantity: 100,
    status: "Stock faible"
  },
  {
    id: "3",
    productCode: "PRD-003",
    productName:
      "Concentré de tomate",
    finishedLotCode:
      "PF-20260908-003",
    inputQuantity: 735,
    outputQuantity: 265,
    availableQuantity: 470,
    unit: "kg",
    minimumQuantity: 100,
    status: "Disponible"
  }
];
