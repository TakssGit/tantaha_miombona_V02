export interface Sale {
  id: string;
  code: string;
  customerCode: string;
  customerName: string;
  productName: string;
  finishedLotCode?: string;
  quantity: number;
  unitPriceAr: number;
  totalAr: number;
  date: string;
  status: string;
}
