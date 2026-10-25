import type {
  NextFunction,
  Request,
  Response
} from "express";

import db
  from "../database/database.js";

import {
  verifyToken
} from "../utils/jwt.js";

const allowedPaths = [
  "/auth/login",
  "/auth/me",
  "/auth/change-password",
  "/auth/forgot-password",
  "/public/catalog",
  "/platform/status"
];

export const passwordChangeGuardMiddleware =
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (
      allowedPaths.some(
        (path) =>
          req.path === path ||
          req.path.startsWith(
            `${path}/`
          )
      )
    ) {
      next();
      return;
    }

    const value =
      req.headers.authorization;

    if (
      !value ||
      !value.startsWith(
        "Bearer "
      )
    ) {
      next();
      return;
    }

    try {
      const token =
        value.slice(7).trim();

      const payload =
        verifyToken(token);

      const row =
        db.prepare(`
          SELECT
            must_change_password
              AS mustChangePassword
          FROM users
          WHERE id = ?
        `).get(
          payload.id
        ) as
          | {
              mustChangePassword:
                number;
            }
          | undefined;

      if (
        row?.mustChangePassword ===
        1
      ) {
        res.status(428).json({
          success: false,
          code:
            "PASSWORD_CHANGE_REQUIRED",
          message:
            "Vous devez modifier votre mot de passe avant de continuer."
        });
        return;
      }

      next();
    } catch {
      next();
    }
  };
