import { platformRequest } from "./platform-api";

export type CatalogProduct = {
  id: number;
  code: string;
  name: string;
  category: string;
  unit: string;
  sellingPriceAr: number;
  availableStock: number;
};

export type OrderRow = {
  id: number;
  code: string;
  customerName?: string;
  customerPhone?: string;
  status: string;
  totalAr: number;
  notes?: string | null;
  createdAt: string;
};

export const commerceService = {
  catalog: () => platformRequest<{ success: boolean; products: CatalogProduct[] }>("/public/catalog"),

  myOrders: () => platformRequest<{ success: boolean; orders: OrderRow[] }>(
    "/my-orders", { authenticated: true }
  ),

  createOrder: (payload: {
    items: Array<{ productId: number; quantity: number }>;
    notes?: string;
  }) => platformRequest<{ success: boolean; message: string; code: string; totalAr: number }>(
    "/my-orders",
    { method: "POST", authenticated: true, body: payload }
  ),

  allOrders: () => platformRequest<{ success: boolean; orders: OrderRow[] }>(
    "/orders", { authenticated: true }
  ),

  setOrderStatus: (id: number, status: string) =>
    platformRequest(`/orders/${id}/status`, {
      method: "PATCH",
      authenticated: true,
      body: { status }
    })
};
