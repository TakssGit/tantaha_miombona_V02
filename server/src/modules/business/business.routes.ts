import {
  Router
} from "express";

import db from "../../database/database.js";

const router = Router();

const getSettingNumber = (
  key: string,
  fallback: number
) => {
  const row =
    db.prepare(`
      SELECT setting_value AS value
      FROM settings
      WHERE setting_key = ?
    `).get(key) as
      | {
          value: string;
        }
      | undefined;

  return row
    ? Number(row.value)
    : fallback;
};

const generateSequenceCode = (
  prefix: string,
  date: string,
  table: string
) => {
  const count =
    db.prepare(`
      SELECT COUNT(*) AS count
      FROM ${table}
    `).get() as {
      count: number;
    };

  return `${prefix}-${date.replace(/-/g, "")}-${String(
    count.count + 1
  ).padStart(3, "0")}`;
};

router.get(
  "/producers",
  (_req, res) => {
    const rows =
      db.prepare(`
        SELECT
          CAST(id AS TEXT) AS id,
          code,
          full_name AS fullName,
          phone,
          commune,
          fokontany,
          cooperative,
          total_delivered_kg AS totalDeliveredKg,
          status
        FROM producers
        ORDER BY id DESC
      `).all();

    res.json(rows);
  }
);

router.post(
  "/producers",
  (
    req,
    res
  ) => {
    const {
      fullName,
      phone = "",
      commune = "",
      fokontany = "",
      cooperative =
        "Tantsaha Miombona"
    } = req.body;

    const count =
      db.prepare(`
        SELECT COUNT(*) AS count
        FROM producers
      `).get() as {
        count: number;
      };

    const code =
      `P${String(
        count.count + 1
      ).padStart(3, "0")}`;

    const result =
      db.prepare(`
        INSERT INTO producers (
          code,
          full_name,
          phone,
          commune,
          fokontany,
          cooperative,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, 'Actif')
      `).run(
        code,
        fullName,
        phone,
        commune,
        fokontany,
        cooperative
      );

    res.status(201).json({
      id:
        String(
          result.lastInsertRowid
        ),
      code,
      fullName,
      phone,
      commune,
      fokontany,
      cooperative,
      totalDeliveredKg: 0,
      status: "Actif"
    });
  }
);

router.put(
  "/producers/:id",
  (
    req,
    res
  ) => {
    const {
      fullName,
      phone,
      commune,
      fokontany,
      cooperative
    } = req.body;

    db.prepare(`
      UPDATE producers
      SET
        full_name = ?,
        phone = ?,
        commune = ?,
        fokontany = ?,
        cooperative = ?
      WHERE id = ?
    `).run(
      fullName,
      phone,
      commune,
      fokontany,
      cooperative,
      req.params.id
    );

    res.json({
      success: true
    });
  }
);

router.patch(
  "/producers/:id/toggle",
  (
    req,
    res
  ) => {
    db.prepare(`
      UPDATE producers
      SET status =
        CASE
          WHEN status = 'Actif'
          THEN 'Archivé'
          ELSE 'Actif'
        END
      WHERE id = ?
    `).run(
      req.params.id
    );

    res.json({
      success: true
    });
  }
);

router.get(
  "/parcels",
  (_req, res) => {
    res.json(
      db.prepare(`
        SELECT
          CAST(p.id AS TEXT) AS id,
          CAST(p.producer_id AS TEXT) AS producerId,
          p.code,
          p.location,
          p.area_ha AS areaHa,
          p.crop
        FROM parcels p
        ORDER BY p.id DESC
      `).all()
    );
  }
);

router.post(
  "/parcels",
  (
    req,
    res
  ) => {
    const {
      producerId,
      location,
      areaHa,
      crop = "Tomate"
    } = req.body;

    const count =
      db.prepare(`
        SELECT COUNT(*) AS count
        FROM parcels
      `).get() as {
        count: number;
      };

    const code =
      `PAR-${String(
        count.count + 1
      ).padStart(3, "0")}`;

    const result =
      db.prepare(`
        INSERT INTO parcels (
          producer_id,
          code,
          location,
          area_ha,
          crop
        )
        VALUES (?, ?, ?, ?, ?)
      `).run(
        producerId,
        code,
        location,
        Number(areaHa),
        crop
      );

    res.status(201).json({
      id:
        String(
          result.lastInsertRowid
        ),
      producerId:
        String(producerId),
      code,
      location,
      areaHa:
        Number(areaHa),
      crop
    });
  }
);

router.get(
  "/lots",
  (_req, res) => {
    res.json(
      db.prepare(`
        SELECT
          CAST(l.id AS TEXT) AS id,
          l.code,
          p.code AS producerCode,
          p.full_name AS producerName,
          COALESCE(pa.code, '') AS parcelCode,
          l.product,
          l.harvest_date AS harvestDate,
          l.harvest_time AS harvestTime,
          l.quantity_kg AS quantityKg,
          l.crates,
          l.quality_class AS qualityClass,
          l.status
        FROM harvest_lots l
        INNER JOIN producers p
          ON p.id = l.producer_id
        LEFT JOIN parcels pa
          ON pa.id = l.parcel_id
        ORDER BY l.id DESC
      `).all()
    );
  }
);

