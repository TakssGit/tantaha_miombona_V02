import type {
  TraceabilityRecord
} from "../types/traceability";

export const traceabilityMock:
  TraceabilityRecord[] = [
    {
      id: "TRACE-001",
      finalProductCode:
        "PF-20260910-001",
      productName:
        "Sauce tomate",
      searchableCodes: [
        "PF-20260910-001",
        "FAB-20260910-001",
        "REC-20260910-001",
        "TR-20260910-001",
        "COL-20260910-001",
        "TOM-20260910-P001-001",
        "P001",
        "VTE-20260910-001"
      ],
      nodes: [
        {
          id: "1",
          type: "Producteur",
          code: "P001",
          title: "Rakoto Jean",
          description:
            "Producteur partenaire enregistré à Soavinandriana.",
          date: "2026-09-10"
        },
        {
          id: "2",
          type: "Lot",
          code:
            "TOM-20260910-P001-001",
          title:
            "Lot de tomates",
          description:
            "Récolte de 250 kg enregistrée à 06:20.",
          date: "2026-09-10"
        },
        {
          id: "3",
          type: "Qualité",
          code: "CQ-001",
          title:
            "Contrôle qualité",
          description:
            "Score 12/12, classe A, lot accepté.",
          date: "2026-09-10"
        },
        {
          id: "4",
          type: "Collecte",
          code:
            "COL-20260910-001",
          title:
            "Centre de collecte",
          description:
            "250 kg bruts, 248 kg acceptés.",
          date: "2026-09-10"
        },
        {
          id: "5",
          type: "Transport",
          code:
            "TR-20260910-001",
          title:
            "Transport vers l'unité",
          description:
            "Départ 08:30, arrivée 11:00, délai 2 h 30.",
          date: "2026-09-10"
        },
        {
          id: "6",
          type: "Réception",
          code:
            "REC-20260910-001",
          title:
            "Réception usine",
          description:
            "244 kg reçus, perte calculée 2,4 %, lot accepté.",
          date: "2026-09-10"
        },
        {
          id: "7",
          type:
            "Transformation",
          code:
            "FAB-20260910-001",
          title:
            "Fabrication sauce tomate",
          description:
            "920 kg de matière première pour 672 kg de produit fini.",
          date: "2026-09-10"
        },
        {
          id: "8",
          type:
            "Produit fini",
          code:
            "PF-20260910-001",
          title:
            "Sauce tomate conforme",
          description:
            "Lot fini conditionné et libéré pour le stock.",
          date: "2026-09-10"
        },
        {
          id: "9",
          type: "Vente",
          code:
            "VTE-20260910-001",
          title:
            "Distribution",
          description:
            "Vente au Marché Central.",
          date: "2026-09-10"
        }
      ]
    },

    {
      id: "TRACE-002",
      finalProductCode:
        "PF-20260909-002",
      productName:
        "Purée de tomate",
      searchableCodes: [
        "PF-20260909-002",
        "FAB-20260909-002",
        "TOM-20260909-P006-006",
        "P006"
      ],
      nodes: [
        {
          id: "10",
          type: "Producteur",
          code: "P006",
          title:
            "Rakotomalala Eric",
          description:
            "Producteur partenaire.",
          date: "2026-09-09"
        },
        {
          id: "11",
          type: "Lot",
          code:
            "TOM-20260909-P006-006",
          title:
            "Lot de tomates",
          description:
            "295 kg récoltés.",
          date: "2026-09-09"
        },
        {
          id: "12",
          type:
            "Transformation",
          code:
            "FAB-20260909-002",
          title:
            "Transformation en purée",
          description:
            "760 kg en entrée, 540 kg en sortie.",
          date: "2026-09-09"
        },
        {
          id: "13",
          type:
            "Produit fini",
          code:
            "PF-20260909-002",
          title:
            "Purée de tomate",
          description:
            "Lot fini conforme.",
          date: "2026-09-09"
        }
      ]
    }
  ];
