export interface Production {
  id: string;
  code: string;
  productName: string;
  inputLots?: string[];
  inputKg: number;
  outputKg: number;
  lossKg: number;
  yieldRate: number;
  date: string;
  status: string;
}
