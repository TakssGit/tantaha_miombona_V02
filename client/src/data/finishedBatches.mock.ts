import type {
  FinishedBatch
} from "../types/finishedBatch";

export const finishedBatchesMock:
  FinishedBatch[] = [
    {
      id: "1",
      code: "PF-20260910-001",
      productionCode:
        "FAB-20260910-001",
      productCode: "PRD-001",
      productName: "Sauce tomate",
      manufacturingDate:
        "2026-09-10",
      quantity: 672,
      unit: "kg",
      packaging: "Bouteille 500 ml",
      status: "Conforme"
    },
    {
      id: "2",
      code: "PF-20260909-002",
      productionCode:
        "FAB-20260909-002",
      productCode: "PRD-002",
      productName: "Purée de tomate",
      manufacturingDate:
        "2026-09-09",
      quantity: 540,
      unit: "kg",
      packaging: "Pot 500 g",
      status: "Conforme"
    },
    {
      id: "3",
      code: "PF-20260908-003",
      productionCode:
        "FAB-20260908-003",
      productCode: "PRD-003",
      productName:
        "Concentré de tomate",
      manufacturingDate:
        "2026-09-08",
      quantity: 735,
      unit: "kg",
      packaging: "Pot 250 g",
      status: "En attente"
    }
  ];
