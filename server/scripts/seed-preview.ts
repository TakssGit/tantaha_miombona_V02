import bcrypt from "bcryptjs";
import db from "../src/database/database.js";

type Row = Record<string, any>;

const DEMO_PASSWORD = "Demo2026!";
const ADMIN_PASSWORD = "admin123";

const tableExists = (name: string): boolean => {
  const row = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
      AND name = ?
  `).get(name);

  return Boolean(row);
};

const columnExists = (
  table: string,
  column: string
): boolean => {
  if (!tableExists(table)) {
    return false;
  }

  const rows =
    db.prepare(
      `PRAGMA table_info("${table}")`
    ).all() as Array<{
      name: string;
    }>;

  return rows.some(
    (row) => row.name === column
  );
};

const getId = (
  table: string,
  field: string,
  value: unknown
): number => {
  const row =
    db.prepare(
      `SELECT id FROM "${table}" WHERE "${field}" = ?`
    ).get(value) as
      | { id: number }
      | undefined;

  if (!row) {
    throw new Error(
      `${table}.${field} introuvable : ${String(value)}`
    );
  }

  return row.id;
};

const getOptionalId = (
  table: string,
  field: string,
  value: unknown
): number | null => {
  if (!tableExists(table)) {
    return null;
  }

  const row =
    db.prepare(
      `SELECT id FROM "${table}" WHERE "${field}" = ?`
    ).get(value) as
      | { id: number }
      | undefined;

  return row?.id ?? null;
};

const insertUser = (
  username: string,
  fullName: string,
  roleCode: string,
  active: number,
  phone: string | null = null,
  approvalStatus = "APPROVED",
  requestedRole: string | null = null,
  password = DEMO_PASSWORD
): number => {
  const roleId =
    getId(
      "roles",
      "code",
      roleCode
    );

  const existing =
    db.prepare(`
      SELECT id
      FROM users
      WHERE LOWER(username) = LOWER(?)
    `).get(username) as
      | { id: number }
      | undefined;

  if (existing) {
    return existing.id;
  }

  const columns = [
    "username",
    "full_name",
    "password_hash",
    "role_id",
    "active"
  ];

  const values: unknown[] = [
    username,
    fullName,
    bcrypt.hashSync(password, 10),
    roleId,
    active
  ];

  if (columnExists("users", "phone")) {
    columns.push("phone");
    values.push(phone);
  }

  if (
    columnExists(
      "users",
      "approval_status"
    )
  ) {
    columns.push(
      "approval_status"
    );
    values.push(
      approvalStatus
    );
  }

  if (
    columnExists(
      "users",
      "requested_role"
    )
  ) {
    columns.push(
      "requested_role"
    );
    values.push(
      requestedRole
    );
  }

  if (
    columnExists(
      "users",
      "must_change_password"
    )
  ) {
    columns.push(
      "must_change_password"
    );
    values.push(0);
  }

  if (
    columnExists(
      "users",
      "failed_login_attempts"
    )
  ) {
    columns.push(
      "failed_login_attempts"
    );
    values.push(0);
  }

  if (
    columnExists(
      "users",
      "last_login_at"
    )
  ) {
    columns.push(
      "last_login_at"
    );
    values.push(
      active
        ? "2026-09-12 08:15:00"
        : null
    );
  }

  if (
    columnExists(
      "users",
      "password_changed_at"
    )
  ) {
    columns.push(
      "password_changed_at"
    );
    values.push(
      "2026-09-01 09:00:00"
    );
  }

  const placeholders =
    columns
      .map(() => "?")
      .join(", ");

  const result =
    db.prepare(`
      INSERT INTO users (
        ${columns.join(", ")}
      )
      VALUES (
        ${placeholders}
      )
    `).run(...values);

  return Number(
    result.lastInsertRowid
  );
};

const insertQualityCheck = (
  lotId: number,
  values: {
    maturity: number;
    color: number;
    firmness: number;
    injuries: number;
    health: number;
    cleanliness: number;
    score: number;
    qualityClass: string;
    decision: string;
    controller: string;
  }
) => {
  const exists =
    db.prepare(`
      SELECT id
      FROM quality_checks
      WHERE lot_id = ?
        AND controller = ?
        AND decision = ?
      LIMIT 1
    `).get(
      lotId,
      values.controller,
      values.decision
    );

  if (exists) {
    return;
  }

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
  `).run(
    lotId,
    values.maturity,
    values.color,
    values.firmness,
    values.injuries,
    values.health,
    values.cleanliness,
    values.score,
    values.qualityClass,
    values.decision,
    values.controller
  );
};

const insertSaleItem = (
  saleId: number,
  productId: number,
  batchId: number,
  quantity: number,
  unitPrice: number
) => {
  const exists =
    db.prepare(`
      SELECT id
      FROM sale_items
      WHERE sale_id = ?
        AND product_id = ?
        AND finished_batch_id = ?
      LIMIT 1
    `).get(
      saleId,
      productId,
      batchId
    );

  if (exists) {
    return;
  }

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
    productId,
    batchId,
    quantity,
    unitPrice,
    quantity * unitPrice
  );
};

const insertOrderItem = (
  orderId: number,
  productId: number,
  quantity: number,
  unitPrice: number
) => {
  const exists =
    db.prepare(`
      SELECT id
      FROM order_items
      WHERE order_id = ?
        AND product_id = ?
      LIMIT 1
    `).get(
      orderId,
      productId
    );

  if (exists) {
    return;
  }

  db.prepare(`
    INSERT INTO order_items (
      order_id,
      product_id,
      quantity,
      unit_price_ar,
      total_ar
    )
    VALUES (?, ?, ?, ?, ?)
  `).run(
    orderId,
    productId,
    quantity,
    unitPrice,
    quantity * unitPrice
  );
};

