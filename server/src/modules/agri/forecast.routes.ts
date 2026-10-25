import { Router } from "express";
import db from "../../database/database.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { requireRoles } from "../../middleware/role.middleware.js";

const router = Router();

const nextProducerCode = (): string => {
  const row = db.prepare(`
    SELECT code FROM producers
    WHERE code LIKE 'P%'
    ORDER BY id DESC LIMIT 1
  `).get() as { code: string } | undefined;

  const current = row ? Number(row.code.replace(/\D/g, "")) : 0;
  return `P${String(current + 1).padStart(3, "0")}`;
};

const nextForecastCode = (): string => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const row = db.prepare(`
    SELECT COUNT(*) AS total
    FROM harvest_forecasts
    WHERE code LIKE ?
  `).get(`PREV-${date}-%`) as { total: number };

  return `PREV-${date}-${String(row.total + 1).padStart(3, "0")}`;
};

const validateForecast = (body: any) => {
  const quantity = Number(body.estimatedQuantityKg);
  const date = String(body.expectedHarvestDate || "").trim();

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { error: "Quantité estimée invalide." };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { error: "Date prévue invalide." };
  }

  return { quantity, date };
};

router.get(
  "/producer/me",
  authMiddleware,
  requireRoles("PRODUCTEUR"),
  (req, res) => {
    const producer = db.prepare(`
      SELECT
        p.id, p.code,
        p.full_name AS fullName,
        p.phone, p.commune, p.fokontany,
        p.cooperative, p.status
      FROM producer_user_links l
      INNER JOIN producers p ON p.id = l.producer_id
      WHERE l.user_id = ?
    `).get(req.user!.id);

    if (!producer) {
      res.status(404).json({
        success: false,
        message: "Votre compte n'est pas encore lié à une fiche producteur."
      });
      return;
    }

    res.json({ success: true, producer });
  }
);

router.get(
  "/producer/forecasts",
  authMiddleware,
  requireRoles("PRODUCTEUR"),
  (req, res) => {
    const forecasts = db.prepare(`
      SELECT
        f.id, f.code, f.product,
        f.estimated_quantity_kg AS estimatedQuantityKg,
        f.expected_harvest_date AS expectedHarvestDate,
        f.notes, f.status, f.created_at AS createdAt
      FROM harvest_forecasts f
      INNER JOIN producer_user_links l ON l.producer_id = f.producer_id
      WHERE l.user_id = ?
      ORDER BY f.id DESC
    `).all(req.user!.id);

    res.json({ success: true, forecasts });
  }
);

router.post(
  "/producer/forecasts",
  authMiddleware,
  requireRoles("PRODUCTEUR"),
  (req, res) => {
    const validation = validateForecast(req.body);
    if ("error" in validation) {
      res.status(400).json({ success: false, message: validation.error });
      return;
    }

    const link = db.prepare(`
      SELECT producer_id AS producerId
      FROM producer_user_links
      WHERE user_id = ?
    `).get(req.user!.id) as { producerId: number } | undefined;

    if (!link) {
      res.status(400).json({ success: false, message: "Compte producteur non lié." });
      return;
    }

    const code = nextForecastCode();

    db.prepare(`
      INSERT INTO harvest_forecasts (
        code, producer_id, created_by_user_id, product,
        estimated_quantity_kg, expected_harvest_date,
        notes, status
      )
      VALUES (?, ?, ?, 'Tomate', ?, ?, ?, 'PENDING')
    `).run(
      code,
      link.producerId,
      req.user!.id,
      validation.quantity,
      validation.date,
      String(req.body.notes || "").trim() || null
    );

    res.status(201).json({ success: true, message: "Prévision enregistrée.", code });
  }
);

