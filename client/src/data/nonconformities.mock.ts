import type { NonConformity } from "../types/nonconformity";

export const nonconformitiesMock: NonConformity[] = [
  {
    id: "1",
    code: "NC-20260910-001",
    lotCode: "TOM-20260910-P005-005",
    category: "Qualité",
    cause: "Tomates trop mûres",
    correctiveAction: "Lot rejeté et producteur informé",
    responsible: "Agent qualité",
    date: "2026-09-10",
    status: "Résolu"
  },
  {
    id: "2",
    code: "NC-20260910-002",
    lotCode: "TOM-20260910-P004-004",
    category: "Transport",
    cause: "Délai supérieur à la cible",
    correctiveAction: "Réorganisation du planning",
    responsible: "Responsable transport",
    date: "2026-09-10",
    status: "En cours"
  }
];
