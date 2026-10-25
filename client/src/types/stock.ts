export interface StockItem {
  id: string;
  productCode: string;
  productName: string;
  finishedLotCode: string;
  inputQuantity: number;
  outputQuantity: number;
  availableQuantity: number;
  unit: string;
  minimumQuantity?: number;
  status: string;
}

export type StockMovementType =
  | "Entrée"
  | "Sortie";

export interface StockMovement {
  id: string;
  code: string;
  finishedLotCode: string;
  productName: string;
  type: StockMovementType;
  quantity: number;
  unit: string;
  reason: string;
  date: string;
}
