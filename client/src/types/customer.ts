export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  location: string;
  type: "Détaillant" | "Grossiste" | "Restaurant" | "Particulier";
  status: "Actif" | "Archivé";
}
