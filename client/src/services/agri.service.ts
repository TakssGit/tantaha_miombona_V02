import { platformRequest } from "./platform-api";

export type ProducerMini = {
  id: number;
  code: string;
  fullName: string;
  phone?: string | null;
  commune?: string;
  fokontany?: string | null;
  cooperative?: string | null;
  status?: string;
};

export type ForecastRow = {
  id: number;
  code: string;
  producerName?: string;
  producerCode?: string;
  estimatedQuantityKg: number;
  expectedHarvestDate: string;
  notes?: string | null;
  status: string;
  createdBy?: string;
};

export const agriService = {
  producerMe: () => platformRequest<{ success: boolean; producer: ProducerMini }>(
    "/producer/me", { authenticated: true }
  ),

  producerForecasts: () => platformRequest<{ success: boolean; forecasts: ForecastRow[] }>(
    "/producer/forecasts", { authenticated: true }
  ),

  addProducerForecast: (payload: { estimatedQuantityKg: number; expectedHarvestDate: string; notes?: string }) =>
    platformRequest("/producer/forecasts", { method: "POST", authenticated: true, body: payload }),

  pointFocalProducers: () => platformRequest<{ success: boolean; producers: ProducerMini[] }>(
    "/point-focal/producers", { authenticated: true }
  ),

  createPointFocalProducer: (payload: {
    fullName: string; phone: string; commune: string; fokontany: string; cooperative: string;
  }) => platformRequest("/point-focal/producers", { method: "POST", authenticated: true, body: payload }),

  pointFocalForecasts: () => platformRequest<{ success: boolean; forecasts: ForecastRow[] }>(
    "/point-focal/forecasts", { authenticated: true }
  ),

  addPointFocalForecast: (payload: {
    producerId: number; estimatedQuantityKg: number; expectedHarvestDate: string; notes?: string;
  }) => platformRequest("/point-focal/forecasts", { method: "POST", authenticated: true, body: payload }),

  allForecasts: () => platformRequest<{ success: boolean; forecasts: ForecastRow[] }>(
    "/forecasts", { authenticated: true }
  ),

  setForecastStatus: (id: number, status: "VALIDATED" | "REJECTED" | "PENDING") =>
    platformRequest(`/forecasts/${id}/status`, { method: "PATCH", authenticated: true, body: { status } }),

  adminAccessData: () => platformRequest<{
    success: boolean;
    users: Array<{ id: number; username: string; fullName: string; producerId: number | null }>;
    producers: ProducerMini[];
    pointFocals: Array<{ id: number; fullName: string }>;
  }>("/admin/producer-access", { authenticated: true }),

  linkProducerUser: (userId: number, producerId: number) =>
    platformRequest("/admin/producer-access/link", {
      method: "POST", authenticated: true, body: { userId, producerId }
    }),

  assignPointFocal: (pointFocalUserId: number, producerId: number) =>
    platformRequest("/admin/point-focal-access/assign", {
      method: "POST", authenticated: true, body: { pointFocalUserId, producerId }
    })
};
