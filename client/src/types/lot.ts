export type LotQualityClass =
  | "A"
  | "B"
  | "C"
  | "REJET"
  | "NON_CLASSE";

export interface HarvestLot {
  id: string;
  code: string;
  producerCode: string;
  producerName: string;
  parcelCode: string;
  product: string;
  harvestDate: string;
  harvestTime: string;
  quantityKg: number;
  crates: number;
  qualityClass: LotQualityClass;
  status:
    | "En attente"
    | "Conforme"
    | "Déclassé"
    | "Rejeté"
    | "En transport";
}

