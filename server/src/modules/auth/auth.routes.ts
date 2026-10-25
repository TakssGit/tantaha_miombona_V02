import {
  Router
} from "express";

import {
  loginController,
  meController
} from "./auth.controller.js";

import {
  authMiddleware
} from "../../middleware/auth.middleware.js";

import {
  authRateLimitMiddleware
} from "../../middleware/security-rate-limit.middleware.js";

const router = Router();

router.post(
  "/login",
  authRateLimitMiddleware,
  loginController
);

router.get(
  "/me",
  authMiddleware,
  meController
);

export default router;