router.post(
  "/lots",
  (
    req,
    res
  ) => {
    const {
      producerCode,
      parcelCode,
      product = "Tomate",
      harvestDate,
      harvestTime = "",
      quantityKg,
      crates = 0
    } = req.body;

    const producer =
      db.prepare(`
        SELECT id, full_name AS fullName
        FROM producers
        WHERE code = ?
      `).get(
        producerCode
      ) as {
        id: number;
        fullName: string;
      };

    const parcel =
      parcelCode
        ? db.prepare(`
            SELECT id
            FROM parcels
            WHERE code = ?
          `).get(
            parcelCode
          ) as
            | {
                id: number;
              }
            | undefined
        : undefined;

    const count =
      db.prepare(`
        SELECT COUNT(*) AS count
        FROM harvest_lots
      `).get() as {
        count: number;
      };

    const code =
      `TOM-${harvestDate.replace(/-/g, "")}-${producerCode}-${String(
        count.count + 1
      ).padStart(3, "0")}`;

    const result =
      db.prepare(`
        INSERT INTO harvest_lots (
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
          ?, ?, ?, ?, ?, ?, ?, ?,
          'NON_CLASSE',
          'En attente'
        )
      `).run(
        code,
        producer.id,
        parcel?.id || null,
        product,
        harvestDate,
        harvestTime,
        Number(quantityKg),
        Number(crates)
      );

    db.prepare(`
      UPDATE producers
      SET total_delivered_kg =
        total_delivered_kg + ?
      WHERE id = ?
    `).run(
      Number(quantityKg),
      producer.id
    );

    res.status(201).json({
      id:
        String(
          result.lastInsertRowid
        ),
      code,
      producerCode,
      producerName:
        producer.fullName,
      parcelCode:
        parcelCode || "",
      product,
      harvestDate,
      harvestTime,
      quantityKg:
        Number(quantityKg),
      crates:
        Number(crates),
      qualityClass:
        "NON_CLASSE",
      status:
        "En attente"
    });
  }
);

router.get(
  "/quality-checks",
  (_req, res) => {
    res.json(
      db.prepare(`
        SELECT
          CAST(q.id AS TEXT) AS id,
          l.code AS lotCode,
          q.maturity,
          q.color,
          q.firmness,
          q.injuries,
          q.health,
          q.cleanliness,
          q.score,
          q.quality_class AS qualityClass,
          q.decision,
          q.controller
        FROM quality_checks q
        INNER JOIN harvest_lots l
          ON l.id = q.lot_id
        ORDER BY q.id DESC
      `).all()
    );
  }
);

router.post(
  "/quality-checks",
  (
    req,
    res
  ) => {
    const {
      lotCode,
      maturity,
      color,
      firmness,
      injuries,
      health,
      cleanliness,
      controller =
        "Administrateur"
    } = req.body;

    const lot =
      db.prepare(`
        SELECT id
        FROM harvest_lots
        WHERE code = ?
      `).get(
        lotCode
      ) as {
        id: number;
      };

    const score =
      Number(maturity) +
      Number(color) +
      Number(firmness) +
      Number(injuries) +
      Number(health) +
      Number(cleanliness);

    let qualityClass =
      "REJET";

    if (score >= 10) {
      qualityClass = "A";
    } else if (
      score >= 7
    ) {
      qualityClass = "B";
    } else if (
      score >= 4
    ) {
      qualityClass = "C";
    }

    const decision =
      qualityClass ===
      "REJET"
        ? "Rejeté"
        : qualityClass ===
            "C"
          ? "Déclassé"
          : "Accepté";

    const result =
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
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `).run(
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
        controller
      );

    db.prepare(`
      UPDATE harvest_lots
      SET
        quality_class = ?,
        status = ?
      WHERE id = ?
    `).run(
      qualityClass,
      decision ===
      "Accepté"
        ? "Conforme"
        : decision,
      lot.id
    );

    res.status(201).json({
      id:
        String(
          result.lastInsertRowid
        ),
      lotCode,
      maturity,
      color,
      firmness,
      injuries,
      health,
      cleanliness,
      score,
      qualityClass,
      decision,
      controller
    });
  }
);

router.get(
  "/collections",
  (_req, res) => {
    res.json(
      db.prepare(`
        SELECT
          CAST(c.id AS TEXT) AS id,
          c.code,
          l.code AS lotCode,
          c.center,
          c.gross_weight_kg AS grossWeightKg,
          c.accepted_weight_kg AS acceptedWeightKg,
          c.collection_date AS date,
          c.collection_time AS time,
          c.status
        FROM collections c
        INNER JOIN harvest_lots l
          ON l.id = c.lot_id
        ORDER BY c.id DESC
      `).all()
    );
  }
);

router.post(
  "/collections",
  (
    req,
    res
  ) => {
    const {
      lotCode,
      center,
      grossWeightKg,
      acceptedWeightKg,
      date,
      time
    } = req.body;

    const lot =
      db.prepare(`
        SELECT id
        FROM harvest_lots
        WHERE code = ?
      `).get(
        lotCode
      ) as {
        id: number;
      };

    const code =
      generateSequenceCode(
        "COL",
        date,
        "collections"
      );

    const status =
      Number(
        acceptedWeightKg
      ) >=
      Number(grossWeightKg) *
        0.9
        ? "Conforme"
        : "À vérifier";

    const result =
      db.prepare(`
        INSERT INTO collections (
          code,
          lot_id,
          center,
          gross_weight_kg,
          accepted_weight_kg,
          collection_date,
          collection_time,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        code,
        lot.id,
        center,
        grossWeightKg,
        acceptedWeightKg,
        date,
        time,
        status
      );

    res.status(201).json({
      id:
        String(
          result.lastInsertRowid
        ),
      code,
      lotCode,
      center,
      grossWeightKg:
        Number(grossWeightKg),
      acceptedWeightKg:
        Number(
          acceptedWeightKg
        ),
      date,
      time,
      status
    });
  }
);

router.get(
  "/transports",
  (_req, res) => {
    const transports =
      db.prepare(`
        SELECT
          CAST(t.id AS TEXT) AS id,
          t.code,
          t.driver,
          t.vehicle,
          t.registration,
          t.transport_date AS date,
          t.departure,
          t.arrival,
          t.duration_hours AS durationHours,
          t.quantity_kg AS quantityKg,
          t.status
        FROM transports t
        ORDER BY t.id DESC
      `).all() as Array<
        Record<
          string,
          unknown
        >
      >;

    const lotQuery =
      db.prepare(`
        SELECT l.code
        FROM transport_lots tl
        INNER JOIN harvest_lots l
          ON l.id = tl.lot_id
        WHERE tl.transport_id = ?
      `);

    res.json(
      transports.map(
        (transport) => ({
          ...transport,
          lotCodes:
            lotQuery
              .all(
                Number(
                  transport.id
                )
              )
              .map(
                (
                  row: any
                ) =>
                  row.code
              )
        })
      )
    );
  }
);

