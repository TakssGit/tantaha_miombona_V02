import type {
  NextFunction,
  Request,
  Response
} from "express";

import {
  verifyToken
} from "../utils/jwt.js";

export const authMiddleware =
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith(
        "Bearer "
      )
    ) {
      res.status(401).json({
        success: false,
        message:
          "Authentification requise."
      });

      return;
    }

    const token =
      authorization.slice(7);

    try {
      req.user =
        verifyToken(token);

      next();
    } catch {
      res.status(401).json({
        success: false,
        message:
          "Session invalide ou expirée."
      });
    }
  };
