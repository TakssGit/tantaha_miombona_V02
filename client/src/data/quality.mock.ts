import type { QualityCheck } from "../types/quality";

export const qualityMock: QualityCheck[] = [
  {
    id: "1",
    lotCode: "TOM-20260910-P001-001",
    maturity: 2,
    color: 2,
    firmness: 2,
    injuries: 2,
    health: 2,
    cleanliness: 2,
    score: 12,
    qualityClass: "A",
    decision: "Accepté",
    controller: "Agent qualité 01"
  },
  {
    id: "2",
    lotCode: "TOM-20260910-P002-002",
    maturity: 2,
    color: 2,
    firmness: 2,
    injuries: 1,
    health: 2,
    cleanliness: 2,
    score: 11,
    qualityClass: "A",
    decision: "Accepté",
    controller: "Agent qualité 01"
  },
  {
    id: "3",
    lotCode: "TOM-20260910-P003-003",
    maturity: 2,
    color: 1,
    firmness: 1,
    injuries: 1,
    health: 2,
    cleanliness: 1,
    score: 8,
    qualityClass: "B",
    decision: "Accepté",
    controller: "Agent qualité 02"
  },
  {
    id: "4",
    lotCode: "TOM-20260910-P004-004",
    maturity: 1,
    color: 1,
    firmness: 1,
    injuries: 1,
    health: 1,
    cleanliness: 1,
    score: 6,
    qualityClass: "C",
    decision: "Déclassé",
    controller: "Agent qualité 02"
  }
];