router.post(
  "/transports",
  (
    req,
    res
  ) => {
    const {
      driver,
      vehicle,
      registration,
      date,
      departure,
      arrival,
      quantityKg,
      lotCodes = []
    } = req.body;

    const [
      dh,
      dm
    ] =
      departure
        .split(":")
        .map(Number);

    const [
      ah,
      am
    ] =
      arrival
        .split(":")
        .map(Number);

    let start =
      dh * 60 + dm;

    let end =
      ah * 60 + am;

    if (end < start) {
      end += 1440;
    }

    const durationHours =
      Number(
        (
          (end - start) /
          60
        ).toFixed(2)
      );

    const limit =
      getSettingNumber(
        "targetTransportHours",
        8
      );

    const status =
      durationHours >
      limit
        ? "Délai dépassé"
        : "Terminé";

    const code =
      generateSequenceCode(
        "TR",
        date,
        "transports"
      );

    const transaction =
      db.transaction(() => {
        const result =
          db.prepare(`
            INSERT INTO transports (
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
          `).run(
            code,
            driver,
            vehicle,
            registration,
            date,
            departure,
            arrival,
            durationHours,
            quantityKg,
            status
          );

        const transportId =
          Number(
            result.lastInsertRowid
          );

        const getLot =
          db.prepare(`
            SELECT id
            FROM harvest_lots
            WHERE code = ?
          `);

        const insertLink =
          db.prepare(`
            INSERT INTO transport_lots (
              transport_id,
              lot_id
            )
            VALUES (?, ?)
          `);

        for (
          const lotCode
          of lotCodes
        ) {
          const lot =
            getLot.get(
              lotCode
            ) as
              | {
                  id: number;
                }
              | undefined;

          if (lot) {
            insertLink.run(
              transportId,
              lot.id
            );

            db.prepare(`
              UPDATE harvest_lots
              SET status = 'En transport'
              WHERE id = ?
            `).run(
              lot.id
            );
          }
        }

        return transportId;
      });

    const id =
      transaction();

    res.status(201).json({
      id:
        String(id),
      code,
      driver,
      vehicle,
      registration,
      date,
      departure,
      arrival,
      durationHours,
      quantityKg:
        Number(quantityKg),
      lotCodes,
      status
    });
  }
);

router.get(
  "/receptions",
  (_req, res) => {
    res.json(
      db.prepare(`
        SELECT
          CAST(r.id AS TEXT) AS id,
          r.code,
          l.code AS lotCode,
          COALESCE(t.code, '') AS transportCode,
          r.announced_weight_kg AS announcedWeightKg,
          r.received_weight_kg AS receivedWeightKg,
          r.loss_kg AS lossKg,
          r.loss_rate AS lossRate,
          r.decision,
          r.reception_date AS date
        FROM receptions r
        INNER JOIN harvest_lots l
          ON l.id = r.lot_id
        LEFT JOIN transports t
          ON t.id = r.transport_id
        ORDER BY r.id DESC
      `).all()
    );
  }
);

router.post(
  "/receptions",
  (
    req,
    res
  ) => {
    const {
      lotCode,
      transportCode,
      announcedWeightKg,
      receivedWeightKg,
      decision,
      date
    } = req.body;

    const lot =
      db.prepare(`
        SELECT id
        FROM harvest_lots
        WHERE code = ?
      `).get(
        lotCode
      ) as {
        id: number;
      };

    const transport =
      transportCode
        ? db.prepare(`
            SELECT id
            FROM transports
            WHERE code = ?
          `).get(
            transportCode
          ) as
            | {
                id: number;
              }
            | undefined
        : undefined;

    const announced =
      Number(
        announcedWeightKg
      );

    const received =
      Number(
        receivedWeightKg
      );

    const lossKg =
      Math.max(
        0,
        announced - received
      );

    const lossRate =
      announced > 0
        ? Number(
            (
              lossKg /
              announced *
              100
            ).toFixed(2)
          )
        : 0;

    const code =
      generateSequenceCode(
        "REC",
        date,
        "receptions"
      );

    const result =
      db.prepare(`
        INSERT INTO receptions (
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
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        code,
        lot.id,
        transport?.id || null,
        announced,
        received,
        lossKg,
        lossRate,
        decision,
        date
      );

    db.prepare(`
      UPDATE harvest_lots
      SET status = ?
      WHERE id = ?
    `).run(
      decision ===
      "Accepté"
        ? "Conforme"
        : decision,
      lot.id
    );

    res.status(201).json({
      id:
        String(
          result.lastInsertRowid
        ),
      code,
      lotCode,
      transportCode,
      announcedWeightKg:
        announced,
      receivedWeightKg:
        received,
      lossKg,
      lossRate,
      decision,
      date
    });
  }
);

router.get(
  "/products",
  (_req, res) => {
    res.json(
      db.prepare(`
        SELECT
          CAST(id AS TEXT) AS id,
          code,
          name,
          category,
          unit,
          selling_price_ar AS sellingPriceAr,
          CASE
            WHEN active = 1
            THEN 1
            ELSE 0
          END AS active
        FROM products
        ORDER BY id DESC
      `).all()
    );
  }
);

router.post(
  "/products",
  (
    req,
    res
  ) => {
    const {
      name,
      category = "",
      unit = "Unité",
      sellingPriceAr = 0
    } = req.body;

    const count =
      db.prepare(`
        SELECT COUNT(*) AS count
        FROM products
      `).get() as {
        count: number;
      };

    const code =
      `PRD-${String(
        count.count + 1
      ).padStart(3, "0")}`;

    const result =
      db.prepare(`
        INSERT INTO products (
          code,
          name,
          category,
          unit,
          selling_price_ar,
          active
        )
        VALUES (?, ?, ?, ?, ?, 1)
      `).run(
        code,
        name,
        category,
        unit,
        sellingPriceAr
      );

    res.status(201).json({
      id:
        String(
          result.lastInsertRowid
        ),
      code,
      name,
      category,
      unit,
      sellingPriceAr:
        Number(sellingPriceAr),
      active: true
    });
  }
);

router.get(
  "/productions",
  (_req, res) => {
    const rows =
      db.prepare(`
        SELECT
          CAST(pr.id AS TEXT) AS id,
          pr.code,
          p.name AS productName,
          pr.input_kg AS inputKg,
          pr.output_kg AS outputKg,
          pr.loss_kg AS lossKg,
          pr.yield_rate AS yieldRate,
          pr.production_date AS date,
          pr.status
        FROM productions pr
        INNER JOIN products p
          ON p.id = pr.product_id
        ORDER BY pr.id DESC
      `).all() as any[];

    const inputQuery =
      db.prepare(`
        SELECT l.code
        FROM production_inputs pi
        INNER JOIN harvest_lots l
          ON l.id = pi.lot_id
        WHERE pi.production_id = ?
      `);

    res.json(
      rows.map(
        (row) => ({
          ...row,
          inputLots:
            inputQuery
              .all(
                Number(row.id)
              )
              .map(
                (item: any) =>
                  item.code
              )
        })
      )
    );
  }
);

router.post(
  "/productions",
  (
    req,
    res
  ) => {
    const {
      productName,
      inputLotCodes = [],
      inputKg,
      outputKg,
      date,
      status =
        "Terminée"
    } = req.body;

    const product =
      db.prepare(`
        SELECT id
        FROM products
        WHERE name = ?
      `).get(
        productName
      ) as {
        id: number;
      };

    const input =
      Number(inputKg);

    const output =
      Number(outputKg);

    const lossKg =
      Math.max(
        0,
        input - output
      );

    const yieldRate =
      input > 0
        ? Number(
            (
              output /
              input *
              100
            ).toFixed(2)
          )
        : 0;

    const code =
      generateSequenceCode(
        "FAB",
        date,
        "productions"
      );

    const transaction =
      db.transaction(() => {
        const result =
          db.prepare(`
            INSERT INTO productions (
              code,
              product_id,
              input_kg,
              output_kg,
              loss_kg,
              yield_rate,
              production_date,
              status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            code,
            product.id,
            input,
            output,
            lossKg,
            yieldRate,
            date,
            status
          );

        const productionId =
          Number(
            result.lastInsertRowid
          );

        const getLot =
          db.prepare(`
            SELECT id, quantity_kg AS quantityKg
            FROM harvest_lots
            WHERE code = ?
          `);

        const insertInput =
          db.prepare(`
            INSERT INTO production_inputs (
              production_id,
              lot_id,
              quantity_kg
            )
            VALUES (?, ?, ?)
          `);

        for (
          const lotCode
          of inputLotCodes
        ) {
          const lot =
            getLot.get(
              lotCode
            ) as
              | {
                  id: number;
                  quantityKg: number;
                }
              | undefined;

          if (lot) {
            insertInput.run(
              productionId,
              lot.id,
              lot.quantityKg
            );
          }
        }

        return productionId;
      });

    const id =
      transaction();

    res.status(201).json({
      id:
        String(id),
      code,
      productName,
      inputLots:
        inputLotCodes,
      inputKg: input,
      outputKg: output,
      lossKg,
      yieldRate,
      date,
      status
    });
  }
);

