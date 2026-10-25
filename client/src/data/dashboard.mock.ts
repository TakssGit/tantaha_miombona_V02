import type {
  DashboardAlert,
  DashboardKpi,
  LossPoint,
  QualityPoint,
  QuantityPoint,
  RecentLot
} from "../types/dashboard";

export const dashboardKpis: DashboardKpi[] = [
  {
    id: "producers",
    label: "Producteurs actifs",
    value: "20",
    trend: "+3 ce mois",
    color: "green"
  },
  {
    id: "lots",
    label: "Lots reçus",
    value: "50",
    trend: "+12 cette semaine",
    color: "blue"
  },
  {
    id: "quantity",
    label: "Quantité reçue",
    value: "12 850 kg",
    trend: "+8,4 %",
    color: "orange"
  },
  {
    id: "quality",
    label: "Conformité",
    value: "86 %",
    trend: "+4 points",
    color: "violet"
  },
  {
    id: "loss",
    label: "Pertes",
    value: "8 %",
    trend: "-3 points",
    color: "red"
  },
  {
    id: "yield",
    label: "Rendement",
    value: "73 %",
    trend: "+2 points",
    color: "cyan"
  }
];

export const quantityEvolution: QuantityPoint[] = [
  { period: "Lun", quantity: 1250 },
  { period: "Mar", quantity: 1600 },
  { period: "Mer", quantity: 1950 },
  { period: "Jeu", quantity: 1450 },
  { period: "Ven", quantity: 1800 },
  { period: "Sam", quantity: 2120 },
  { period: "Dim", quantity: 1680 }
];

export const qualityDistribution: QualityPoint[] = [
  { name: "Classe A", value: 50 },
  { name: "Classe B", value: 28 },
  { name: "Classe C", value: 14 },
  { name: "Rejet", value: 8 }
];

export const lossEvolution: LossPoint[] = [
  { period: "Mai", value: 15 },
  { period: "Juin", value: 13 },
  { period: "Juil.", value: 11 },
  { period: "Août", value: 9 },
  { period: "Sept.", value: 8 }
];

export const dashboardAlerts: DashboardAlert[] = [
  {
    id: "1",
    level: "danger",
    title: "2 lots rejetés",
    message: "Deux lots nécessitent une analyse des causes qualité."
  },
  {
    id: "2",
    level: "warning",
    title: "Transport TR-20260910-003",
    message: "Le délai de transport a dépassé la cible de 8 heures."
  },
  {
    id: "3",
    level: "warning",
    title: "Stock faible",
    message: "Le stock de purée de tomate approche du seuil minimum."
  },
  {
    id: "4",
    level: "success",
    title: "Traçabilité satisfaisante",
    message: "96 % des lots disposent d'informations complètes."
  }
];

export const recentLots: RecentLot[] = [
  {
    id: "1",
    code: "TOM-20260910-P001-001",
    producer: "Rakoto Jean",
    quantity: "250 kg",
    qualityClass: "A",
    status: "Conforme"
  },
  {
    id: "2",
    code: "TOM-20260910-P002-002",
    producer: "Rasoa Marie",
    quantity: "320 kg",
    qualityClass: "A",
    status: "Conforme"
  },
  {
    id: "3",
    code: "TOM-20260910-P003-003",
    producer: "Randria Paul",
    quantity: "180 kg",
    qualityClass: "B",
    status: "Conforme"
  },
  {
    id: "4",
    code: "TOM-20260910-P004-004",
    producer: "Rabe Hery",
    quantity: "275 kg",
    qualityClass: "C",
    status: "Déclassé"
  },
  {
    id: "5",
    code: "TOM-20260910-P005-005",
    producer: "Ramanana Lala",
    quantity: "210 kg",
    qualityClass: "REJET",
    status: "Rejeté"
  }
];
