import {
  Router
} from "express";

import registrationRouter
  from "../modules/account/registration.routes.js";
import passwordResetRouter
  from "../modules/account/password-reset.routes.js";
import forecastRouter
  from "../modules/agri/forecast.routes.js";
import commerceRouter
  from "../modules/commerce/commerce.routes.js";
import adminUsersRouter
  from "../modules/admin/admin-users.routes.js";
import systemRouter
  from "../modules/system/system.routes.js";

import supplyPreordersRouter from "../modules/supply-preorders/supply-preorders.routes.js";

import appConfigRouter from "../modules/app-config/app-config.routes.js";
const router = Router();

router.get(
  "/platform/status",
  (_req, res) => {
    res.json({
      success: true,
      module: "platform",
      version: "P28"
    });
  }
);

router.use(registrationRouter);
router.use(passwordResetRouter);
router.use(forecastRouter);
router.use(commerceRouter);
router.use(adminUsersRouter);
router.use(systemRouter);
router.use(appConfigRouter);
router.use(supplyPreordersRouter);

export default router;
