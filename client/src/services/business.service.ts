import {
  api
} from "./api";

import type {
  Producer
} from "../types/producer";

import type {
  Parcel
} from "../types/parcel";

import type {
  HarvestLot
} from "../types/lot";

import type {
  QualityCheck
} from "../types/quality";

import type {
  Collection
} from "../types/collection";

import type {
  Transport
} from "../types/transport";

import type {
  Reception
} from "../types/reception";

import type {
  Production
} from "../types/production";

import type {
  Product
} from "../types/product";

import type {
  FinishedBatch
} from "../types/finishedBatch";

import type {
  StockItem,
  StockMovement
} from "../types/stock";

import type {
  Customer
} from "../types/customer";

import type {
  Sale
} from "../types/sale";

import type {
  NonConformity
} from "../types/nonconformity";

import type {
  TraceabilityRecord
} from "../types/traceability";

import type {
  OrganizationSettings
} from "../types/settings";

import type {
  User
} from "../types/user";

export const businessService = {
  producers: {
    list: () =>
      api.get<Producer[]>(
        "/producers"
      ),

    create: (
      data: unknown
    ) =>
      api.post<Producer>(
        "/producers",
        data
      ),

    update: (
      id: string,
      data: unknown
    ) =>
      api.put(
        `/producers/${id}`,
        data
      ),

    toggle: (
      id: string
    ) =>
      api.patch(
        `/producers/${id}/toggle`
      )
  },

  parcels: {
    list: () =>
      api.get<Parcel[]>(
        "/parcels"
      ),

    create: (
      data: unknown
    ) =>
      api.post<Parcel>(
        "/parcels",
        data
      )
  },

  lots: {
    list: () =>
      api.get<
        HarvestLot[]
      >(
        "/lots"
      ),

    create: (
      data: unknown
    ) =>
      api.post<
        HarvestLot
      >(
        "/lots",
        data
      )
  },

  quality: {
    list: () =>
      api.get<
        QualityCheck[]
      >(
        "/quality-checks"
      ),

    create: (
      data: unknown
    ) =>
      api.post<
        QualityCheck
      >(
        "/quality-checks",
        data
      )
  },

  collections: {
    list: () =>
      api.get<
        Collection[]
      >(
        "/collections"
      ),

    create: (
      data: unknown
    ) =>
      api.post<
        Collection
      >(
        "/collections",
        data
      )
  },

  transports: {
    list: () =>
      api.get<
        Transport[]
      >(
        "/transports"
      ),

    create: (
      data: unknown
    ) =>
      api.post<
        Transport
      >(
        "/transports",
        data
      )
  },

  receptions: {
    list: () =>
      api.get<
        Reception[]
      >(
        "/receptions"
      ),

    create: (
      data: unknown
    ) =>
      api.post<
        Reception
      >(
        "/receptions",
        data
      )
  },

  products: {
    list: () =>
      api.get<Product[]>(
        "/products"
      ),

    create: (
      data: unknown
    ) =>
      api.post<Product>(
        "/products",
        data
      )
  },

  productions: {
    list: () =>
      api.get<
        Production[]
      >(
        "/productions"
      ),

    create: (
      data: unknown
    ) =>
      api.post<
        Production
      >(
        "/productions",
        data
      )
  },

  finishedBatches: {
    list: () =>
      api.get<
        FinishedBatch[]
      >(
        "/finished-batches"
      ),

    create: (
      data: unknown
    ) =>
      api.post<
        FinishedBatch
      >(
        "/finished-batches",
        data
      )
  },

  stocks: {
    list: () =>
      api.get<
        StockItem[]
      >(
        "/stocks"
      ),

    movements: () =>
      api.get<
        StockMovement[]
      >(
        "/stock-movements"
      ),

    createMovement: (
      data: unknown
    ) =>
      api.post<
        StockMovement
      >(
        "/stock-movements",
        data
      )
  },

  customers: {
    list: () =>
      api.get<
        Customer[]
      >(
        "/customers"
      ),

    create: (
      data: unknown
    ) =>
      api.post<
        Customer
      >(
        "/customers",
        data
      ),

    update: (
      id: string,
      data: unknown
    ) =>
      api.put(
        `/customers/${id}`,
        data
      ),

    toggle: (
      id: string
    ) =>
      api.patch(
        `/customers/${id}/toggle`
      )
  },

  sales: {
    list: () =>
      api.get<Sale[]>(
        "/sales"
      ),

    create: (
      data: unknown
    ) =>
      api.post<Sale>(
        "/sales",
        data
      )
  },

  nonConformities: {
    list: () =>
      api.get<
        NonConformity[]
      >(
        "/non-conformities"
      ),

    create: (
      data: unknown
    ) =>
      api.post<
        NonConformity
      >(
        "/non-conformities",
        data
      ),

    resolve: (
      id: string
    ) =>
      api.patch(
        `/non-conformities/${id}/resolve`
      )
  },

  traceability: (
    code: string
  ) =>
    api.get<
      TraceabilityRecord
    >(
      `/traceability/${encodeURIComponent(
        code
      )}`
    ),

  settings: {
    get: () =>
      api.get<
        OrganizationSettings
      >(
        "/settings"
      ),

    save: (
      data:
        OrganizationSettings
    ) =>
      api.put(
        "/settings",
        data
      )
  },

  users: {
    list: () =>
      api.get<User[]>(
        "/users"
      ),

    create: (
      data: unknown
    ) =>
      api.post<User>(
        "/users",
        data
      ),

    toggle: (
      id: string
    ) =>
      api.patch(
        `/users/${id}/toggle`
      )
  },

  dashboard: () =>
    api.get<any>(
      "/dashboard"
    )
};
