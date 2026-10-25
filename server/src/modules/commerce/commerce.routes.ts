import { Router } from "express";
import db from "../../database/database.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { requireRoles } from "../../middleware/role.middleware.js";

const router = Router();

const catalogQuery = `
  SELECT
    p.id,
    p.code,
    p.name,
    p.category,
    p.unit,
    p.selling_price_ar AS sellingPriceAr,
    ROUND(
      COALESCE(
        SUM(
          CASE
            WHEN sm.movement_type = 'Entrée' THEN sm.quantity
            WHEN sm.movement_type = 'Sortie' THEN -sm.quantity
            ELSE 0
          END
        ),
        0
      ),
      2
    ) AS availableStock
  FROM products p
  LEFT JOIN finished_batches fb ON fb.product_id = p.id
  LEFT JOIN stock_movements sm ON sm.finished_batch_id = fb.id
  WHERE p.active = 1
  GROUP BY p.id, p.code, p.name, p.category, p.unit, p.selling_price_ar
  ORDER BY p.name
`;

const nextOrderCode = (): string => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const row = db.prepare(`
    SELECT COUNT(*) AS total
    FROM orders
    WHERE code LIKE ?
  `).get(`CMD-${date}-%`) as { total: number };

  return `CMD-${date}-${String(row.total + 1).padStart(3, "0")}`;
};

router.get("/public/catalog", (_req, res) => {
  const products = db.prepare(catalogQuery).all();
  res.json({ success: true, products });
});

router.get(
  "/my-orders",
  authMiddleware,
  requireRoles("DISTRIBUTEUR"),
  (req, res) => {
    const orders = db.prepare(`
      SELECT
        id, code, status,
        total_ar AS totalAr,
        notes,
        created_at AS createdAt
      FROM orders
      WHERE user_id = ?
      ORDER BY id DESC
    `).all(req.user!.id);

    res.json({ success: true, orders });
  }
);

router.post(
  "/my-orders",
  authMiddleware,
  requireRoles("DISTRIBUTEUR"),
  (req, res) => {
    const items = Array.isArray(req.body.items) ? req.body.items : [];

    if (items.length === 0) {
      res.status(400).json({ success: false, message: "La commande doit contenir au moins un produit." });
      return;
    }

    const user = db.prepare(`
      SELECT full_name AS fullName, phone
      FROM users
      WHERE id = ?
    `).get(req.user!.id) as { fullName: string; phone: string | null } | undefined;

    if (!user) {
      res.status(404).json({ success: false, message: "Compte introuvable." });
      return;
    }

    const products = db.prepare(catalogQuery).all() as Array<{
      id: number;
      sellingPriceAr: number;
      availableStock: number;
    }>;

    const productMap = new Map(products.map((p) => [p.id, p]));

    const normalized = items.map((item: any) => ({
      productId: Number(item.productId),
      quantity: Number(item.quantity)
    }));

    for (const item of normalized) {
      const product = productMap.get(item.productId);

      if (!product || !Number.isFinite(item.quantity) || item.quantity <= 0) {
        res.status(400).json({ success: false, message: "Produit ou quantité invalide." });
        return;
      }

      if (item.quantity > product.availableStock) {
        res.status(400).json({
          success: false,
          message: "La quantité demandée dépasse le stock actuellement disponible."
        });
        return;
      }
    }

    const code = nextOrderCode();

    const transaction = db.transaction(() => {
      let total = 0;

      for (const item of normalized) {
        const product = productMap.get(item.productId)!;
        total += item.quantity * product.sellingPriceAr;
      }

      const result = db.prepare(`
        INSERT INTO orders (
          code, user_id, customer_name, customer_phone,
          status, total_ar, notes
        )
        VALUES (?, ?, ?, ?, 'EN_ATTENTE', ?, ?)
      `).run(
        code,
        req.user!.id,
        user.fullName,
        user.phone,
        total,
        String(req.body.notes || "").trim() || null
      );

      const orderId = Number(result.lastInsertRowid);
      const insertItem = db.prepare(`
        INSERT INTO order_items (
          order_id, product_id, quantity, unit_price_ar, total_ar
        )
        VALUES (?, ?, ?, ?, ?)
      `);

      for (const item of normalized) {
        const product = productMap.get(item.productId)!;
        insertItem.run(
          orderId,
          item.productId,
          item.quantity,
          product.sellingPriceAr,
          item.quantity * product.sellingPriceAr
        );
      }

      return total;
    });

    const total = transaction();

    res.status(201).json({
      success: true,
      message: "Commande enregistrée.",
      code,
      totalAr: total
    });
  }
);

router.get(
  "/orders",
  authMiddleware,
  requireRoles("ADMIN", "COMMERCIAL"),
  (_req, res) => {
    const orders = db.prepare(`
      SELECT
        o.id, o.code,
        o.customer_name AS customerName,
        o.customer_phone AS customerPhone,
        o.status,
        o.total_ar AS totalAr,
        o.notes,
        o.created_at AS createdAt
      FROM orders o
      ORDER BY o.id DESC
    `).all();

    res.json({ success: true, orders });
  }
);

router.patch(
  "/orders/:id/status",
  authMiddleware,
  requireRoles("ADMIN", "COMMERCIAL"),
  (req, res) => {
    const id = Number(req.params.id);
    const status = String(req.body.status || "").toUpperCase();
    const allowed = ["EN_ATTENTE", "CONFIRMEE", "PREPAREE", "LIVREE", "ANNULEE"];

    if (!allowed.includes(status)) {
      res.status(400).json({ success: false, message: "Statut invalide." });
      return;
    }

    const result = db.prepare(`
      UPDATE orders
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, id);

    if (result.changes === 0) {
      res.status(404).json({ success: false, message: "Commande introuvable." });
      return;
    }

    res.json({ success: true, message: "Statut de commande mis à jour." });
  }
);

export default router;
