import {
  Router
} from "express";

import db from "../../database/database.js";

import {
  hashPassword
} from "../../utils/password.js";

import {
  allowRoles
} from "../../middleware/role.middleware.js";

const router = Router();

const activeAdminCount = () => {
  const row = db.prepare(`
    SELECT COUNT(*) AS total
    FROM users u
    INNER JOIN roles r
      ON r.id = u.role_id
    WHERE r.code = 'ADMIN'
      AND u.active = 1
  `).get() as { total: number };

  return row.total;
};

router.get(
  "/",
  allowRoles("ADMIN"),
  (_req, res) => {
    const rows = db.prepare(`
      SELECT
        CAST(u.id AS TEXT) AS id,
        u.username,
        u.full_name AS fullName,
        r.code AS role,
        CASE
          WHEN u.active = 1 THEN 1
          ELSE 0
        END AS active,
        COALESCE(u.must_change_password, 0) AS mustChangePassword
      FROM users u
      INNER JOIN roles r
        ON r.id = u.role_id
      ORDER BY u.id DESC
    `).all();

    res.json(rows);
  }
);

router.post(
  "/",
  allowRoles("ADMIN"),
  async (req, res) => {
    const username =
      String(req.body.username || "").trim();
    const fullName =
      String(req.body.fullName || "").trim();
    const role =
      String(req.body.role || "").trim();
    const password =
      String(req.body.password || "");

    if (!username || !fullName || !role) {
      res.status(400).json({
        success: false,
        message: "Champs requis manquants."
      });
      return;
    }

    const existing = db.prepare(`
      SELECT id
      FROM users
      WHERE LOWER(username) = LOWER(?)
    `).get(username);

    if (existing) {
      res.status(409).json({
        success: false,
        message: "Identifiant déjà utilisé."
      });
      return;
    }

    const roleRow = db.prepare(`
      SELECT id
      FROM roles
      WHERE code = ?
    `).get(role) as
      | { id: number }
      | undefined;

    if (!roleRow) {
      res.status(400).json({
        success: false,
        message: "Rôle invalide."
      });
      return;
    }

    const passwordHash =
      await hashPassword(
        password || "Temp2026A"
      );

    const result = db.prepare(`
      INSERT INTO users (
        username,
        full_name,
        password_hash,
        role_id,
        active,
        approval_status,
        must_change_password
      )
      VALUES (?, ?, ?, ?, 1, 'APPROVED', 1)
    `).run(
      username,
      fullName,
      passwordHash,
      roleRow.id
    );

    res.status(201).json({
      id: String(result.lastInsertRowid),
      username,
      fullName,
      role,
      active: true,
      mustChangePassword: true
    });
  }
);

router.patch(
  "/:id/toggle",
  allowRoles("ADMIN"),
  (req, res) => {
    const id = Number(req.params.id);

    const target = db.prepare(`
      SELECT
        u.id,
        u.active,
        r.code AS role
      FROM users u
      INNER JOIN roles r
        ON r.id = u.role_id
      WHERE u.id = ?
    `).get(id) as
      | {
          id: number;
          active: number;
          role: string;
        }
      | undefined;

    if (!target) {
      res.status(404).json({
        success: false,
        message: "Utilisateur introuvable."
      });
      return;
    }

    if (id === req.user?.id) {
      res.status(400).json({
        success: false,
        message: "Vous ne pouvez pas désactiver votre propre compte."
      });
      return;
    }

    if (
      target.role === "ADMIN" &&
      target.active === 1 &&
      activeAdminCount() <= 1
    ) {
      res.status(400).json({
        success: false,
        message: "Impossible de désactiver le dernier administrateur actif."
      });
      return;
    }

    db.prepare(`
      UPDATE users
      SET active =
        CASE
          WHEN active = 1 THEN 0
          ELSE 1
        END
      WHERE id = ?
    `).run(id);

    res.json({
      success: true
    });
  }
);

export default router;
