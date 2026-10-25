export interface Reception {
  id: string;
  code: string;
  lotCode: string;
  transportCode: string;
  announcedWeightKg: number;
  receivedWeightKg: number;
  lossKg: number;
  lossRate: number;
  decision: string;
  date: string;
}
