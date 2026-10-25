export interface DashboardKpi {
  id: string;
  label: string;
  value: string;
  trend: string;
  color:
    | "green"
    | "blue"
    | "orange"
    | "violet"
    | "red"
    | "cyan";
}

export interface QuantityPoint {
  period: string;
  quantity: number;
}

export interface QualityPoint {
  name: string;
  value: number;
}

export interface LossPoint {
  period: string;
  value: number;
}

export interface DashboardAlert {
  id: string;
  level: "danger" | "warning" | "success" | "info";
  title: string;
  message: string;
}

export interface RecentLot {
  id: string;
  code: string;
  producer: string;
  quantity: string;
  qualityClass: string;
  status: string;
}