const transaction =
  db.transaction(() => {
    /*
     * 1. ROLES
     */
    if (!tableExists("roles")) {
      throw new Error(
        "Table roles absente. Lancez d'abord les migrations."
      );
    }

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
      ["GESTIONNAIRE", "Gestionnaire"],
      ["QUALITE", "Qualité"],
      ["PRODUCTION", "Production"],
      ["COMMERCIAL", "Commercial"],
      ["POINT_FOCAL", "Point focal"],
      ["PRODUCTEUR", "Producteur"],
      ["DISTRIBUTEUR", "Distributeur"]
    ].forEach(
      ([code, name]) =>
        roleInsert.run(
          code,
          name
        )
    );

    /*
     * 2. UTILISATEURS
     */
    if (!tableExists("users")) {
      throw new Error(
        "Table users absente."
      );
    }

    const adminExisting =
      db.prepare(`
        SELECT id
        FROM users
        WHERE username = 'admin'
      `).get() as
        | { id: number }
        | undefined;

    let adminId: number;

    if (adminExisting) {
      adminId =
        adminExisting.id;

      const assignments = [
        "active = 1"
      ];

      if (
        columnExists(
          "users",
          "approval_status"
        )
      ) {
        assignments.push(
          "approval_status = 'APPROVED'"
        );
      }

      if (
        columnExists(
          "users",
          "failed_login_attempts"
        )
      ) {
        assignments.push(
          "failed_login_attempts = 0"
        );
      }

      if (
        columnExists(
          "users",
          "locked_until"
        )
      ) {
        assignments.push(
          "locked_until = NULL"
        );
      }

      if (
        columnExists(
          "users",
          "must_change_password"
        )
      ) {
        assignments.push(
          "must_change_password = 0"
        );
      }

      db.prepare(`
        UPDATE users
        SET ${assignments.join(", ")}
        WHERE id = ?
      `).run(adminId);
    } else {
      adminId =
        insertUser(
          "admin",
          "Administrateur principal",
          "ADMIN",
          1,
          "034 00 000 01",
          "APPROVED",
          null,
          ADMIN_PASSWORD
        );
    }

    const gestionnaireId =
      insertUser(
        "demo.gestionnaire",
        "Rasolo Gestionnaire",
        "GESTIONNAIRE",
        1,
        "034 10 100 01"
      );

    const qualiteId =
      insertUser(
        "demo.qualite",
        "Rasoanaivo Qualité",
        "QUALITE",
        1,
        "034 10 100 02"
      );

    const productionUserId =
      insertUser(
        "demo.production",
        "Rakoto Production",
        "PRODUCTION",
        1,
        "034 10 100 03"
      );

    const commercialId =
      insertUser(
        "demo.commercial",
        "Rabe Commercial",
        "COMMERCIAL",
        1,
        "034 10 100 04"
      );

    const pointFocalId =
      insertUser(
        "demo.pointfocal",
        "Ramanana Point Focal",
        "POINT_FOCAL",
        1,
        "034 10 100 05"
      );

    const pointFocal2Id =
      insertUser(
        "demo.pointfocal2",
        "Rasoa Point Focal",
        "POINT_FOCAL",
        1,
        "034 10 100 06"
      );

    const producteurUserId =
      insertUser(
        "demo.producteur",
        "Rakoto Jean",
        "PRODUCTEUR",
        1,
        "034 10 111 01",
        "APPROVED",
        "PRODUCTEUR"
      );

    const producteur2UserId =
      insertUser(
        "demo.producteur2",
        "Rasoa Marie",
        "PRODUCTEUR",
        1,
        "033 20 222 02",
        "APPROVED",
        "PRODUCTEUR"
      );

    const distributeurUserId =
      insertUser(
        "demo.distributeur",
        "Distribution Itasy",
        "DISTRIBUTEUR",
        1,
        "032 00 100 03",
        "APPROVED",
        "DISTRIBUTEUR"
      );

    if (
      columnExists(
        "users",
        "approval_status"
      )
    ) {
      insertUser(
        "demo.enattente",
        "Producteur en attente",
        "PRODUCTEUR",
        0,
        "034 88 888 88",
        "PENDING",
        "PRODUCTEUR"
      );
    }

    /*
     * 3. PRODUCTEURS
     */
    if (tableExists("producers")) {
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
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

      const producers = [
        ["P001", "Rakoto Jean", "034 10 111 01", "Soavinandriana", "Centre", "Tantsaha Miombona", 4850, "Actif"],
        ["P002", "Rasoa Marie", "033 20 222 02", "Ampefy", "Ampefy", "Tantsaha Miombona", 5420, "Actif"],
        ["P003", "Randria Paul", "032 30 333 03", "Miarinarivo", "Nord", "Tantsaha Miombona", 3980, "Actif"],
        ["P004", "Rabe Hery", "034 40 444 04", "Soavinandriana", "Est", "Tantsaha Miombona", 4425, "Actif"],
        ["P005", "Ramanana Lala", "033 50 555 05", "Ampefy", "Sud", "Tantsaha Miombona", 2870, "Actif"],
        ["P006", "Rakotomalala Eric", "032 60 666 06", "Miarinarivo", "Centre", "Tantsaha Miombona", 4090, "Actif"],
        ["P007", "Razafindrakoto Fara", "034 70 777 07", "Soavinandriana", "Ouest", "Tantsaha Miombona", 3560, "Actif"],
        ["P008", "Raharison Tiana", "033 80 888 08", "Ampefy", "Nord", "Tantsaha Miombona", 3210, "Actif"],
        ["P009", "Andriamihaja Solo", "032 90 999 09", "Miarinarivo", "Sud", "Tantsaha Miombona", 3750, "Actif"],
        ["P010", "Rakotobe Noro", "034 11 010 10", "Soavinandriana", "Nord", "Tantsaha Miombona", 2980, "Actif"],
        ["P011", "Razanajatovo Mamy", "033 22 011 11", "Ampefy", "Est", "Tantsaha Miombona", 2650, "Actif"],
        ["P012", "Rasoarimalala Vola", "032 33 012 12", "Miarinarivo", "Ouest", "Tantsaha Miombona", 3340, "Actif"]
      ];

      for (
        const producer
        of producers
      ) {
        producerInsert.run(
          ...producer
        );
      }
    }

    /*
     * 4. PARCELLES
     */
    if (
      tableExists("parcels") &&
      tableExists("producers")
    ) {
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
        ["P001", "PAR-001", "Soavinandriana Centre", 0.80],
        ["P002", "PAR-002", "Ampefy", 1.20],
        ["P003", "PAR-003", "Miarinarivo Nord", 0.65],
        ["P004", "PAR-004", "Soavinandriana Est", 1.05],
        ["P005", "PAR-005", "Ampefy Sud", 0.55],
        ["P006", "PAR-006", "Miarinarivo Centre", 0.90],
        ["P007", "PAR-007", "Soavinandriana Ouest", 1.15],
        ["P008", "PAR-008", "Ampefy Nord", 0.72],
        ["P009", "PAR-009", "Miarinarivo Sud", 1.30],
        ["P010", "PAR-010", "Soavinandriana Nord", 0.84],
        ["P011", "PAR-011", "Ampefy Est", 0.68],
        ["P012", "PAR-012", "Miarinarivo Ouest", 1.08]
      ];

      for (
        const [
          producerCode,
          parcelCode,
          location,
          area
        ] of parcels
      ) {
        parcelInsert.run(
          getId(
            "producers",
            "code",
            producerCode
          ),
          parcelCode,
          location,
          area,
          "Tomate"
        );
      }
    }

    /*
     * 5. LOTS DE RECOLTE
     */
    if (
      tableExists("harvest_lots") &&
      tableExists("producers") &&
      tableExists("parcels")
    ) {
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
          VALUES (?, ?, ?, 'Tomate', ?, ?, ?, ?, ?, ?)
        `);

      const lots = [
        ["TOM-20260901-P001-001", "P001", "PAR-001", "2026-09-01", "06:10", 420, 21, "A", "Conforme"],
        ["TOM-20260902-P002-002", "P002", "PAR-002", "2026-09-02", "06:25", 510, 26, "A", "Conforme"],
        ["TOM-20260903-P003-003", "P003", "PAR-003", "2026-09-03", "06:40", 365, 18, "B", "Conforme"],
        ["TOM-20260904-P004-004", "P004", "PAR-004", "2026-09-04", "07:00", 470, 24, "A", "Conforme"],
        ["TOM-20260905-P005-005", "P005", "PAR-005", "2026-09-05", "07:15", 280, 14, "C", "Déclassé"],
        ["TOM-20260906-P006-006", "P006", "PAR-006", "2026-09-06", "06:15", 390, 20, "A", "Conforme"],
        ["TOM-20260907-P007-007", "P007", "PAR-007", "2026-09-07", "06:35", 455, 23, "B", "Conforme"],
        ["TOM-20260908-P008-008", "P008", "PAR-008", "2026-09-08", "07:10", 315, 16, "A", "Conforme"],
        ["TOM-20260909-P009-009", "P009", "PAR-009", "2026-09-09", "06:05", 540, 27, "A", "Conforme"],
        ["TOM-20260910-P010-010", "P010", "PAR-010", "2026-09-10", "06:50", 350, 18, "B", "Conforme"],
        ["TOM-20260911-P011-011", "P011", "PAR-011", "2026-09-11", "07:20", 260, 13, "REJET", "Rejeté"],
        ["TOM-20260912-P012-012", "P012", "PAR-012", "2026-09-12", "06:30", 430, 22, "A", "Conforme"]
      ];

      for (
        const lot
        of lots
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

        lotInsert.run(
          code,
          getId(
            "producers",
            "code",
            producerCode
          ),
          getId(
            "parcels",
            "code",
            parcelCode
          ),
          date,
          time,
          quantity,
          crates,
          qualityClass,
          status
        );
      }
    }

    /*
     * 6. CONTROLES QUALITE
     */
    if (
      tableExists("quality_checks") &&
      tableExists("harvest_lots")
    ) {
      const qualityData = [
        ["TOM-20260901-P001-001", 2, 2, 2, 2, 2, 2, 12, "A", "Accepté"],
        ["TOM-20260902-P002-002", 2, 2, 2, 1, 2, 2, 11, "A", "Accepté"],
        ["TOM-20260903-P003-003", 2, 1, 1, 1, 2, 1, 8, "B", "Accepté"],
        ["TOM-20260904-P004-004", 2, 2, 2, 2, 2, 1, 11, "A", "Accepté"],
        ["TOM-20260905-P005-005", 1, 1, 1, 1, 1, 1, 6, "C", "Déclassé"],
        ["TOM-20260906-P006-006", 2, 2, 2, 1, 2, 2, 11, "A", "Accepté"],
        ["TOM-20260907-P007-007", 2, 1, 2, 1, 2, 1, 9, "B", "Accepté"],
        ["TOM-20260908-P008-008", 2, 2, 2, 2, 1, 2, 11, "A", "Accepté"],
        ["TOM-20260909-P009-009", 2, 2, 2, 2, 2, 2, 12, "A", "Accepté"],
        ["TOM-20260910-P010-010", 2, 1, 1, 1, 2, 2, 9, "B", "Accepté"],
        ["TOM-20260911-P011-011", 0, 0, 1, 0, 1, 0, 2, "REJET", "Rejeté"],
        ["TOM-20260912-P012-012", 2, 2, 2, 2, 2, 1, 11, "A", "Accepté"]
      ];

      for (
        const row
        of qualityData
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

        insertQualityCheck(
          getId(
            "harvest_lots",
            "code",
            lotCode
          ),
          {
            maturity:
              Number(maturity),
            color:
              Number(color),
            firmness:
              Number(firmness),
            injuries:
              Number(injuries),
            health:
              Number(health),
            cleanliness:
              Number(cleanliness),
            score:
              Number(score),
            qualityClass:
              String(
                qualityClass
              ),
            decision:
              String(decision),
            controller:
              "Agent qualité DEMO"
          }
        );
      }
    }

    /*
     * 7. COLLECTES
     */
    if (
      tableExists("collections") &&
      tableExists("harvest_lots")
    ) {
      const insert =
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
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

      const rows = [
        ["COL-20260901-001", "TOM-20260901-P001-001", "Centre Soavinandriana", 420, 414, "2026-09-01", "08:00", "Conforme"],
        ["COL-20260902-002", "TOM-20260902-P002-002", "Centre Ampefy", 510, 502, "2026-09-02", "08:10", "Conforme"],
        ["COL-20260903-003", "TOM-20260903-P003-003", "Centre Miarinarivo", 365, 354, "2026-09-03", "08:15", "Conforme"],
        ["COL-20260904-004", "TOM-20260904-P004-004", "Centre Soavinandriana", 470, 463, "2026-09-04", "08:05", "Conforme"],
        ["COL-20260906-006", "TOM-20260906-P006-006", "Centre Miarinarivo", 390, 384, "2026-09-06", "08:20", "Conforme"],
        ["COL-20260907-007", "TOM-20260907-P007-007", "Centre Soavinandriana", 455, 445, "2026-09-07", "08:25", "Conforme"],
        ["COL-20260908-008", "TOM-20260908-P008-008", "Centre Ampefy", 315, 309, "2026-09-08", "08:15", "Conforme"],
        ["COL-20260909-009", "TOM-20260909-P009-009", "Centre Miarinarivo", 540, 531, "2026-09-09", "08:00", "Conforme"],
        ["COL-20260910-010", "TOM-20260910-P010-010", "Centre Soavinandriana", 350, 341, "2026-09-10", "08:30", "Conforme"],
        ["COL-20260912-012", "TOM-20260912-P012-012", "Centre Miarinarivo", 430, 422, "2026-09-12", "08:10", "Conforme"]
      ];

      for (
        const row
        of rows
      ) {
        const [
          code,
          lotCode,
          center,
          gross,
          accepted,
          date,
          time,
          status
        ] = row;

        insert.run(
          code,
          getId(
            "harvest_lots",
            "code",
            lotCode
          ),
          center,
          gross,
          accepted,
          date,
          time,
          status
        );
      }
    }

    /*
     * 8. TRANSPORTS
     */
    if (tableExists("transports")) {
      const insert =
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
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

      [
        ["TR-20260902-001", "Rakotoarisoa Mamy", "Camion léger", "1234 TAA", "2026-09-02", "08:45", "11:15", 2.50, 924, "Terminé"],
        ["TR-20260904-002", "Razanaka Tovo", "Fourgon", "5678 TBE", "2026-09-04", "09:00", "12:20", 3.33, 817, "Terminé"],
        ["TR-20260908-003", "Rabe Haja", "Camion léger", "2468 TCA", "2026-09-08", "08:50", "13:25", 4.58, 1138, "Terminé"],
        ["TR-20260912-004", "Rakoto Naina", "Fourgon", "9753 TDA", "2026-09-12", "09:10", "14:30", 5.33, 763, "En cours"]
      ].forEach(
        (row) =>
          insert.run(
            ...row
          )
      );
    }

    /*
     * 9. LIAISONS TRANSPORT-LOTS
     */
    if (
      tableExists("transport_lots") &&
      tableExists("transports") &&
      tableExists("harvest_lots")
    ) {
      const insert =
        db.prepare(`
          INSERT OR IGNORE INTO transport_lots (
            transport_id,
            lot_id
          )
          VALUES (?, ?)
        `);

      const links = [
        ["TR-20260902-001", "TOM-20260901-P001-001"],
        ["TR-20260902-001", "TOM-20260902-P002-002"],
        ["TR-20260904-002", "TOM-20260903-P003-003"],
        ["TR-20260904-002", "TOM-20260904-P004-004"],
        ["TR-20260908-003", "TOM-20260906-P006-006"],
        ["TR-20260908-003", "TOM-20260907-P007-007"],
        ["TR-20260908-003", "TOM-20260908-P008-008"],
        ["TR-20260912-004", "TOM-20260909-P009-009"],
        ["TR-20260912-004", "TOM-20260910-P010-010"],
        ["TR-20260912-004", "TOM-20260912-P012-012"]
      ];

      for (
        const [
          transportCode,
          lotCode
        ] of links
      ) {
        insert.run(
          getId(
            "transports",
            "code",
            transportCode
          ),
          getId(
            "harvest_lots",
            "code",
            lotCode
          )
        );
      }
    }

    /*
     * 10. RECEPTIONS
     */
    if (
      tableExists("receptions") &&
      tableExists("transports") &&
      tableExists("harvest_lots")
    ) {
      const insert =
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
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

      const rows = [
        ["REC-20260902-001", "TOM-20260901-P001-001", "TR-20260902-001", 414, 408, 6, 1.45, "Accepté", "2026-09-02"],
        ["REC-20260902-002", "TOM-20260902-P002-002", "TR-20260902-001", 502, 493, 9, 1.79, "Accepté", "2026-09-02"],
        ["REC-20260904-003", "TOM-20260903-P003-003", "TR-20260904-002", 354, 345, 9, 2.54, "Accepté", "2026-09-04"],
        ["REC-20260904-004", "TOM-20260904-P004-004", "TR-20260904-002", 463, 452, 11, 2.38, "Accepté", "2026-09-04"],
        ["REC-20260908-006", "TOM-20260906-P006-006", "TR-20260908-003", 384, 376, 8, 2.08, "Accepté", "2026-09-08"],
        ["REC-20260908-007", "TOM-20260907-P007-007", "TR-20260908-003", 445, 432, 13, 2.92, "Accepté", "2026-09-08"],
        ["REC-20260908-008", "TOM-20260908-P008-008", "TR-20260908-003", 309, 304, 5, 1.62, "Accepté", "2026-09-08"],
        ["REC-20260912-009", "TOM-20260909-P009-009", "TR-20260912-004", 531, 516, 15, 2.82, "Accepté", "2026-09-12"]
      ];

      for (
        const row
        of rows
      ) {
        const [
          code,
          lotCode,
          transportCode,
          announced,
          received,
          loss,
          lossRate,
          decision,
          date
        ] = row;

        insert.run(
          code,
          getId(
            "harvest_lots",
            "code",
            lotCode
          ),
          getId(
            "transports",
            "code",
            transportCode
          ),
          announced,
          received,
          loss,
          lossRate,
          decision,
          date
        );
      }
    }

    /*
     * 11. PRODUITS
     */
    if (tableExists("products")) {
      const insert =
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

      [
        ["PRD-001", "Sauce tomate", "Sauce", "Bouteille 500 ml", 6500],
        ["PRD-002", "Purée de tomate", "Purée", "Pot 500 g", 7000],
        ["PRD-003", "Concentré de tomate", "Concentré", "Pot 250 g", 8500],
        ["PRD-004", "Coulis de tomate", "Coulis", "Bouteille 750 ml", 7500],
        ["PRD-005", "Tomate séchée", "Séchée", "Sachet 250 g", 9000]
      ].forEach(
        (row) =>
          insert.run(
            ...row
          )
      );
    }

    /*
     * 12. PRODUCTIONS
     */
    if (
      tableExists("productions") &&
      tableExists("products")
    ) {
      const insert =
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
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

      const rows = [
        ["FAB-20260903-001", "PRD-001", 900, 657, 243, 73.00, "2026-09-03", "Terminée"],
        ["FAB-20260905-002", "PRD-002", 780, 585, 195, 75.00, "2026-09-05", "Terminée"],
        ["FAB-20260907-003", "PRD-003", 620, 341, 279, 55.00, "2026-09-07", "Terminée"],
        ["FAB-20260909-004", "PRD-004", 740, 548, 192, 74.05, "2026-09-09", "Terminée"],
        ["FAB-20260911-005", "PRD-005", 430, 86, 344, 20.00, "2026-09-11", "Terminée"]
      ];

      for (
        const row
        of rows
      ) {
        const [
          code,
          productCode,
          input,
          output,
          loss,
          yieldRate,
          date,
          status
        ] = row;

        insert.run(
          code,
          getId(
            "products",
            "code",
            productCode
          ),
          input,
          output,
          loss,
          yieldRate,
          date,
          status
        );
      }
    }

    /*
     * 13. ENTREES DE PRODUCTION
     */
    if (
      tableExists("production_inputs") &&
      tableExists("productions") &&
      tableExists("harvest_lots")
    ) {
      const insert =
        db.prepare(`
          INSERT OR IGNORE INTO production_inputs (
            production_id,
            lot_id,
            quantity_kg
          )
          VALUES (?, ?, ?)
        `);

      const links = [
        ["FAB-20260903-001", "TOM-20260901-P001-001", 408],
        ["FAB-20260903-001", "TOM-20260902-P002-002", 492],
        ["FAB-20260905-002", "TOM-20260903-P003-003", 345],
        ["FAB-20260905-002", "TOM-20260904-P004-004", 435],
        ["FAB-20260907-003", "TOM-20260906-P006-006", 376],
        ["FAB-20260907-003", "TOM-20260907-P007-007", 244],
        ["FAB-20260909-004", "TOM-20260907-P007-007", 188],
        ["FAB-20260909-004", "TOM-20260908-P008-008", 304],
        ["FAB-20260909-004", "TOM-20260909-P009-009", 248],
        ["FAB-20260911-005", "TOM-20260909-P009-009", 268],
        ["FAB-20260911-005", "TOM-20260910-P010-010", 162]
      ];

      for (
        const [
          productionCode,
          lotCode,
          quantity
        ] of links
      ) {
        insert.run(
          getId(
            "productions",
            "code",
            productionCode
          ),
          getId(
            "harvest_lots",
            "code",
            lotCode
          ),
          quantity
        );
      }
    }

    /*
     * 14. LOTS DE PRODUITS FINIS
     */
    if (
      tableExists("finished_batches") &&
      tableExists("productions") &&
      tableExists("products")
    ) {
      const insert =
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

      const rows = [
        ["PF-20260903-001", "FAB-20260903-001", "PRD-001", "2026-09-03", 657, "kg", "Bouteille 500 ml", "Conforme"],
        ["PF-20260905-002", "FAB-20260905-002", "PRD-002", "2026-09-05", 585, "kg", "Pot 500 g", "Conforme"],
        ["PF-20260907-003", "FAB-20260907-003", "PRD-003", "2026-09-07", 341, "kg", "Pot 250 g", "Conforme"],
        ["PF-20260909-004", "FAB-20260909-004", "PRD-004", "2026-09-09", 548, "kg", "Bouteille 750 ml", "Conforme"],
        ["PF-20260911-005", "FAB-20260911-005", "PRD-005", "2026-09-11", 86, "kg", "Sachet 250 g", "Conforme"]
      ];

      for (
        const row
        of rows
      ) {
        const [
          code,
          productionCode,
          productCode,
          date,
          quantity,
          unit,
          packaging,
          status
        ] = row;

        insert.run(
          code,
          getId(
            "productions",
            "code",
            productionCode
          ),
          getId(
            "products",
            "code",
            productCode
          ),
          date,
          quantity,
          unit,
          packaging,
          status
        );
      }
    }

    /*
     * 15. MOUVEMENTS DE STOCK
     */
    if (
      tableExists("stock_movements") &&
      tableExists("finished_batches")
    ) {
      const insert =
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
        `);

      const rows = [
        ["MVT-DEMO-001", "PF-20260903-001", "Entrée", 657, "kg", "Fin de fabrication", "2026-09-03"],
        ["MVT-DEMO-002", "PF-20260905-002", "Entrée", 585, "kg", "Fin de fabrication", "2026-09-05"],
        ["MVT-DEMO-003", "PF-20260907-003", "Entrée", 341, "kg", "Fin de fabrication", "2026-09-07"],
        ["MVT-DEMO-004", "PF-20260909-004", "Entrée", 548, "kg", "Fin de fabrication", "2026-09-09"],
        ["MVT-DEMO-005", "PF-20260911-005", "Entrée", 86, "kg", "Fin de fabrication", "2026-09-11"],
        ["MVT-DEMO-101", "PF-20260903-001", "Sortie", 150, "kg", "Ventes et livraisons", "2026-09-10"],
        ["MVT-DEMO-102", "PF-20260905-002", "Sortie", 105, "kg", "Ventes et livraisons", "2026-09-10"],
        ["MVT-DEMO-103", "PF-20260907-003", "Sortie", 58, "kg", "Ventes et livraisons", "2026-09-11"],
        ["MVT-DEMO-104", "PF-20260909-004", "Sortie", 96, "kg", "Ventes et livraisons", "2026-09-11"],
        ["MVT-DEMO-105", "PF-20260911-005", "Sortie", 12, "kg", "Vente de démonstration", "2026-09-12"]
      ];

      for (
        const row
        of rows
      ) {
        const [
          code,
          batchCode,
          movementType,
          quantity,
          unit,
          reason,
          date
        ] = row;

        insert.run(
          code,
          getId(
            "finished_batches",
            "code",
            batchCode
          ),
          movementType,
          quantity,
          unit,
          reason,
          date
        );
      }
    }

    /*
     * 16. CLIENTS
     */
    if (tableExists("customers")) {
      const insert =
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

      [
        ["CLI-001", "Marché Central", "034 00 100 01", "Soavinandriana", "Détaillant", "Actif"],
        ["CLI-002", "Auberge du Lac", "033 00 100 02", "Soavinandriana", "Restaurant", "Actif"],
        ["CLI-003", "Distribution Itasy", "032 00 100 03", "Miarinarivo", "Grossiste", "Actif"],
        ["CLI-004", "Epicerie Tsinjo", "034 00 100 04", "Ampefy", "Détaillant", "Actif"],
        ["CLI-005", "Hôtel des Hautes Terres", "033 00 100 05", "Miarinarivo", "Hôtel", "Actif"],
        ["CLI-006", "Coopérative Vokatra", "032 00 100 06", "Antananarivo", "Distributeur", "Actif"]
      ].forEach(
        (row) =>
          insert.run(
            ...row
          )
      );
    }

    /*
     * 17. VENTES
     */
    if (
      tableExists("sales") &&
      tableExists("customers")
    ) {
      const insert =
        db.prepare(`
          INSERT OR IGNORE INTO sales (
            code,
            customer_id,
            sale_date,
            status
          )
          VALUES (?, ?, ?, ?)
        `);

      const rows = [
        ["VTE-DEMO-001", "CLI-001", "2026-09-08", "Payée"],
        ["VTE-DEMO-002", "CLI-002", "2026-09-09", "Payée"],
        ["VTE-DEMO-003", "CLI-003", "2026-09-10", "Payée"],
        ["VTE-DEMO-004", "CLI-004", "2026-09-11", "Payée"],
        ["VTE-DEMO-005", "CLI-005", "2026-09-12", "En attente"]
      ];

      for (
        const [
          code,
          customerCode,
          date,
          status
        ] of rows
      ) {
        insert.run(
          code,
          getId(
            "customers",
            "code",
            customerCode
          ),
          date,
          status
        );
      }
    }

    /*
     * 18. LIGNES DE VENTE
     */
    if (
      tableExists("sale_items") &&
      tableExists("sales") &&
      tableExists("products") &&
      tableExists("finished_batches")
    ) {
      const saleItems = [
        ["VTE-DEMO-001", "PRD-001", "PF-20260903-001", 45, 6500],
        ["VTE-DEMO-002", "PRD-002", "PF-20260905-002", 35, 7000],
        ["VTE-DEMO-003", "PRD-003", "PF-20260907-003", 28, 8500],
        ["VTE-DEMO-004", "PRD-004", "PF-20260909-004", 40, 7500],
        ["VTE-DEMO-005", "PRD-005", "PF-20260911-005", 12, 9000]
      ];

      for (
        const [
          saleCode,
          productCode,
          batchCode,
          quantity,
          unitPrice
        ] of saleItems
      ) {
        insertSaleItem(
          getId(
            "sales",
            "code",
            saleCode
          ),
          getId(
            "products",
            "code",
            productCode
          ),
          getId(
            "finished_batches",
            "code",
            batchCode
          ),
          Number(quantity),
          Number(unitPrice)
        );
      }
    }

    /*
     * 19. NON-CONFORMITES
     */
    if (
      tableExists("non_conformities") &&
      tableExists("harvest_lots")
    ) {
      const insert =
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
        `);

      const rows = [
        ["NC-DEMO-001", "TOM-20260905-P005-005", "Qualité", "Fruits hétérogènes et trop mûrs", "Tri renforcé et sensibilisation du producteur", "Agent qualité", "2026-09-05", "Résolu"],
        ["NC-DEMO-002", "TOM-20260907-P007-007", "Transport", "Quelques cageots écrasés", "Revoir l'empilage des cageots", "Responsable collecte", "2026-09-08", "En cours"],
        ["NC-DEMO-003", "TOM-20260910-P010-010", "Délai", "Durée de transport supérieure à la cible", "Planifier un départ plus tôt", "Gestionnaire", "2026-09-10", "Ouvert"],
        ["NC-DEMO-004", "TOM-20260911-P011-011", "Qualité", "Tomates trop mûres et blessures visibles", "Lot rejeté et producteur informé", "Agent qualité", "2026-09-11", "Résolu"]
      ];

      for (
        const row
        of rows
      ) {
        const [
          code,
          lotCode,
          category,
          cause,
          action,
          responsible,
          date,
          status
        ] = row;

        insert.run(
          code,
          getId(
            "harvest_lots",
            "code",
            lotCode
          ),
          category,
          cause,
          action,
          responsible,
          date,
          status
        );
      }
    }

    /*
     * 20. P24 : LIAISON COMPTE PRODUCTEUR
     */
    if (
      tableExists("producer_user_links") &&
      tableExists("producers")
    ) {
      const insert =
        db.prepare(`
          INSERT OR IGNORE INTO producer_user_links (
            user_id,
            producer_id
          )
          VALUES (?, ?)
        `);

      insert.run(
        producteurUserId,
        getId(
          "producers",
          "code",
          "P001"
        )
      );

      insert.run(
        producteur2UserId,
        getId(
          "producers",
          "code",
          "P002"
        )
      );
    }

    /*
     * 21. P24 : AFFECTATIONS POINT FOCAL
     */
    if (
      tableExists("point_focal_producers") &&
      tableExists("producers")
    ) {
      const insert =
        db.prepare(`
          INSERT OR IGNORE INTO point_focal_producers (
            point_focal_user_id,
            producer_id
          )
          VALUES (?, ?)
        `);

      for (
        const code
        of [
          "P003",
          "P004",
          "P005",
          "P006"
        ]
      ) {
        insert.run(
          pointFocalId,
          getId(
            "producers",
            "code",
            code
          )
        );
      }

      for (
        const code
        of [
          "P007",
          "P008",
          "P009",
          "P010"
        ]
      ) {
        insert.run(
          pointFocal2Id,
          getId(
            "producers",
            "code",
            code
          )
        );
      }
    }

    /*
     * 22. P24 : PREVISIONS
     */
    if (
      tableExists("harvest_forecasts") &&
      tableExists("producers")
    ) {
      const insert =
        db.prepare(`
          INSERT OR IGNORE INTO harvest_forecasts (
            code,
            producer_id,
            parcel_id,
            created_by_user_id,
            product,
            estimated_quantity_kg,
            expected_harvest_date,
            notes,
            status
          )
          VALUES (?, ?, ?, ?, 'Tomate', ?, ?, ?, ?)
        `);

      const rows = [
        ["PREV-DEMO-001", "P001", "PAR-001", producteurUserId, 380, "2026-09-14", "Récolte estimée à maturité optimale", "VALIDATED"],
        ["PREV-DEMO-002", "P002", "PAR-002", producteur2UserId, 520, "2026-09-15", "Volume élevé prévu", "PENDING"],
        ["PREV-DEMO-003", "P003", "PAR-003", pointFocalId, 310, "2026-09-16", "Saisie par le point focal", "VALIDATED"],
        ["PREV-DEMO-004", "P004", "PAR-004", pointFocalId, 440, "2026-09-17", "Prévoir 22 cageots", "PENDING"],
        ["PREV-DEMO-005", "P005", "PAR-005", pointFocalId, 250, "2026-09-18", "Contrôle maturité demandé", "REJECTED"],
        ["PREV-DEMO-006", "P007", "PAR-007", pointFocal2Id, 470, "2026-09-19", "Production régulière", "VALIDATED"],
        ["PREV-DEMO-007", "P008", "PAR-008", pointFocal2Id, 330, "2026-09-20", "Prévision provisoire", "PENDING"],
        ["PREV-DEMO-008", "P009", "PAR-009", pointFocal2Id, 560, "2026-09-21", "Grande parcelle", "VALIDATED"]
      ];

      for (
        const row
        of rows
      ) {
        const [
          code,
          producerCode,
          parcelCode,
          creatorId,
          quantity,
          date,
          notes,
          status
        ] = row;

        insert.run(
          code,
          getId(
            "producers",
            "code",
            producerCode
          ),
          getOptionalId(
            "parcels",
            "code",
            parcelCode
          ),
          creatorId,
          quantity,
          date,
          notes,
          status
        );
      }
    }

    /*
     * 23. P25 : COMMANDES
     */
    if (
      tableExists("orders") &&
      tableExists("users")
    ) {
      const insert =
        db.prepare(`
          INSERT OR IGNORE INTO orders (
            code,
            user_id,
            customer_name,
            customer_phone,
            status,
            total_ar,
            notes,
            created_at,
            updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

      [
        ["CMD-DEMO-001", distributeurUserId, "Distribution Itasy", "032 00 100 03", "EN_ATTENTE", 455000, "Livraison souhaitée à Miarinarivo", "2026-09-09 09:15:00", "2026-09-09 09:15:00"],
        ["CMD-DEMO-002", distributeurUserId, "Distribution Itasy", "032 00 100 03", "CONFIRMEE", 350000, "Commande confirmée", "2026-09-10 10:00:00", "2026-09-10 11:30:00"],
        ["CMD-DEMO-003", distributeurUserId, "Distribution Itasy", "032 00 100 03", "PREPAREE", 425000, "Retrait à l'unité", "2026-09-11 08:20:00", "2026-09-11 15:00:00"],
        ["CMD-DEMO-004", distributeurUserId, "Distribution Itasy", "032 00 100 03", "LIVREE", 260000, "Commande livrée", "2026-09-06 07:45:00", "2026-09-07 16:00:00"]
      ].forEach(
        (row) =>
          insert.run(
            ...row
          )
      );
    }

    /*
     * 24. P25 : LIGNES DE COMMANDES
     */
    if (
      tableExists("order_items") &&
      tableExists("orders") &&
      tableExists("products")
    ) {
      const lines = [
        ["CMD-DEMO-001", "PRD-001", 35, 6500],
        ["CMD-DEMO-001", "PRD-002", 20, 7000],
        ["CMD-DEMO-001", "PRD-003", 10, 8500],
        ["CMD-DEMO-002", "PRD-002", 50, 7000],
        ["CMD-DEMO-003", "PRD-003", 50, 8500],
        ["CMD-DEMO-004", "PRD-001", 40, 6500]
      ];

      for (
        const [
          orderCode,
          productCode,
          quantity,
          price
        ] of lines
      ) {
        insertOrderItem(
          getId(
            "orders",
            "code",
            orderCode
          ),
          getId(
            "products",
            "code",
            productCode
          ),
          Number(quantity),
          Number(price)
        );
      }
    }

    /*
     * 25. P26 : DEMANDES DE MOT DE PASSE
     */
    if (
      tableExists(
        "password_reset_requests"
      )
    ) {
      const exists =
        db.prepare(`
          SELECT id
          FROM password_reset_requests
          WHERE user_id = ?
            AND status = 'PENDING'
          LIMIT 1
        `).get(
          producteur2UserId
        );

      if (!exists) {
        db.prepare(`
          INSERT INTO password_reset_requests (
            user_id,
            requested_at,
            status
          )
          VALUES (
            ?,
            '2026-09-12 07:30:00',
            'PENDING'
          )
        `).run(
          producteur2UserId
        );
      }

      const processed =
        db.prepare(`
          SELECT id
          FROM password_reset_requests
          WHERE user_id = ?
            AND status = 'DONE'
          LIMIT 1
        `).get(
          distributeurUserId
        );

      if (!processed) {
        db.prepare(`
          INSERT INTO password_reset_requests (
            user_id,
            requested_at,
            status,
            processed_at,
            processed_by
          )
          VALUES (
            ?,
            '2026-09-10 09:00:00',
            'DONE',
            '2026-09-10 09:20:00',
            ?
          )
        `).run(
          distributeurUserId,
          adminId
        );
      }
    }

    /*
     * 26. P26 : EVENEMENTS DE SECURITE
     */
    if (
      tableExists(
        "security_events"
      )
    ) {
      const insertEvent = (
        userId: number | null,
        username: string,
        eventType: string,
        details: string,
        date: string
      ) => {
        const exists =
          db.prepare(`
            SELECT id
            FROM security_events
            WHERE details = ?
            LIMIT 1
          `).get(details);

        if (!exists) {
          db.prepare(`
            INSERT INTO security_events (
              user_id,
              username,
              event_type,
              details,
              created_at
            )
            VALUES (?, ?, ?, ?, ?)
          `).run(
            userId,
            username,
            eventType,
            details,
            date
          );
        }
      };

      insertEvent(
        adminId,
        "admin",
        "LOGIN_SUCCESS",
        "[PREVIEW] Connexion administrateur réussie",
        "2026-09-12 08:15:00"
      );

      insertEvent(
        gestionnaireId,
        "demo.gestionnaire",
        "LOGIN_SUCCESS",
        "[PREVIEW] Connexion gestionnaire réussie",
        "2026-09-12 08:20:00"
      );

      insertEvent(
        null,
        "utilisateur.inconnu",
        "LOGIN_FAILED",
        "[PREVIEW] Tentative de connexion avec identifiant inconnu",
        "2026-09-11 17:10:00"
      );

      insertEvent(
        producteurUserId,
        "demo.producteur",
        "PASSWORD_CHANGED",
        "[PREVIEW] Mot de passe producteur modifié",
        "2026-09-08 10:30:00"
      );
    }

    /*
     * 27. P27 : JOURNAL ADMINISTRATIF
     */
    if (
      tableExists(
        "account_audit_logs"
      )
    ) {
      const log = (
        actor: number,
        target: number,
        action: string,
        details: string,
        date: string
      ) => {
        const exists =
          db.prepare(`
            SELECT id
            FROM account_audit_logs
            WHERE details = ?
            LIMIT 1
          `).get(details);

        if (!exists) {
          db.prepare(`
            INSERT INTO account_audit_logs (
              actor_user_id,
              target_user_id,
              action,
              details,
              created_at
            )
            VALUES (?, ?, ?, ?, ?)
          `).run(
            actor,
            target,
            action,
            details,
            date
          );
        }
      };

      log(
        adminId,
        producteurUserId,
        "ACCOUNT_APPROVED",
        "[PREVIEW] Validation du compte producteur",
        "2026-09-06 09:15:00"
      );

      log(
        adminId,
        pointFocalId,
        "ROLE_ASSIGNED",
        "[PREVIEW] Attribution du rôle POINT_FOCAL",
        "2026-09-06 09:25:00"
      );

      log(
        adminId,
        commercialId,
        "ACCOUNT_ACTIVATED",
        "[PREVIEW] Activation du compte commercial",
        "2026-09-06 09:35:00"
      );
    }

    /*
     * Les variables ci-dessous sont volontairement conservées :
     * elles prouvent que les comptes principaux ont été créés.
     */
    void qualiteId;
    void productionUserId;
  });

