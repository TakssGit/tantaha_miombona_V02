import { Router } from "express";
import db from "../../database/database.js";
import { hashPassword } from "../../utils/password.js";
import { isPublicRole, validatePassword, validateUsername } from "../../utils/account-validation.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { requireRoles } from "../../middleware/role.middleware.js";

const router = Router();

router.post("/auth/register", async (req, res) => {
  const fullName = String(req.body.fullName || "").trim();
  const username = String(req.body.username || "").trim();
  const phone = String(req.body.phone || "").trim();
  const password = String(req.body.password || "");
  const role = String(req.body.role || "").trim();

  if (fullName.length < 3) {
    res.status(400).json({ success: false, message: "Nom complet invalide." });
    return;
  }

  const usernameError = validateUsername(username);
  if (usernameError) {
    res.status(400).json({ success: false, message: usernameError });
    return;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    res.status(400).json({ success: false, message: passwordError });
    return;
  }

  if (!isPublicRole(role)) {
    res.status(400).json({ success: false, message: "Type de compte non autorisé." });
    return;
  }

  const existing = db.prepare(`
    SELECT id FROM users WHERE LOWER(username) = LOWER(?)
  `).get(username);

  if (existing) {
    res.status(409).json({ success: false, message: "Cet identifiant n'est pas disponible." });
    return;
  }

  const roleRow = db.prepare(`SELECT id FROM roles WHERE code = ?`).get(role) as
    | { id: number }
    | undefined;

  if (!roleRow) {
    res.status(500).json({ success: false, message: "Rôle indisponible." });
    return;
  }

  const passwordHash = await hashPassword(password);

  db.prepare(`
    INSERT INTO users (
      username, full_name, phone, password_hash,
      role_id, active, approval_status, requested_role
    )
    VALUES (?, ?, ?, ?, ?, 0, 'PENDING', ?)
  `).run(username, fullName, phone || null, passwordHash, roleRow.id, role);

  res.status(201).json({
    success: true,
    message: "Demande de compte enregistrée. Elle doit être validée par un administrateur."
  });
});

router.get(
  "/admin/registrations",
  authMiddleware,
  requireRoles("ADMIN"),
  (_req, res) => {
    const registrations = db.prepare(`
      SELECT
        u.id,
        u.username,
        u.full_name AS fullName,
        u.phone,
        u.requested_role AS requestedRole,
        u.approval_status AS approvalStatus,
        u.active,
        u.created_at AS createdAt
      FROM users u
      WHERE u.requested_role IN ('PRODUCTEUR', 'DISTRIBUTEUR')
      ORDER BY CASE WHEN u.approval_status = 'PENDING' THEN 0 ELSE 1 END, u.id DESC
    `).all();

    res.json({ success: true, registrations });
  }
);

router.patch(
  "/admin/registrations/:id/approve",
  authMiddleware,
  requireRoles("ADMIN"),
  (req, res) => {
    const id = Number(req.params.id);

    const target = db.prepare(`
      SELECT id, requested_role AS requestedRole
      FROM users
      WHERE id = ?
    `).get(id) as { id: number; requestedRole: string | null } | undefined;

    if (!target || !target.requestedRole || !isPublicRole(target.requestedRole)) {
      res.status(404).json({ success: false, message: "Demande introuvable." });
      return;
    }

    const roleRow = db.prepare(`SELECT id FROM roles WHERE code = ?`).get(target.requestedRole) as { id: number };

    db.prepare(`
      UPDATE users
      SET role_id = ?, active = 1, approval_status = 'APPROVED',
          approved_at = CURRENT_TIMESTAMP, approved_by = ?
      WHERE id = ?
    `).run(roleRow.id, req.user!.id, id);

    res.json({ success: true, message: "Compte approuvé." });
  }
);

router.patch(
  "/admin/registrations/:id/reject",
  authMiddleware,
  requireRoles("ADMIN"),
  (req, res) => {
    const id = Number(req.params.id);

    const result = db.prepare(`
      UPDATE users
      SET active = 0, approval_status = 'REJECTED',
          approved_at = CURRENT_TIMESTAMP, approved_by = ?
      WHERE id = ? AND requested_role IN ('PRODUCTEUR', 'DISTRIBUTEUR')
    `).run(req.user!.id, id);

    if (result.changes === 0) {
      res.status(404).json({ success: false, message: "Demande introuvable." });
      return;
    }

    res.json({ success: true, message: "Demande rejetée." });
  }
);

export default router;
