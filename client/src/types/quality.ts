import type { LotQualityClass } from "./lot";

export interface QualityCheck {
  id: string;
  lotCode: string;
  maturity: number;
  color: number;
  firmness: number;
  injuries: number;
  health: number;
  cleanliness: number;
  score: number;
  qualityClass: LotQualityClass;
  decision: string;
  controller: string;
}
