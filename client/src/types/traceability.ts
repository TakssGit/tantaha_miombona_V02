export interface TraceabilityNode {
  id: string;

  type:
    | "Producteur"
    | "Lot"
    | "Qualité"
    | "Collecte"
    | "Transport"
    | "Réception"
    | "Transformation"
    | "Produit fini"
    | "Vente";

  code: string;
  title: string;
  description: string;
  date?: string;
}

export interface TraceabilityRecord {
  id: string;
  finalProductCode: string;
  productName: string;
  searchableCodes: string[];
  nodes: TraceabilityNode[];
}
