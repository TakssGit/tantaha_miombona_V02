import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";

type AccessRule = {
  prefix: string;
  roles: string[];
  methods?: string[];
};

const STAFF = ["ADMIN", "GESTIONNAIRE", "QUALITE", "PRODUCTION", "COMMERCIAL"];

const rules: AccessRule[] = [
  { prefix: "/users", roles: ["ADMIN"] },
  { prefix: "/admin", roles: ["ADMIN"] },
  { prefix: "/dashboard", roles: STAFF, methods: ["GET"] },
  { prefix: "/producers", roles: ["ADMIN", "GESTIONNAIRE"] },
  { prefix: "/lots", roles: ["ADMIN", "GESTIONNAIRE", "QUALITE", "PRODUCTION"] },
  { prefix: "/quality-checks", roles: ["ADMIN", "GESTIONNAIRE", "QUALITE"] },
  { prefix: "/collections", roles: ["ADMIN", "GESTIONNAIRE"] },
  { prefix: "/transports", roles: ["ADMIN", "GESTIONNAIRE"] },
  { prefix: "/receptions", roles: ["ADMIN", "GESTIONNAIRE", "QUALITE", "PRODUCTION"] },
  { prefix: "/productions", roles: ["ADMIN", "GESTIONNAIRE", "PRODUCTION"] },
  { prefix: "/finished-batches", roles: ["ADMIN", "GESTIONNAIRE", "PRODUCTION", "COMMERCIAL"] },
  { prefix: "/products", roles: ["ADMIN", "GESTIONNAIRE", "PRODUCTION", "COMMERCIAL"] },
  { prefix: "/stocks", roles: ["ADMIN", "GESTIONNAIRE", "PRODUCTION", "COMMERCIAL"] },
  { prefix: "/customers", roles: ["ADMIN", "GESTIONNAIRE", "COMMERCIAL"] },
  { prefix: "/sales", roles: ["ADMIN", "GESTIONNAIRE", "COMMERCIAL"] },
  { prefix: "/non-conformities", roles: ["ADMIN", "GESTIONNAIRE", "QUALITE"] },
  { prefix: "/traceability", roles: STAFF, methods: ["GET"] }
];

const bearer = (req: Request): string | null => {
  const value = req.headers.authorization;
  if (!value || !value.startsWith("Bearer ")) return null;
  return value.slice(7).trim();
};

export const rbacGatewayMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const rule = rules.find((item) => {
    const pathMatch = req.path === item.prefix || req.path.startsWith(`${item.prefix}/`);
    const methodMatch = !item.methods || item.methods.includes(req.method);
    return pathMatch && methodMatch;
  });

  if (!rule) {
    next();
    return;
  }

  const token = bearer(req);
  if (!token) {
    res.status(401).json({ success: false, message: "Authentification requise." });
    return;
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;

    if (payload.role !== "ADMIN" && !rule.roles.includes(payload.role)) {
      res.status(403).json({ success: false, message: "Vous n'avez pas les droits nécessaires." });
      return;
    }

    next();
  } catch {
    res.status(401).json({ success: false, message: "Session invalide ou expirée." });
  }
};
