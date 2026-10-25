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

const router = Router();

router.get(
  "/system/diagnostics",
  authMiddleware,
  requireRoles("ADMIN"),
  (_req, res) => {
    const requiredTables = [
      "users",
      "roles",
      "producers",
      "harvest_lots",
      "products",
      "orders",
      "harvest_forecasts"
    ];

    const existing =
      db.prepare(`
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
      `).all() as
        Array<{
          name: string;
        }>;

    const tableNames =
      new Set(
        existing.map(
          (row) => row.name
        )
      );

    const missingTables =
      requiredTables.filter(
        (name) =>
          !tableNames.has(name)
      );

    const userCount =
      db.prepare(`
        SELECT COUNT(*) AS total
        FROM users
      `).get() as {
        total: number;
      };

    const activeAdminCount =
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

    const integrity =
      db.pragma(
        "integrity_check",
        {
          simple: true
        }
      );

    res.json({
      success: true,
      database: {
        integrity,
        missingTables,
        userCount:
          userCount.total,
        activeAdminCount:
          activeAdminCount.total
      },
      runtime: {
        node:
          process.version,
        platform:
          process.platform,
        architecture:
          process.arch
      }
    });
  }
);

export default router;