transaction();

/*
 * RAPPORT FINAL :
 * affiche toutes les tables applicatives et leur nombre de lignes.
 * Cela permet de repérer immédiatement une table restée vide.
 */
const tables =
  db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
      AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `).all() as Array<{
    name: string;
  }>;

console.log("");
console.log(
  "============================================================"
);
console.log(
  " TANTSAHA MIOMBONA - DONNEES DE PREVISUALISATION INSEREES"
);
console.log(
  "============================================================"
);
console.log("");

for (
  const { name }
  of tables
) {
  const row =
    db.prepare(
      `SELECT COUNT(*) AS total FROM "${name}"`
    ).get() as {
      total: number;
    };

  const flag =
    row.total === 0
      ? "  <-- VIDE"
      : "";

  console.log(
    `${name.padEnd(30)} : ${String(row.total).padStart(4)}${flag}`
  );
}

console.log("");
console.log(
  "Comptes de demonstration :"
);
console.log(
  "  admin                / admin123  (base neuve)"
);
console.log(
  "  demo.gestionnaire    / Demo2026!"
);
console.log(
  "  demo.qualite         / Demo2026!"
);
console.log(
  "  demo.production      / Demo2026!"
);
console.log(
  "  demo.commercial      / Demo2026!"
);
console.log(
  "  demo.pointfocal      / Demo2026!"
);
console.log(
  "  demo.producteur      / Demo2026!"
);
console.log(
  "  demo.distributeur    / Demo2026!"
);
console.log("");
console.log(
  "Les tables marquees VIDE ne sont pas necessairement anormales :"
);
console.log(
  "certaines tables techniques peuvent etre remplies uniquement par une action."
);
console.log(
  "============================================================"
);

db.close();
