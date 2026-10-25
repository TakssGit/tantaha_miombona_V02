export interface OrganizationSettings {
  organizationName: string;
  address: string;
  phone: string;
  currency: string;

  targetTransportHours: number;

  maximumLossRate: number;

  targetConformityRate: number;

  targetYieldRate: number;
}
