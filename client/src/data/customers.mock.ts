import type { Customer } from "../types/customer";

export const customersMock: Customer[] = [
  {
    id: "1",
    code: "CLI-001",
    name: "Marché Central",
    phone: "034 00 100 01",
    location: "Soavinandriana",
    type: "Détaillant",
    status: "Actif"
  },
  {
    id: "2",
    code: "CLI-002",
    name: "Auberge du Lac",
    phone: "033 00 100 02",
    location: "Soavinandriana",
    type: "Restaurant",
    status: "Actif"
  },
  {
    id: "3",
    code: "CLI-003",
    name: "Distribution Itasy",
    phone: "032 00 100 03",
    location: "Miarinarivo",
    type: "Grossiste",
    status: "Actif"
  }
];