router.get(
  "/finished-batches",
  (_req, res) => {
    res.json(
      db.prepare(`
        SELECT
          CAST(f.id AS TEXT) AS id,
          f.code,
          pr.code AS productionCode,
          p.code AS productCode,
          p.name AS productName,
          f.manufacturing_date AS manufacturingDate,
          f.quantity,
          f.unit,
          f.packaging,
          f.status
        FROM finished_batches f
        INNER JOIN productions pr
          ON pr.id = f.production_id
        INNER JOIN products p
          ON p.id = f.product_id
        ORDER BY f.id DESC
      `).all()
    );
  }
);

router.post(
  "/finished-batches",
  (
    req,
    res
  ) => {
    const {
      productionCode,
      productCode,
      date,
      quantity,
      unit = "kg",
      packaging = "",
      status =
        "Conforme"
    } = req.body;

    const production =
      db.prepare(`
        SELECT id
        FROM productions
        WHERE code = ?
      `).get(
        productionCode
      ) as {
        id: number;
      };

    const product =
      db.prepare(`
        SELECT id, name
        FROM products
        WHERE code = ?
      `).get(
        productCode
      ) as {
        id: number;
        name: string;
      };

    const code =
      generateSequenceCode(
        "PF",
        date,
        "finished_batches"
      );

    const transaction =
      db.transaction(() => {
        const result =
          db.prepare(`
            INSERT INTO finished_batches (
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
          `).run(
            code,
            production.id,
            product.id,
            date,
            quantity,
            unit,
            packaging,
            status
          );

        const batchId =
          Number(
            result.lastInsertRowid
          );

        const movementCode =
          generateSequenceCode(
            "MVT",
            date,
            "stock_movements"
          );

        db.prepare(`
          INSERT INTO stock_movements (
            code,
            finished_batch_id,
            movement_type,
            quantity,
            unit,
            reason,
            movement_date
          )
          VALUES (
            ?, ?, 'Entrée', ?, ?, ?, ?
          )
        `).run(
          movementCode,
          batchId,
          quantity,
          unit,
          "Fin de fabrication",
          date
        );

        return batchId;
      });

    const id =
      transaction();

    res.status(201).json({
      id:
        String(id),
      code,
      productionCode,
      productCode,
      productName:
        product.name,
      manufacturingDate:
        date,
      quantity:
        Number(quantity),
      unit,
      packaging,
      status
    });
  }
);

router.get(
  "/stocks",
  (_req, res) => {
    const rows =
      db.prepare(`
        SELECT
          CAST(f.id AS TEXT) AS id,
          p.code AS productCode,
          p.name AS productName,
          f.code AS finishedLotCode,

          COALESCE(
            SUM(
              CASE
                WHEN sm.movement_type = 'Entrée'
                THEN sm.quantity
                ELSE 0
              END
            ),
            0
          ) AS inputQuantity,

          COALESCE(
            SUM(
              CASE
                WHEN sm.movement_type = 'Sortie'
                THEN sm.quantity
                ELSE 0
              END
            ),
            0
          ) AS outputQuantity,

          COALESCE(
            SUM(
              CASE
                WHEN sm.movement_type = 'Entrée'
                THEN sm.quantity
                ELSE -sm.quantity
              END
            ),
            0
          ) AS availableQuantity,

          f.unit,

          100 AS minimumQuantity

        FROM finished_batches f

        INNER JOIN products p
          ON p.id = f.product_id

        LEFT JOIN stock_movements sm
          ON sm.finished_batch_id = f.id

        GROUP BY f.id

        ORDER BY f.id DESC
      `).all() as any[];

    res.json(
      rows.map(
        (row) => ({
          ...row,
          status:
            row.availableQuantity <= 0
              ? "Stock épuisé"
              : row.availableQuantity <=
                  row.minimumQuantity
                ? "Stock faible"
                : "Disponible"
        })
      )
    );
  }
);

