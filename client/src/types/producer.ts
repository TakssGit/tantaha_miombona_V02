export interface Producer {
  id: string;
  code: string;
  fullName: string;
  phone: string;
  commune: string;
  fokontany: string;
  cooperative: string;
  totalDeliveredKg: number;
  status: "Actif" | "Archivé";
}