router.get(
  "/point-focal/producers",
  authMiddleware,
  requireRoles("POINT_FOCAL"),
  (req, res) => {
    const producers = db.prepare(`
      SELECT
        p.id, p.code,
        p.full_name AS fullName,
        p.phone, p.commune, p.fokontany,
        p.cooperative, p.status
      FROM point_focal_producers a
      INNER JOIN producers p ON p.id = a.producer_id
      WHERE a.point_focal_user_id = ?
      ORDER BY p.full_name
    `).all(req.user!.id);

    res.json({ success: true, producers });
  }
);

router.post(
  "/point-focal/producers",
  authMiddleware,
  requireRoles("POINT_FOCAL"),
  (req, res) => {
    const fullName = String(req.body.fullName || "").trim();
    const commune = String(req.body.commune || "").trim();

    if (fullName.length < 3 || commune.length < 2) {
      res.status(400).json({ success: false, message: "Nom et commune requis." });
      return;
    }

    const code = nextProducerCode();

    const tx = db.transaction(() => {
      const result = db.prepare(`
        INSERT INTO producers (
          code, full_name, phone, commune, fokontany,
          cooperative, total_delivered_kg, status
        )
        VALUES (?, ?, ?, ?, ?, ?, 0, 'Actif')
      `).run(
        code,
        fullName,
        String(req.body.phone || "").trim() || null,
        commune,
        String(req.body.fokontany || "").trim() || null,
        String(req.body.cooperative || "Tantsaha Miombona").trim()
      );

      const producerId = Number(result.lastInsertRowid);

      db.prepare(`
        INSERT INTO point_focal_producers (point_focal_user_id, producer_id)
        VALUES (?, ?)
      `).run(req.user!.id, producerId);

      return producerId;
    });

    const producerId = tx();

    res.status(201).json({
      success: true,
      message: "Producteur créé et rattaché au point focal.",
      producerId,
      code
    });
  }
);

router.get(
  "/point-focal/forecasts",
  authMiddleware,
  requireRoles("POINT_FOCAL"),
  (req, res) => {
    const forecasts = db.prepare(`
      SELECT
        f.id, f.code,
        p.full_name AS producerName,
        p.code AS producerCode,
        f.estimated_quantity_kg AS estimatedQuantityKg,
        f.expected_harvest_date AS expectedHarvestDate,
        f.notes, f.status
      FROM harvest_forecasts f
      INNER JOIN producers p ON p.id = f.producer_id
      INNER JOIN point_focal_producers a ON a.producer_id = f.producer_id
      WHERE a.point_focal_user_id = ?
      ORDER BY f.id DESC
    `).all(req.user!.id);

    res.json({ success: true, forecasts });
  }
);

router.post(
  "/point-focal/forecasts",
  authMiddleware,
  requireRoles("POINT_FOCAL"),
  (req, res) => {
    const producerId = Number(req.body.producerId);

    const assigned = db.prepare(`
      SELECT id
      FROM point_focal_producers
      WHERE point_focal_user_id = ? AND producer_id = ?
    `).get(req.user!.id, producerId);

    if (!assigned) {
      res.status(403).json({ success: false, message: "Producteur non rattaché à ce point focal." });
      return;
    }

    const validation = validateForecast(req.body);
    if ("error" in validation) {
      res.status(400).json({ success: false, message: validation.error });
      return;
    }

    const code = nextForecastCode();

    db.prepare(`
      INSERT INTO harvest_forecasts (
        code, producer_id, created_by_user_id, product,
        estimated_quantity_kg, expected_harvest_date,
        notes, status
      )
      VALUES (?, ?, ?, 'Tomate', ?, ?, ?, 'PENDING')
    `).run(
      code,
      producerId,
      req.user!.id,
      validation.quantity,
      validation.date,
      String(req.body.notes || "").trim() || null
    );

    res.status(201).json({ success: true, message: "Prévision enregistrée.", code });
  }
);