router.get(
  "/stock-movements",
  (_req, res) => {
    res.json(
      db.prepare(`
        SELECT
          CAST(sm.id AS TEXT) AS id,
          sm.code,
          f.code AS finishedLotCode,
          p.name AS productName,
          sm.movement_type AS type,
          sm.quantity,
          sm.unit,
          sm.reason,
          sm.movement_date AS date
        FROM stock_movements sm
        INNER JOIN finished_batches f
          ON f.id = sm.finished_batch_id
        INNER JOIN products p
          ON p.id = f.product_id
        ORDER BY sm.id DESC
      `).all()
    );
  }
);

router.post(
  "/stock-movements",
  (
    req,
    res
  ) => {
    const {
      finishedLotCode,
      type,
      quantity,
      reason,
      date
    } = req.body;

    const batch =
      db.prepare(`
        SELECT
          f.id,
          f.unit,
          p.name AS productName
        FROM finished_batches f
        INNER JOIN products p
          ON p.id = f.product_id
        WHERE f.code = ?
      `).get(
        finishedLotCode
      ) as {
        id: number;
        unit: string;
        productName: string;
      };

    if (
      type === "Sortie"
    ) {
      const stock =
        db.prepare(`
          SELECT
            COALESCE(
              SUM(
                CASE
                  WHEN movement_type = 'Entrée'
                  THEN quantity
                  ELSE -quantity
                END
              ),
              0
            ) AS available
          FROM stock_movements
          WHERE finished_batch_id = ?
        `).get(
          batch.id
        ) as {
          available: number;
        };

      if (
        Number(quantity) >
        stock.available
      ) {
        res.status(400).json({
          message:
            "Stock insuffisant."
        });

        return;
      }
    }

    const code =
      generateSequenceCode(
        "MVT",
        date,
        "stock_movements"
      );

    const result =
      db.prepare(`
        INSERT INTO stock_movements (
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
        code,
        batch.id,
        type,
        quantity,
        batch.unit,
        reason,
        date
      );

    res.status(201).json({
      id:
        String(
          result.lastInsertRowid
        ),
      code,
      finishedLotCode,
      productName:
        batch.productName,
      type,
      quantity:
        Number(quantity),
      unit:
        batch.unit,
      reason,
      date
    });
  }
);

router.get(
  "/customers",
  (_req, res) => {
    res.json(
      db.prepare(`
        SELECT
          CAST(id AS TEXT) AS id,
          code,
          name,
          phone,
          location,
          customer_type AS type,
          status
        FROM customers
        ORDER BY id DESC
      `).all()
    );
  }
);

router.post(
  "/customers",
  (
    req,
    res
  ) => {
    const {
      name,
      phone = "",
      location = "",
      type =
        "Détaillant"
    } = req.body;

    const count =
      db.prepare(`
        SELECT COUNT(*) AS count
        FROM customers
      `).get() as {
        count: number;
      };

    const code =
      `CLI-${String(
        count.count + 1
      ).padStart(3, "0")}`;

    const result =
      db.prepare(`
        INSERT INTO customers (
          code,
          name,
          phone,
          location,
          customer_type,
          status
        )
        VALUES (?, ?, ?, ?, ?, 'Actif')
      `).run(
        code,
        name,
        phone,
        location,
        type
      );

    res.status(201).json({
      id:
        String(
          result.lastInsertRowid
        ),
      code,
      name,
      phone,
      location,
      type,
      status:
        "Actif"
    });
  }
);

router.put(
  "/customers/:id",
  (
    req,
    res
  ) => {
    const {
      name,
      phone,
      location,
      type
    } = req.body;

    db.prepare(`
      UPDATE customers
      SET
        name = ?,
        phone = ?,
        location = ?,
        customer_type = ?
      WHERE id = ?
    `).run(
      name,
      phone,
      location,
      type,
      req.params.id
    );

    res.json({
      success: true
    });
  }
);

router.patch(
  "/customers/:id/toggle",
  (
    req,
    res
  ) => {
    db.prepare(`
      UPDATE customers
      SET status =
        CASE
          WHEN status = 'Actif'
          THEN 'Archivé'
          ELSE 'Actif'
        END
      WHERE id = ?
    `).run(
      req.params.id
    );

    res.json({
      success: true
    });
  }
);

router.get(
  "/sales",
  (_req, res) => {
    res.json(
      db.prepare(`
        SELECT
          CAST(si.id AS TEXT) AS id,
          s.code,
          c.code AS customerCode,
          c.name AS customerName,
          p.name AS productName,
          COALESCE(f.code, '') AS finishedLotCode,
          si.quantity,
          si.unit_price_ar AS unitPriceAr,
          si.total_ar AS totalAr,
          s.sale_date AS date,
          s.status
        FROM sale_items si
        INNER JOIN sales s
          ON s.id = si.sale_id
        INNER JOIN customers c
          ON c.id = s.customer_id
        INNER JOIN products p
          ON p.id = si.product_id
        LEFT JOIN finished_batches f
          ON f.id = si.finished_batch_id
        ORDER BY s.id DESC
      `).all()
    );
  }
);

router.post(
  "/sales",
  (
    req,
    res
  ) => {
    const {
      customerCode,
      productCode,
      finishedLotCode,
      quantity,
      unitPriceAr,
      date,
      status =
        "Payée"
    } = req.body;

    const customer =
      db.prepare(`
        SELECT id, name
        FROM customers
        WHERE code = ?
      `).get(
        customerCode
      ) as {
        id: number;
        name: string;
      };

    const product =
      db.prepare(`
        SELECT id, name
        FROM products
        WHERE code = ?
      `).get(
        productCode
      ) as {
        id: number;
        name: string;
      };

    const batch =
      finishedLotCode
        ? db.prepare(`
            SELECT id, unit
            FROM finished_batches
            WHERE code = ?
          `).get(
            finishedLotCode
          ) as
            | {
                id: number;
                unit: string;
              }
            | undefined
        : undefined;

    if (batch) {
      const available =
        db.prepare(`
          SELECT
            COALESCE(
              SUM(
                CASE
                  WHEN movement_type = 'Entrée'
                  THEN quantity
                  ELSE -quantity
                END
              ),
              0
            ) AS value
          FROM stock_movements
          WHERE finished_batch_id = ?
        `).get(
          batch.id
        ) as {
          value: number;
        };

      if (
        Number(quantity) >
        available.value
      ) {
        res.status(400).json({
          message:
            "Stock insuffisant pour cette vente."
        });

        return;
      }
    }

    const code =
      generateSequenceCode(
        "VTE",
        date,
        "sales"
      );

    const totalAr =
      Number(quantity) *
      Number(unitPriceAr);

    const transaction =
      db.transaction(() => {
        const sale =
          db.prepare(`
            INSERT INTO sales (
              code,
              customer_id,
              sale_date,
              status
            )
            VALUES (?, ?, ?, ?)
          `).run(
            code,
            customer.id,
            date,
            status
          );

        const saleId =
          Number(
            sale.lastInsertRowid
          );

        const item =
          db.prepare(`
            INSERT INTO sale_items (
              sale_id,
              product_id,
              finished_batch_id,
              quantity,
              unit_price_ar,
              total_ar
            )
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(
            saleId,
            product.id,
            batch?.id || null,
            quantity,
            unitPriceAr,
            totalAr
          );

        if (batch) {
          const movementCode =
            generateSequenceCode(
              "MVT",
              date,
              "stock_movements"
            );

          db.prepare(`
            INSERT INTO stock_movements (
              code,
              finished_batch_id,
              movement_type,
              quantity,
              unit,
              reason,
              movement_date
            )
            VALUES (
              ?, ?, 'Sortie', ?, ?, ?, ?
            )
          `).run(
            movementCode,
            batch.id,
            quantity,
            batch.unit,
            `Vente ${code}`,
            date
          );
        }

        return item.lastInsertRowid;
      });

    const id =
      transaction();

    res.status(201).json({
      id:
        String(id),
      code,
      customerCode,
      customerName:
        customer.name,
      productName:
        product.name,
      finishedLotCode:
        finishedLotCode || "",
      quantity:
        Number(quantity),
      unitPriceAr:
        Number(unitPriceAr),
      totalAr,
      date,
      status
    });
  }
);

