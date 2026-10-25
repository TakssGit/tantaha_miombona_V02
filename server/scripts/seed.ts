import bcrypt from "bcryptjs";

import db from "../src/database/database.js";

const transaction =
  db.transaction(() => {
    const roleInsert =
      db.prepare(`
        INSERT OR IGNORE INTO roles (
          code,
          name
        )
        VALUES (?, ?)
      `);

    [
      ["ADMIN", "Administrateur"],
      [
        "GESTIONNAIRE",
        "Gestionnaire"
      ],
      ["QUALITE", "Qualité"],
      [
        "PRODUCTION",
        "Production"
      ],
      [
        "COMMERCIAL",
        "Commercial"
      ],
      [
        "POINT_FOCAL",
        "Point focal"
      ],
      [
        "PRODUCTEUR",
        "Producteur"
      ],
      [
        "DISTRIBUTEUR",
        "Distributeur"
      ]
    ].forEach(([code, name]) =>
      roleInsert.run(
        code,
        name
      )
    );

    const adminRole =
      db.prepare(`
        SELECT id
        FROM roles
        WHERE code = 'ADMIN'
      `).get() as {
        id: number;
      };

    const passwordHash =
      bcrypt.hashSync(
        "admin123",
        10
      );

    db.prepare(`
      INSERT OR IGNORE INTO users (
        username,
        full_name,
        password_hash,
        role_id,
        active
      )
      VALUES (
        'admin',
        'Administrateur principal',
        ?,
        ?,
        1
      )
    `).run(
      passwordHash,
      adminRole.id
    );

    const producerInsert =
      db.prepare(`
        INSERT OR IGNORE INTO producers (
          code,
          full_name,
          phone,
          commune,
          fokontany,
          cooperative,
          total_delivered_kg,
          status
        )
        VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?
        )
      `);

    const producers = [
      [
        "P001",
        "Rakoto Jean",
        "034 10 111 01",
        "Soavinandriana",
        "Centre",
        "Tantsaha Miombona",
        1250,
        "Actif"
      ],
      [
        "P002",
        "Rasoa Marie",
        "033 20 222 02",
        "Ampefy",
        "Ampefy",
        "Tantsaha Miombona",
        1620,
        "Actif"
      ],
      [
        "P003",
        "Randria Paul",
        "032 30 333 03",
        "Miarinarivo",
        "Nord",
        "Tantsaha Miombona",
        980,
        "Actif"
      ],
      [
        "P004",
        "Rabe Hery",
        "034 40 444 04",
        "Soavinandriana",
        "Est",
        "Tantsaha Miombona",
        1425,
        "Actif"
      ],
      [
        "P005",
        "Ramanana Lala",
        "033 50 555 05",
        "Ampefy",
        "Sud",
        "Tantsaha Miombona",
        870,
        "Actif"
      ],
      [
        "P006",
        "Rakotomalala Eric",
        "032 60 666 06",
        "Miarinarivo",
        "Centre",
        "Tantsaha Miombona",
        1090,
        "Actif"
      ]
    ];

    for (
      const producer
      of producers
    ) {
      producerInsert.run(
        ...producer
      );
    }

    const getProducer =
      db.prepare(`
        SELECT id
        FROM producers
        WHERE code = ?
      `);

    const parcelInsert =
      db.prepare(`
        INSERT OR IGNORE INTO parcels (
          producer_id,
          code,
          location,
          area_ha,
          crop
        )
        VALUES (?, ?, ?, ?, ?)
      `);

    const parcels = [
      [
        "P001",
        "PAR-001",
        "Soavinandriana Centre",
        0.8
      ],
      [
        "P002",
        "PAR-002",
        "Ampefy",
        1.2
      ],
      [
        "P003",
        "PAR-003",
        "Miarinarivo Nord",
        0.65
      ],
      [
        "P004",
        "PAR-004",
        "Soavinandriana Est",
        1.05
      ],
      [
        "P005",
        "PAR-005",
        "Ampefy Sud",
        0.55
      ],
      [
        "P006",
        "PAR-006",
        "Miarinarivo Centre",
        0.9
      ]
    ];

    for (
      const [
        producerCode,
        parcelCode,
        location,
        area
      ] of parcels
    ) {
      const producer =
        getProducer.get(
          producerCode
        ) as {
          id: number;
        };

      parcelInsert.run(
        producer.id,
        parcelCode,
        location,
        area,
        "Tomate"
      );
    }

    const getParcel =
      db.prepare(`
        SELECT id
        FROM parcels
        WHERE code = ?
      `);

    const lotInsert =
      db.prepare(`
        INSERT OR IGNORE INTO harvest_lots (
          code,
          producer_id,
          parcel_id,
          product,
          harvest_date,
          harvest_time,
          quantity_kg,
          crates,
          quality_class,
          status
        )
        VALUES (
          ?, ?, ?, 'Tomate',
          ?, ?, ?, ?, ?, ?
        )
      `);

    const lots = [
      [
        "TOM-20260910-P001-001",
        "P001",
        "PAR-001",
        "2026-09-10",
        "06:20",
        250,
        12,
        "A",
        "Conforme"
      ],
      [
        "TOM-20260910-P002-002",
        "P002",
        "PAR-002",
        "2026-09-10",
        "06:45",
        320,
        16,
        "A",
        "Conforme"
      ],
      [
        "TOM-20260910-P003-003",
        "P003",
        "PAR-003",
        "2026-09-10",
        "07:00",
        180,
        9,
        "B",
        "Conforme"
      ],
      [
        "TOM-20260910-P004-004",
        "P004",
        "PAR-004",
        "2026-09-10",
        "07:15",
        275,
        14,
        "C",
        "Déclassé"
      ],
      [
        "TOM-20260910-P005-005",
        "P005",
        "PAR-005",
        "2026-09-10",
        "07:40",
        210,
        11,
        "REJET",
        "Rejeté"
      ],
      [
        "TOM-20260909-P006-006",
        "P006",
        "PAR-006",
        "2026-09-09",
        "06:10",
        295,
        15,
        "A",
        "Conforme"
      ]
    ];

    for (
      const lot of lots
    ) {
      const [
        code,
        producerCode,
        parcelCode,
        date,
        time,
        quantity,
        crates,
        qualityClass,
        status
      ] = lot;

      const producer =
        getProducer.get(
          producerCode
        ) as {
          id: number;
        };

      const parcel =
        getParcel.get(
          parcelCode
        ) as {
          id: number;
        };

      lotInsert.run(
        code,
        producer.id,
        parcel.id,
        date,
        time,
        quantity,
        crates,
        qualityClass,
        status
      );
    }

    const getLot =
      db.prepare(`
        SELECT id
        FROM harvest_lots
        WHERE code = ?
      `);

    const qualityInsert =
      db.prepare(`
        INSERT INTO quality_checks (
          lot_id,
          maturity,
          color,
          firmness,
          injuries,
          health,
          cleanliness,
          score,
          quality_class,
          decision,
          controller
        )
        VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?
        )
      `);

    const qualityRows = [
      [
        "TOM-20260910-P001-001",
        2, 2, 2, 2, 2, 2,
        12,
        "A",
        "Accepté"
      ],
      [
        "TOM-20260910-P002-002",
        2, 2, 2, 1, 2, 2,
        11,
        "A",
        "Accepté"
      ],
      [
        "TOM-20260910-P003-003",
        2, 1, 1, 1, 2, 1,
        8,
        "B",
        "Accepté"
      ],
      [
        "TOM-20260910-P004-004",
        1, 1, 1, 1, 1, 1,
        6,
        "C",
        "Déclassé"
      ],
      [
        "TOM-20260910-P005-005",
        0, 0, 1, 0, 1, 0,
        2,
        "REJET",
        "Rejeté"
      ]
    ];

    for (
      const row
      of qualityRows
    ) {
      const [
        lotCode,
        maturity,
        color,
        firmness,
        injuries,
        health,
        cleanliness,
        score,
        qualityClass,
        decision
      ] = row;

      const lot =
        getLot.get(
          lotCode
        ) as {
          id: number;
        };

      qualityInsert.run(
        lot.id,
        maturity,
        color,
        firmness,
        injuries,
        health,
        cleanliness,
        score,
        qualityClass,
        decision,
        "Agent qualité"
      );
    }

    const collectionInsert =
      db.prepare(`
        INSERT OR IGNORE INTO collections (
          code,
          lot_id,
          center,
          gross_weight_kg,
          accepted_weight_kg,
          collection_date,
          collection_time,
          status
        )
        VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?
        )
      `);

    [
      [
        "COL-20260910-001",
        "TOM-20260910-P001-001",
        250,
        248
      ],
      [
        "COL-20260910-002",
        "TOM-20260910-P002-002",
        320,
        317
      ],
      [
        "COL-20260910-003",
        "TOM-20260910-P003-003",
        180,
        174
      ]
    ].forEach(
      ([
        code,
        lotCode,
        gross,
        accepted
      ]) => {
        const lot =
          getLot.get(
            lotCode
          ) as {
            id: number;
          };

        collectionInsert.run(
          code,
          lot.id,
          "Centre de collecte principal",
          gross,
          accepted,
          "2026-09-10",
          "08:00",
          "Conforme"
        );
      }
    );

    const transportInsert =
      db.prepare(`
        INSERT OR IGNORE INTO transports (
          code,
          driver,
          vehicle,
          registration,
          transport_date,
          departure,
          arrival,
          duration_hours,
          quantity_kg,
          status
        )
        VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `);

    transportInsert.run(
      "TR-20260910-001",
      "Rakotoarisoa Mamy",
      "Camion léger",
      "1234 TAA",
      "2026-09-10",
      "08:30",
      "11:00",
      2.5,
      750,
      "Terminé"
    );

    transportInsert.run(
      "TR-20260910-002",
      "Razanaka Tovo",
      "Fourgon",
      "5678 TBE",
      "2026-09-10",
      "09:15",
      "18:10",
      8.92,
      275,
      "Délai dépassé"
    );

    const getTransport =
      db.prepare(`
        SELECT id
        FROM transports
        WHERE code = ?
      `);

    const transportLotInsert =
      db.prepare(`
        INSERT OR IGNORE INTO transport_lots (
          transport_id,
          lot_id
        )
        VALUES (?, ?)
      `);

    const transport1 =
      getTransport.get(
        "TR-20260910-001"
      ) as {
        id: number;
      };

    [
      "TOM-20260910-P001-001",
      "TOM-20260910-P002-002",
      "TOM-20260910-P003-003"
    ].forEach(
      (lotCode) => {
        const lot =
          getLot.get(
            lotCode
          ) as {
            id: number;
          };

        transportLotInsert.run(
          transport1.id,
          lot.id
        );
      }
    );

    const receptionInsert =
      db.prepare(`
        INSERT OR IGNORE INTO receptions (
          code,
          lot_id,
          transport_id,
          announced_weight_kg,
          received_weight_kg,
          loss_kg,
          loss_rate,
          decision,
          reception_date
        )
        VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `);

    const receptionLot =
      getLot.get(
        "TOM-20260910-P001-001"
      ) as {
        id: number;
      };

    receptionInsert.run(
      "REC-20260910-001",
      receptionLot.id,
      transport1.id,
      250,
      244,
      6,
      2.4,
      "Accepté",
      "2026-09-10"
    );

    const productInsert =
      db.prepare(`
        INSERT OR IGNORE INTO products (
          code,
          name,
          category,
          unit,
          selling_price_ar,
          active
        )
        VALUES (?, ?, ?, ?, ?, 1)
      `);

    productInsert.run(
      "PRD-001",
      "Sauce tomate",
      "Sauce",
      "Bouteille",
      6500
    );

    productInsert.run(
      "PRD-002",
      "Purée de tomate",
      "Purée",
      "Pot",
      7000
    );

    productInsert.run(
      "PRD-003",
      "Concentré de tomate",
      "Concentré",
      "Pot",
      8500
    );

    const getProduct =
      db.prepare(`
        SELECT id
        FROM products
        WHERE code = ?
      `);

    const sauce =
      getProduct.get(
        "PRD-001"
      ) as {
        id: number;
      };

    const productionInsert =
      db.prepare(`
        INSERT OR IGNORE INTO productions (
          code,
          product_id,
          input_kg,
          output_kg,
          loss_kg,
          yield_rate,
          production_date,
          status
        )
        VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?
        )
      `);

    productionInsert.run(
      "FAB-20260910-001",
      sauce.id,
      750,
      548,
      202,
      73.07,
      "2026-09-10",
      "Terminée"
    );

    const production =
      db.prepare(`
        SELECT id
        FROM productions
        WHERE code = ?
      `).get(
        "FAB-20260910-001"
      ) as {
        id: number;
      };

    const productionInputInsert =
      db.prepare(`
        INSERT OR IGNORE INTO production_inputs (
          production_id,
          lot_id,
          quantity_kg
        )
        VALUES (?, ?, ?)
      `);

    [
      [
        "TOM-20260910-P001-001",
        250
      ],
      [
        "TOM-20260910-P002-002",
        320
      ],
      [
        "TOM-20260910-P003-003",
        180
      ]
    ].forEach(
      ([lotCode, quantity]) => {
        const lot =
          getLot.get(
            lotCode
          ) as {
            id: number;
          };

        productionInputInsert.run(
          production.id,
          lot.id,
          quantity
        );
      }
    );

    const batchInsert =
      db.prepare(`
        INSERT OR IGNORE INTO finished_batches (
          code,
          production_id,
          product_id,
          manufacturing_date,
          quantity,
          unit,
          packaging,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

    batchInsert.run(
      "PF-20260910-001",
      production.id,
      sauce.id,
      "2026-09-10",
      548,
      "kg",
      "Bouteille 500 ml",
      "Conforme"
    );

    const batch =
      db.prepare(`
        SELECT id
        FROM finished_batches
        WHERE code = ?
      `).get(
        "PF-20260910-001"
      ) as {
        id: number;
      };

    db.prepare(`
      INSERT OR IGNORE INTO stock_movements (
        code,
        finished_batch_id,
        movement_type,
        quantity,
        unit,
        reason,
        movement_date
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?
      )
    `).run(
      "MVT-20260910-001",
      batch.id,
      "Entrée",
      548,
      "kg",
      "Fin de fabrication",
      "2026-09-10"
    );

    const customerInsert =
      db.prepare(`
        INSERT OR IGNORE INTO customers (
          code,
          name,
          phone,
          location,
          customer_type,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `);

    customerInsert.run(
      "CLI-001",
      "Marché Central",
      "034 00 100 01",
      "Soavinandriana",
      "Détaillant",
      "Actif"
    );

    customerInsert.run(
      "CLI-002",
      "Auberge du Lac",
      "033 00 100 02",
      "Soavinandriana",
      "Restaurant",
      "Actif"
    );

    customerInsert.run(
      "CLI-003",
      "Distribution Itasy",
      "032 00 100 03",
      "Miarinarivo",
      "Grossiste",
      "Actif"
    );

    const customer =
      db.prepare(`
        SELECT id
        FROM customers
        WHERE code = ?
      `).get(
        "CLI-001"
      ) as {
        id: number;
      };

    db.prepare(`
      INSERT OR IGNORE INTO sales (
        code,
        customer_id,
        sale_date,
        status
      )
      VALUES (?, ?, ?, ?)
    `).run(
      "VTE-20260910-001",
      customer.id,
      "2026-09-10",
      "Payée"
    );

    const sale =
      db.prepare(`
        SELECT id
        FROM sales
        WHERE code = ?
      `).get(
        "VTE-20260910-001"
      ) as {
        id: number;
      };

    db.prepare(`
      INSERT INTO sale_items (
        sale_id,
        product_id,
        finished_batch_id,
        quantity,
        unit_price_ar,
        total_ar
      )
      SELECT ?, ?, ?, ?, ?, ?
      WHERE NOT EXISTS (
        SELECT 1
        FROM sale_items
        WHERE sale_id = ?
      )
    `).run(
      sale.id,
      sauce.id,
      batch.id,
      40,
      6500,
      260000,
      sale.id
    );

    db.prepare(`
      INSERT OR IGNORE INTO stock_movements (
        code,
        finished_batch_id,
        movement_type,
        quantity,
        unit,
        reason,
        movement_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      "MVT-20260910-002",
      batch.id,
      "Sortie",
      40,
      "kg",
      "Vente VTE-20260910-001",
      "2026-09-10"
    );

    const rejectedLot =
      getLot.get(
        "TOM-20260910-P005-005"
      ) as {
        id: number;
      };

    db.prepare(`
      INSERT OR IGNORE INTO non_conformities (
        code,
        lot_id,
        category,
        cause,
        corrective_action,
        responsible,
        nc_date,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      "NC-20260910-001",
      rejectedLot.id,
      "Qualité",
      "Tomates trop mûres",
      "Lot rejeté et producteur informé",
      "Agent qualité",
      "2026-09-10",
      "Résolu"
    );
  });

transaction();

console.log(
  "Données de démonstration insérées."
);

console.log(
  "Compte : admin"
);

console.log(
  "Mot de passe : admin123"
);

db.close();
