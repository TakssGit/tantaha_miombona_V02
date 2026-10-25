import crypto from "node:crypto";

import {
  Router
} from "express";

import db
  from "../../database/database.js";

import {
  authMiddleware
} from "../../middleware/auth.middleware.js";

import {
  requireRoles
} from "../../middleware/role.middleware.js";

import {
  hashPassword
} from "../../utils/password.js";

import {
  validateUsername
} from "../../utils/account-validation.js";

const router = Router();

const allowedRoles = [
  "ADMIN",
  "GESTIONNAIRE",
  "QUALITE",
  "PRODUCTION",
  "COMMERCIAL",
  "POINT_FOCAL",
  "PRODUCTEUR",
  "DISTRIBUTEUR"
];

const generateTemporaryPassword =
  (): string => {
    const token =
      crypto
        .randomBytes(5)
        .toString("hex");

    return `Tm-${token}-B7`;
  };

const writeAudit = (
  actorUserId: number,
  targetUserId: number | null,
  action: string,
  details?: unknown
) => {
  db.prepare(`
    INSERT INTO account_audit_logs (
      actor_user_id,
      target_user_id,
      action,
      details
    )
    VALUES (?, ?, ?, ?)
  `).run(
    actorUserId,
    targetUserId,
    action,
    details === undefined
      ? null
      : JSON.stringify(details)
  );
};

const getRoleId = (
  role: string
): number | null => {
  const row =
    db.prepare(`
      SELECT id
      FROM roles
      WHERE code = ?
    `).get(role) as
      | { id: number }
      | undefined;

  return row?.id ?? null;
};

const activeAdminCount =
  (): number => {
    const row =
      db.prepare(`
        SELECT COUNT(*) AS total
        FROM users u
        INNER JOIN roles r
          ON r.id = u.role_id
        WHERE
          r.code = 'ADMIN'
          AND u.active = 1
      `).get() as {
        total: number;
      };

    return row.total;
  };

router.get(
  "/admin/users",
  authMiddleware,
  requireRoles("ADMIN"),
  (req, res) => {
    const q =
      String(
        req.query.q || ""
      ).trim();

    const role =
      String(
        req.query.role || ""
      ).trim();

    const active =
      String(
        req.query.active || ""
      ).trim();

    const conditions:
      string[] = [];

    const params:
      Array<string | number> = [];

    if (q) {
      conditions.push(`
        (
          u.username LIKE ?
          OR u.full_name LIKE ?
          OR COALESCE(u.phone, '') LIKE ?
        )
      `);

      const like = `%${q}%`;
      params.push(
        like,
        like,
        like
      );
    }

    if (role) {
      conditions.push(
        "r.code = ?"
      );
      params.push(role);
    }

    if (
      active === "0" ||
      active === "1"
    ) {
      conditions.push(
        "u.active = ?"
      );
      params.push(
        Number(active)
      );
    }

    const where =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    const users =
      db.prepare(`
        SELECT
          u.id,
          u.username,
          u.full_name AS fullName,
          u.phone,
          r.code AS role,
          u.active,
          COALESCE(
            u.approval_status,
            'APPROVED'
          ) AS approvalStatus,
          COALESCE(
            u.must_change_password,
            0
          ) AS mustChangePassword,
          COALESCE(
            u.failed_login_attempts,
            0
          ) AS failedLoginAttempts,
          u.locked_until AS lockedUntil,
          u.last_login_at AS lastLoginAt,
          u.created_at AS createdAt
        FROM users u
        INNER JOIN roles r
          ON r.id = u.role_id
        ${where}
        ORDER BY
          u.active DESC,
          u.full_name
      `).all(...params);

    res.json({
      success: true,
      users,
      roles: allowedRoles
    });
  }
);

router.post(
  "/admin/users",
  authMiddleware,
  requireRoles("ADMIN"),
  async (req, res) => {
    try {
      const fullName =
        String(
          req.body.fullName || ""
        ).trim();

      const username =
        String(
          req.body.username || ""
        ).trim();

      const phone =
        String(
          req.body.phone || ""
        ).trim();

      const role =
        String(
          req.body.role || ""
        ).trim();

      if (fullName.length < 3) {
        res.status(400).json({
          success: false,
          message:
            "Nom complet invalide."
        });
        return;
      }

      const usernameError =
        validateUsername(
          username
        );

      if (usernameError) {
        res.status(400).json({
          success: false,
          message:
            usernameError
        });
        return;
      }

      if (
        !allowedRoles.includes(role)
      ) {
        res.status(400).json({
          success: false,
          message:
            "Rôle invalide."
        });
        return;
      }

      const existing =
        db.prepare(`
          SELECT id
          FROM users
          WHERE LOWER(username)
            = LOWER(?)
        `).get(username);

      if (existing) {
        res.status(409).json({
          success: false,
          message:
            "Identifiant déjà utilisé."
        });
        return;
      }

      const roleId =
        getRoleId(role);

      if (!roleId) {
        res.status(400).json({
          success: false,
          message:
            "Rôle introuvable."
        });
        return;
      }

      const temporaryPassword =
        generateTemporaryPassword();

      const passwordHash =
        await hashPassword(
          temporaryPassword
        );

      const result =
        db.prepare(`
          INSERT INTO users (
            username,
            full_name,
            phone,
            password_hash,
            role_id,
            active,
            approval_status,
            requested_role,
            must_change_password
          )
          VALUES (
            ?, ?, ?, ?, ?,
            1, 'APPROVED', NULL, 1
          )
        `).run(
          username,
          fullName,
          phone || null,
          passwordHash,
          roleId
        );

      const userId =
        Number(
          result.lastInsertRowid
        );

      writeAudit(
        req.user!.id,
        userId,
        "USER_CREATED",
        {
          username,
          role
        }
      );

      res.status(201).json({
        success: true,
        message:
          "Utilisateur créé.",
        userId,
        temporaryPassword
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message:
          "Création impossible."
      });
    }
  }
);

