export interface NonConformity {
  id: string;
  code: string;
  lotCode: string;
  category: string;
  cause: string;
  correctiveAction: string;
  responsible: string;
  date: string;
  status: "Ouvert" | "En cours" | "Résolu";
}
