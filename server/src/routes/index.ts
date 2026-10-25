import {
  Router
} from "express";

import { env }
  from "../config/env.js";

import authRoutes
  from "../modules/auth/auth.routes.js";

import userRoutes
  from "../modules/users/users.routes.js";

import businessRoutes
  from "../modules/business/business.routes.js";

import {
  authMiddleware
} from "../middleware/auth.middleware.js";

const router =
  Router();

router.get(
  "/",
  (_req, res) => {
    res.json({
      success: true,
      application:
        env.appName,
      message:
        "API locale opérationnelle."
    });
  }
);

router.get(
  "/health",
  (_req, res) => {
    res.json({
      success: true,
      status: "ok",
      application:
        env.appName,
      mode: "local",
      timestamp:
        new Date().toISOString()
    });
  }
);

router.use(
  "/auth",
  authRoutes
);

router.use(
  authMiddleware
);

router.use(
  "/users",
  userRoutes
);

router.use(
  businessRoutes
);

export default router;