router.get(
  "/non-conformities",
  (_req, res) => {
    res.json(
      db.prepare(`
        SELECT
          CAST(n.id AS TEXT) AS id,
          n.code,
          COALESCE(l.code, '') AS lotCode,
          n.category,
          n.cause,
          n.corrective_action AS correctiveAction,
          n.responsible,
          n.nc_date AS date,
          n.status
        FROM non_conformities n
        LEFT JOIN harvest_lots l
          ON l.id = n.lot_id
        ORDER BY n.id DESC
      `).all()
    );
  }
);

router.post(
  "/non-conformities",
  (
    req,
    res
  ) => {
    const {
      lotCode,
      category,
      cause,
      correctiveAction = "",
      responsible = "",
      date,
      status = "Ouvert"
    } = req.body;

    const lot =
      lotCode
        ? db.prepare(`
            SELECT id
            FROM harvest_lots
            WHERE code = ?
          `).get(
            lotCode
          ) as
            | {
                id: number;
              }
            | undefined
        : undefined;

    const code =
      generateSequenceCode(
        "NC",
        date,
        "non_conformities"
      );

    const result =
      db.prepare(`
        INSERT INTO non_conformities (
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
        code,
        lot?.id || null,
        category,
        cause,
        correctiveAction,
        responsible,
        date,
        status
      );

    res.status(201).json({
      id:
        String(
          result.lastInsertRowid
        ),
      code,
      lotCode,
      category,
      cause,
      correctiveAction,
      responsible,
      date,
      status
    });
  }
);

router.patch(
  "/non-conformities/:id/resolve",
  (
    req,
    res
  ) => {
    db.prepare(`
      UPDATE non_conformities
      SET status = 'Résolu'
      WHERE id = ?
    `).run(
      req.params.id
    );

    res.json({
      success: true
    });
  }
);

router.get(
  "/settings",
  (_req, res) => {
    const rows =
      db.prepare(`
        SELECT
          setting_key AS key,
          setting_value AS value
        FROM settings
      `).all() as Array<{
        key: string;
        value: string;
      }>;

    const result:
      Record<
        string,
        string | number
      > = {};

    for (
      const row
      of rows
    ) {
      if (
        [
          "targetTransportHours",
          "maximumLossRate",
          "targetConformityRate",
          "targetYieldRate"
        ].includes(row.key)
      ) {
        result[row.key] =
          Number(row.value);
      } else {
        result[row.key] =
          row.value;
      }
    }

    res.json(result);
  }
);

router.put(
  "/settings",
  (
    req,
    res
  ) => {
    const statement =
      db.prepare(`
        INSERT INTO settings (
          setting_key,
          setting_value
        )
        VALUES (?, ?)
        ON CONFLICT(setting_key)
        DO UPDATE SET
          setting_value =
            excluded.setting_value
      `);

    const transaction =
      db.transaction(() => {
        for (
          const [
            key,
            value
          ] of Object.entries(
            req.body
          )
        ) {
          statement.run(
            key,
            String(value)
          );
        }
      });

    transaction();

    res.json({
      success: true
    });
  }
);

router.get(
  "/dashboard",
  (_req, res) => {
    const producers =
      db.prepare(`
        SELECT COUNT(*) AS value
        FROM producers
        WHERE status = 'Actif'
      `).get() as {
        value: number;
      };

    const lots =
      db.prepare(`
        SELECT
          COUNT(*) AS count,
          COALESCE(
            SUM(quantity_kg),
            0
          ) AS quantity
        FROM harvest_lots
      `).get() as {
        count: number;
        quantity: number;
      };

    const quality =
      db.prepare(`
        SELECT
          COUNT(*) AS total,
          SUM(
            CASE
              WHEN quality_class
                IN ('A', 'B')
              THEN 1
              ELSE 0
            END
          ) AS conform
        FROM quality_checks
      `).get() as {
        total: number;
        conform: number;
      };

    const losses =
      db.prepare(`
        SELECT
          COALESCE(
            AVG(loss_rate),
            0
          ) AS value
        FROM receptions
      `).get() as {
        value: number;
      };

    const yieldValue =
      db.prepare(`
        SELECT
          COALESCE(
            AVG(yield_rate),
            0
          ) AS value
        FROM productions
      `).get() as {
        value: number;
      };

    const quantityEvolution =
      db.prepare(`
        SELECT
          harvest_date AS period,
          ROUND(
            SUM(quantity_kg),
            2
          ) AS quantity
        FROM harvest_lots
        GROUP BY harvest_date
        ORDER BY harvest_date
        LIMIT 10
      `).all();

    const qualityDistribution =
      db.prepare(`
        SELECT
          quality_class AS name,
          COUNT(*) AS value
        FROM quality_checks
        GROUP BY quality_class
      `).all();

    const lossEvolution =
      db.prepare(`
        SELECT
          reception_date AS period,
          ROUND(
            AVG(loss_rate),
            2
          ) AS value
        FROM receptions
        GROUP BY reception_date
        ORDER BY reception_date
      `).all();

    const recentLots =
      db.prepare(`
        SELECT
          CAST(l.id AS TEXT) AS id,
          l.code,
          p.full_name AS producer,
          printf(
            '%.0f kg',
            l.quantity_kg
          ) AS quantity,
          l.quality_class AS qualityClass,
          l.status
        FROM harvest_lots l
        INNER JOIN producers p
          ON p.id = l.producer_id
        ORDER BY l.id DESC
        LIMIT 5
      `).all();

    const openNc =
      db.prepare(`
        SELECT COUNT(*) AS value
        FROM non_conformities
        WHERE status != 'Résolu'
      `).get() as {
        value: number;
      };

    const late =
      db.prepare(`
        SELECT COUNT(*) AS value
        FROM transports
        WHERE status =
          'Délai dépassé'
      `).get() as {
        value: number;
      };

    const alerts = [
      {
        id: "nc",
        level:
          openNc.value > 0
            ? "warning"
            : "success",
        title:
          `${openNc.value} non-conformité(s) ouverte(s)`,
        message:
          openNc.value > 0
            ? "Des actions correctives restent à traiter."
            : "Aucune non-conformité ouverte."
      },
      {
        id: "transport",
        level:
          late.value > 0
            ? "danger"
            : "success",
        title:
          `${late.value} transport(s) hors délai`,
        message:
          late.value > 0
            ? "Vérifier le planning de transport."
            : "Les délais sont respectés."
      }
    ];

    res.json({
      kpis: [
        {
          id:
            "producers",
          label:
            "Producteurs actifs",
          value:
            String(
              producers.value
            ),
          trend:
            "Base locale",
          color:
            "green"
        },
        {
          id:
            "lots",
          label:
            "Lots reçus",
          value:
            String(
              lots.count
            ),
          trend:
            "Enregistrés",
          color:
            "blue"
        },
        {
          id:
            "quantity",
          label:
            "Quantité reçue",
          value:
            `${Math.round(
              lots.quantity
            ).toLocaleString("fr-FR")} kg`,
          trend:
            "Cumul",
          color:
            "orange"
        },
        {
          id:
            "quality",
          label:
            "Conformité",
          value:
            quality.total > 0
              ? `${Math.round(
                  quality.conform /
                    quality.total *
                    100
                )} %`
              : "0 %",
          trend:
            "Classes A+B",
          color:
            "violet"
        },
        {
          id:
            "loss",
          label:
            "Pertes",
          value:
            `${Number(
              losses.value.toFixed(
                1
              )
            )} %`,
          trend:
            "Moyenne",
          color:
            "red"
        },
        {
          id:
            "yield",
          label:
            "Rendement",
          value:
            `${Number(
              yieldValue.value.toFixed(
                1
              )
            )} %`,
          trend:
            "Moyenne",
          color:
            "cyan"
        }
      ],
      quantityEvolution,
      qualityDistribution,
      lossEvolution,
      recentLots,
      alerts
    });
  }
);

router.get(
  "/traceability/:code",
  (
    req,
    res
  ) => {
    const code =
      req.params.code;

    let batch =
      db.prepare(`
        SELECT
          f.id,
          f.code,
          f.production_id AS productionId,
          p.name AS productName
        FROM finished_batches f
        INNER JOIN products p
          ON p.id = f.product_id
        WHERE f.code = ?
      `).get(
        code
      ) as any;

    if (!batch) {
      batch =
        db.prepare(`
          SELECT
            f.id,
            f.code,
            f.production_id AS productionId,
            p.name AS productName
          FROM finished_batches f
          INNER JOIN products p
            ON p.id = f.product_id
          INNER JOIN productions pr
            ON pr.id = f.production_id
          WHERE pr.code = ?
        `).get(code);
    }

    if (!batch) {
      batch =
        db.prepare(`
          SELECT
            f.id,
            f.code,
            f.production_id AS productionId,
            p.name AS productName
          FROM finished_batches f
          INNER JOIN products p
            ON p.id = f.product_id
          INNER JOIN production_inputs pi
            ON pi.production_id =
               f.production_id
          INNER JOIN harvest_lots l
            ON l.id = pi.lot_id
          WHERE l.code = ?
          LIMIT 1
        `).get(code);
    }

    if (!batch) {
      batch =
        db.prepare(`
          SELECT
            f.id,
            f.code,
            f.production_id AS productionId,
            p.name AS productName
          FROM finished_batches f
          INNER JOIN products p
            ON p.id = f.product_id
          INNER JOIN production_inputs pi
            ON pi.production_id =
               f.production_id
          INNER JOIN harvest_lots l
            ON l.id = pi.lot_id
          INNER JOIN producers prd
            ON prd.id = l.producer_id
          WHERE prd.code = ?
          LIMIT 1
        `).get(code);
    }

    if (!batch) {
      batch =
        db.prepare(`
          SELECT
            f.id,
            f.code,
            f.production_id AS productionId,
            p.name AS productName
          FROM sale_items si
          INNER JOIN sales s
            ON s.id = si.sale_id
          INNER JOIN finished_batches f
            ON f.id = si.finished_batch_id
          INNER JOIN products p
            ON p.id = f.product_id
          WHERE s.code = ?
          LIMIT 1
        `).get(code);
    }

    if (!batch) {
      res.status(404).json({
        message:
          "Aucune traçabilité trouvée."
      });

      return;
    }

    const production =
      db.prepare(`
        SELECT
          pr.code,
          pr.production_date AS date,
          pr.input_kg AS inputKg,
          pr.output_kg AS outputKg,
          pr.yield_rate AS yieldRate
        FROM productions pr
        WHERE pr.id = ?
      `).get(
        batch.productionId
      ) as any;

    const inputs =
      db.prepare(`
        SELECT
          l.id,
          l.code AS lotCode,
          l.harvest_date AS date,
          l.quantity_kg AS quantityKg,
          l.quality_class AS qualityClass,
          p.code AS producerCode,
          p.full_name AS producerName
        FROM production_inputs pi
        INNER JOIN harvest_lots l
          ON l.id = pi.lot_id
        INNER JOIN producers p
          ON p.id = l.producer_id
        WHERE pi.production_id = ?
      `).all(
        batch.productionId
      ) as any[];

    const nodes: any[] =
      [];

    for (
      const input
      of inputs
    ) {
      nodes.push({
        id:
          `producer-${input.id}`,
        type:
          "Producteur",
        code:
          input.producerCode,
        title:
          input.producerName,
        description:
          "Producteur d'origine.",
        date:
          input.date
      });

      nodes.push({
        id:
          `lot-${input.id}`,
        type:
          "Lot",
        code:
          input.lotCode,
        title:
          "Lot de tomates",
        description:
          `${input.quantityKg} kg • Classe ${input.qualityClass}`,
        date:
          input.date
      });

      const quality =
        db.prepare(`
          SELECT
            score,
            quality_class AS qualityClass,
            decision,
            checked_at AS date
          FROM quality_checks
          WHERE lot_id = ?
          ORDER BY id DESC
          LIMIT 1
        `).get(
          input.id
        ) as any;

      if (quality) {
        nodes.push({
          id:
            `quality-${input.id}`,
          type:
            "Qualité",
          code:
            input.lotCode,
          title:
            "Contrôle qualité",
          description:
            `${quality.score}/12 • Classe ${quality.qualityClass} • ${quality.decision}`,
          date:
            quality.date
        });
      }

      const collection =
        db.prepare(`
          SELECT
            code,
            accepted_weight_kg AS accepted,
            collection_date AS date
          FROM collections
          WHERE lot_id = ?
          ORDER BY id DESC
          LIMIT 1
        `).get(
          input.id
        ) as any;

      if (collection) {
        nodes.push({
          id:
            `collection-${input.id}`,
          type:
            "Collecte",
          code:
            collection.code,
          title:
            "Collecte et tri",
          description:
            `${collection.accepted} kg acceptés.`,
          date:
            collection.date
        });
      }

      const transport =
        db.prepare(`
          SELECT
            t.code,
            t.duration_hours AS durationHours,
            t.transport_date AS date
          FROM transport_lots tl
          INNER JOIN transports t
            ON t.id = tl.transport_id
          WHERE tl.lot_id = ?
          ORDER BY t.id DESC
          LIMIT 1
        `).get(
          input.id
        ) as any;

      if (transport) {
        nodes.push({
          id:
            `transport-${input.id}`,
          type:
            "Transport",
          code:
            transport.code,
          title:
            "Transport",
          description:
            `${transport.durationHours} h`,
          date:
            transport.date
        });
      }

      const reception =
        db.prepare(`
          SELECT
            code,
            received_weight_kg AS received,
            loss_rate AS lossRate,
            decision,
            reception_date AS date
          FROM receptions
          WHERE lot_id = ?
          ORDER BY id DESC
          LIMIT 1
        `).get(
          input.id
        ) as any;

      if (reception) {
        nodes.push({
          id:
            `reception-${input.id}`,
          type:
            "Réception",
          code:
            reception.code,
          title:
            "Réception usine",
          description:
            `${reception.received} kg • pertes ${reception.lossRate}% • ${reception.decision}`,
          date:
            reception.date
        });
      }
    }

    nodes.push({
      id:
        "production",
      type:
        "Transformation",
      code:
        production.code,
      title:
        batch.productName,
      description:
        `${production.inputKg} kg → ${production.outputKg} kg • rendement ${production.yieldRate}%`,
      date:
        production.date
    });

    nodes.push({
      id:
        "finished",
      type:
        "Produit fini",
      code:
        batch.code,
      title:
        batch.productName,
      description:
        "Lot de produit fini.",
      date:
        production.date
    });

    const sales =
      db.prepare(`
        SELECT
          s.code,
          s.sale_date AS date,
          c.name AS customerName,
          si.quantity
        FROM sale_items si
        INNER JOIN sales s
          ON s.id = si.sale_id
        INNER JOIN customers c
          ON c.id = s.customer_id
        WHERE si.finished_batch_id = ?
      `).all(
        batch.id
      ) as any[];

    for (
      const sale
      of sales
    ) {
      nodes.push({
        id:
          `sale-${sale.code}`,
        type:
          "Vente",
        code:
          sale.code,
        title:
          sale.customerName,
        description:
          `${sale.quantity} unité(s) vendue(s).`,
        date:
          sale.date
      });
    }

    res.json({
      id:
        `TRACE-${batch.id}`,
      finalProductCode:
        batch.code,
      productName:
        batch.productName,
      nodes
    });
  }
);

export default router;
