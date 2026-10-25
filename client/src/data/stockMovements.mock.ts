import type {
  StockMovement
} from "../types/stock";

export const stockMovementsMock:
  StockMovement[] = [
    {
      id: "1",
      code: "MVT-20260910-001",
      finishedLotCode:
        "PF-20260910-001",
      productName: "Sauce tomate",
      type: "Entrée",
      quantity: 672,
      unit: "kg",
      reason: "Fin de fabrication",
      date: "2026-09-10"
    },
    {
      id: "2",
      code: "MVT-20260910-002",
      finishedLotCode:
        "PF-20260910-001",
      productName: "Sauce tomate",
      type: "Sortie",
      quantity: 145,
      unit: "kg",
      reason: "Distribution",
      date: "2026-09-10"
    },
    {
      id: "3",
      code: "MVT-20260909-003",
      finishedLotCode:
        "PF-20260909-002",
      productName: "Purée de tomate",
      type: "Sortie",
      quantity: 180,
      unit: "kg",
      reason: "Vente client",
      date: "2026-09-09"
    }
  ];
