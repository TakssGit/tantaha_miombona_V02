export interface FinishedBatch {
  id: string;
  code: string;
  productionCode: string;
  productCode: string;
  productName: string;
  manufacturingDate: string;
  quantity: number;
  unit: string;
  packaging: string;
  status:
    | "Conforme"
    | "En attente"
    | "Bloqué";
}