router.patch(
  "/admin/users/:id",
  authMiddleware,
  requireRoles("ADMIN"),
  (req, res) => {
    const id =
      Number(req.params.id);

    const fullName =
      String(
        req.body.fullName || ""
      ).trim();

    const phone =
      String(
        req.body.phone || ""
      ).trim();

    const role =
      String(
        req.body.role || ""
      ).trim();

    const active =
      Number(req.body.active);

    if (
      !Number.isInteger(id) ||
      fullName.length < 3 ||
      !allowedRoles.includes(role) ||
      ![0, 1].includes(active)
    ) {
      res.status(400).json({
        success: false,
        message:
          "Données utilisateur invalides."
      });
      return;
    }

    const target =
      db.prepare(`
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
        message:
          "Utilisateur introuvable."
      });
      return;
    }

    if (
      id === req.user!.id &&
      (
        active === 0 ||
        role !== target.role
      )
    ) {
      res.status(400).json({
        success: false,
        message:
          "Vous ne pouvez pas désactiver votre propre compte ni modifier votre propre rôle."
      });
      return;
    }

    const removesActiveAdmin =
      target.role === "ADMIN" &&
      target.active === 1 &&
      (
        role !== "ADMIN" ||
        active === 0
      );

    if (
      removesActiveAdmin &&
      activeAdminCount() <= 1
    ) {
      res.status(400).json({
        success: false,
        message:
          "Impossible de désactiver ou rétrograder le dernier administrateur actif."
      });
      return;
    }

    const roleId =
      getRoleId(role);

    if (!roleId) {
      res.status(400).json({
        success: false,
        message:
          "Rôle introuvable."
      });
      return;
    }

    db.prepare(`
      UPDATE users
      SET
        full_name = ?,
        phone = ?,
        role_id = ?,
        active = ?,
        approval_status =
          'APPROVED'
      WHERE id = ?
    `).run(
      fullName,
      phone || null,
      roleId,
      active,
      id
    );

    writeAudit(
      req.user!.id,
      id,
      "USER_UPDATED",
      {
        fullName,
        role,
        active
      }
    );

    res.json({
      success: true,
      message:
        "Utilisateur mis à jour."
    });
  }
);

router.post(
  "/admin/users/:id/reset-password",
  authMiddleware,
  requireRoles("ADMIN"),
  async (req, res) => {
    try {
      const id =
        Number(req.params.id);

      const target =
        db.prepare(`
          SELECT
            id,
            username
          FROM users
          WHERE id = ?
        `).get(id) as
          | {
              id: number;
              username: string;
            }
          | undefined;

      if (!target) {
        res.status(404).json({
          success: false,
          message:
            "Utilisateur introuvable."
        });
        return;
      }

      const temporaryPassword =
        generateTemporaryPassword();

      const passwordHash =
        await hashPassword(
          temporaryPassword
        );

      db.prepare(`
        UPDATE users
        SET
          password_hash = ?,
          must_change_password = 1,
          failed_login_attempts = 0,
          locked_until = NULL,
          password_changed_at =
            CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        passwordHash,
        id
      );

      writeAudit(
        req.user!.id,
        id,
        "PASSWORD_RESET",
        {
          username:
            target.username
        }
      );

      res.json({
        success: true,
        message:
          "Mot de passe réinitialisé.",
        temporaryPassword
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message:
          "Réinitialisation impossible."
      });
    }
  }
);

router.post(
  "/admin/users/:id/unlock",
  authMiddleware,
  requireRoles("ADMIN"),
  (req, res) => {
    const id =
      Number(req.params.id);

    const result =
      db.prepare(`
        UPDATE users
        SET
          failed_login_attempts = 0,
          locked_until = NULL
        WHERE id = ?
      `).run(id);

    if (result.changes === 0) {
      res.status(404).json({
        success: false,
        message:
          "Utilisateur introuvable."
      });
      return;
    }

    writeAudit(
      req.user!.id,
      id,
      "USER_UNLOCKED"
    );

    res.json({
      success: true,
      message:
        "Compte déverrouillé."
    });
  }
);

router.get(
  "/admin/users/audit",
  authMiddleware,
  requireRoles("ADMIN"),
  (_req, res) => {
    const rows =
      db.prepare(`
        SELECT
          a.id,
          a.action,
          a.details,
          a.created_at AS createdAt,
          actor.full_name AS actorName,
          target.full_name AS targetName
        FROM account_audit_logs a
        LEFT JOIN users actor
          ON actor.id =
             a.actor_user_id
        LEFT JOIN users target
          ON target.id =
             a.target_user_id
        ORDER BY a.id DESC
        LIMIT 100
      `).all();

    res.json({
      success: true,
      logs: rows
    });
  }
);

export default router;
