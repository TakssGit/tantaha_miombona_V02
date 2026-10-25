import crypto from "node:crypto";

import {
  Router
} from "express";

import db
  from "../../database/database.js";

import {
  comparePassword,
  hashPassword
} from "../../utils/password.js";

import {
  validatePassword
} from "../../utils/account-validation.js";

import {
  authMiddleware
} from "../../middleware/auth.middleware.js";

import {
  requireRoles
} from "../../middleware/role.middleware.js";

import {
  authRateLimitMiddleware
} from "../../middleware/security-rate-limit.middleware.js";

const router = Router();

const genericMessage =
  "Si le compte est valide, la demande sera transmise à l'administrateur.";

const generateTemporaryPassword =
  (): string => {
    const token =
      crypto
        .randomBytes(5)
        .toString("hex");

    return `Tm-${token}-A9`;
  };

router.post(
  "/auth/forgot-password",
  authRateLimitMiddleware,
  (req, res) => {
    const username =
      String(
        req.body.username || ""
      ).trim();

    if (username) {
      const user =
        db.prepare(`
          SELECT
            id,
            active,
            COALESCE(
              approval_status,
              'APPROVED'
            ) AS approvalStatus
          FROM users
          WHERE LOWER(username)
            = LOWER(?)
        `).get(username) as
          | {
              id: number;
              active: number;
              approvalStatus: string;
            }
          | undefined;

      if (
        user &&
        user.active === 1 &&
        user.approvalStatus ===
          "APPROVED"
      ) {
        const pending =
          db.prepare(`
            SELECT id
            FROM password_reset_requests
            WHERE user_id = ?
              AND status = 'PENDING'
            LIMIT 1
          `).get(user.id);

        if (!pending) {
          db.prepare(`
            INSERT INTO
              password_reset_requests (
                user_id,
                status
              )
            VALUES (?, 'PENDING')
          `).run(user.id);
        }
      }
    }

    res.json({
      success: true,
      message:
        genericMessage
    });
  }
);

router.get(
  "/admin/password-resets",
  authMiddleware,
  requireRoles("ADMIN"),
  (_req, res) => {
    const rows =
      db.prepare(`
        SELECT
          pr.id,
          pr.status,
          pr.requested_at
            AS requestedAt,
          pr.processed_at
            AS processedAt,
          u.id AS userId,
          u.username,
          u.full_name AS fullName,
          r.code AS role
        FROM password_reset_requests pr
        INNER JOIN users u
          ON u.id = pr.user_id
        INNER JOIN roles r
          ON r.id = u.role_id
        ORDER BY
          CASE
            WHEN pr.status = 'PENDING'
            THEN 0
            ELSE 1
          END,
          pr.id DESC
      `).all();

    res.json({
      success: true,
      requests: rows
    });
  }
);

router.post(
  "/admin/password-resets/:id/approve",
  authMiddleware,
  requireRoles("ADMIN"),
  async (req, res) => {
    const requestId =
      Number(req.params.id);

    const request =
      db.prepare(`
        SELECT
          pr.id,
          pr.user_id AS userId,
          u.username
        FROM password_reset_requests pr
        INNER JOIN users u
          ON u.id = pr.user_id
        WHERE
          pr.id = ?
          AND pr.status = 'PENDING'
      `).get(requestId) as
        | {
            id: number;
            userId: number;
            username: string;
          }
        | undefined;

    if (!request) {
      res.status(404).json({
        success: false,
        message:
          "Demande introuvable."
      });
      return;
    }

    const temporaryPassword =
      generateTemporaryPassword();

    const passwordHash =
      await hashPassword(
        temporaryPassword
      );

    const transaction =
      db.transaction(() => {
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
          request.userId
        );

        db.prepare(`
          UPDATE password_reset_requests
          SET
            status = 'DONE',
            processed_at =
              CURRENT_TIMESTAMP,
            processed_by = ?
          WHERE id = ?
        `).run(
          req.user!.id,
          requestId
        );

        db.prepare(`
          INSERT INTO security_events (
            user_id,
            username,
            event_type,
            details
          )
          VALUES (?, ?, ?, ?)
        `).run(
          request.userId,
          request.username,
          "PASSWORD_RESET_BY_ADMIN",
          `Processed by admin ${req.user!.id}`
        );
      });

    transaction();

    res.json({
      success: true,
      message:
        "Mot de passe temporaire généré.",
      temporaryPassword
    });
  }
);

router.post(
  "/admin/password-resets/:id/reject",
  authMiddleware,
  requireRoles("ADMIN"),
  (req, res) => {
    const requestId =
      Number(req.params.id);

    const result =
      db.prepare(`
        UPDATE password_reset_requests
        SET
          status = 'REJECTED',
          processed_at =
            CURRENT_TIMESTAMP,
          processed_by = ?
        WHERE
          id = ?
          AND status = 'PENDING'
      `).run(
        req.user!.id,
        requestId
      );

    if (result.changes === 0) {
      res.status(404).json({
        success: false,
        message:
          "Demande introuvable."
      });
      return;
    }

    res.json({
      success: true,
      message:
        "Demande rejetée."
    });
  }
);

router.post(
  "/auth/change-password",
  authMiddleware,
  async (req, res) => {
    const currentPassword =
      String(
        req.body.currentPassword ||
        ""
      );

    const newPassword =
      String(
        req.body.newPassword ||
        ""
      );

    const passwordError =
      validatePassword(
        newPassword
      );

    if (passwordError) {
      res.status(400).json({
        success: false,
        message: passwordError
      });
      return;
    }

    const user =
      db.prepare(`
        SELECT
          username,
          password_hash
            AS passwordHash
        FROM users
        WHERE id = ?
      `).get(
        req.user!.id
      ) as
        | {
            username: string;
            passwordHash: string;
          }
        | undefined;

    if (!user) {
      res.status(404).json({
        success: false,
        message:
          "Compte introuvable."
      });
      return;
    }

    const currentValid =
      await comparePassword(
        currentPassword,
        user.passwordHash
      );

    if (!currentValid) {
      res.status(400).json({
        success: false,
        message:
          "Mot de passe actuel incorrect."
      });
      return;
    }

    const samePassword =
      await comparePassword(
        newPassword,
        user.passwordHash
      );

    if (samePassword) {
      res.status(400).json({
        success: false,
        message:
          "Le nouveau mot de passe doit être différent de l'ancien."
      });
      return;
    }

    const newHash =
      await hashPassword(
        newPassword
      );

    db.prepare(`
      UPDATE users
      SET
        password_hash = ?,
        must_change_password = 0,
        failed_login_attempts = 0,
        locked_until = NULL,
        password_changed_at =
          CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      newHash,
      req.user!.id
    );

    db.prepare(`
      INSERT INTO security_events (
        user_id,
        username,
        event_type
      )
      VALUES (?, ?, ?)
    `).run(
      req.user!.id,
      user.username,
      "PASSWORD_CHANGED"
    );

    res.json({
      success: true,
      message:
        "Mot de passe modifié."
    });
  }
);

export default router;