router.get(
  "/forecasts",
  authMiddleware,
  requireRoles("ADMIN", "GESTIONNAIRE"),
  (_req, res) => {
    const forecasts = db.prepare(`
      SELECT
        f.id, f.code,
        p.id AS producerId,
        p.code AS producerCode,
        p.full_name AS producerName,
        f.estimated_quantity_kg AS estimatedQuantityKg,
        f.expected_harvest_date AS expectedHarvestDate,
        f.notes, f.status,
        u.full_name AS createdBy
      FROM harvest_forecasts f
      INNER JOIN producers p ON p.id = f.producer_id
      INNER JOIN users u ON u.id = f.created_by_user_id
      ORDER BY f.expected_harvest_date, f.id DESC
    `).all();

    res.json({ success: true, forecasts });
  }
);

router.patch(
  "/forecasts/:id/status",
  authMiddleware,
  requireRoles("ADMIN", "GESTIONNAIRE"),
  (req, res) => {
    const id = Number(req.params.id);
    const status = String(req.body.status || "").toUpperCase();

    if (!["PENDING", "VALIDATED", "REJECTED"].includes(status)) {
      res.status(400).json({ success: false, message: "Statut invalide." });
      return;
    }

    const result = db.prepare(`
      UPDATE harvest_forecasts
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, id);

    if (result.changes === 0) {
      res.status(404).json({ success: false, message: "Prévision introuvable." });
      return;
    }

    res.json({ success: true, message: "Statut mis à jour." });
  }
);

router.get(
  "/admin/producer-access",
  authMiddleware,
  requireRoles("ADMIN"),
  (_req, res) => {
    const users = db.prepare(`
      SELECT
        u.id, u.username, u.full_name AS fullName,
        l.producer_id AS producerId
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      LEFT JOIN producer_user_links l ON l.user_id = u.id
      WHERE r.code = 'PRODUCTEUR' AND u.active = 1
      ORDER BY u.full_name
    `).all();

    const producers = db.prepare(`
      SELECT id, code, full_name AS fullName
      FROM producers
      ORDER BY full_name
    `).all();

    const pointFocals = db.prepare(`
      SELECT u.id, u.full_name AS fullName
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      WHERE r.code = 'POINT_FOCAL' AND u.active = 1
      ORDER BY u.full_name
    `).all();

    res.json({ success: true, users, producers, pointFocals });
  }
);

router.post(
  "/admin/producer-access/link",
  authMiddleware,
  requireRoles("ADMIN"),
  (req, res) => {
    const userId = Number(req.body.userId);
    const producerId = Number(req.body.producerId);

    const role = db.prepare(`
      SELECT r.code
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      WHERE u.id = ?
    `).get(userId) as { code: string } | undefined;

    if (!role || role.code !== "PRODUCTEUR") {
      res.status(400).json({ success: false, message: "Compte Producteur invalide." });
      return;
    }

    try {
      db.prepare(`
        INSERT INTO producer_user_links (user_id, producer_id)
        VALUES (?, ?)
        ON CONFLICT(user_id) DO UPDATE SET producer_id = excluded.producer_id
      `).run(userId, producerId);

      res.json({ success: true, message: "Compte producteur lié." });
    } catch {
      res.status(409).json({ success: false, message: "Cette fiche producteur est déjà liée." });
    }
  }
);

router.post(
  "/admin/point-focal-access/assign",
  authMiddleware,
  requireRoles("ADMIN"),
  (req, res) => {
    const pointFocalUserId = Number(req.body.pointFocalUserId);
    const producerId = Number(req.body.producerId);

    const role = db.prepare(`
      SELECT r.code
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      WHERE u.id = ?
    `).get(pointFocalUserId) as { code: string } | undefined;

    if (!role || role.code !== "POINT_FOCAL") {
      res.status(400).json({ success: false, message: "Compte Point focal invalide." });
      return;
    }

    db.prepare(`
      INSERT OR IGNORE INTO point_focal_producers (point_focal_user_id, producer_id)
      VALUES (?, ?)
    `).run(pointFocalUserId, producerId);

    res.json({ success: true, message: "Producteur affecté au point focal." });
  }
);

export default router;
