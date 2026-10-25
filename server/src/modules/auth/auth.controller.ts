import type {
  NextFunction,
  Request,
  Response
} from "express";

import {
  login
} from "./auth.service.js";

export const loginController =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const username =
        String(
          req.body.username || ""
        ).trim();

      const password =
        String(
          req.body.password || ""
        );

      if (
        !username ||
        !password
      ) {
        res.status(400).json({
          success: false,
          message:
            "Identifiant et mot de passe requis."
        });
        return;
      }

      const result =
        await login(
          username,
          password
        );

      if (!result) {
        res.status(401).json({
          success: false,
          message:
            "Identifiant ou mot de passe incorrect."
        });
        return;
      }

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  };

export const meController =
  (
    req: Request,
    res: Response
  ) => {
    res.json({
      success: true,
      user:
        req.user
    });
  };
