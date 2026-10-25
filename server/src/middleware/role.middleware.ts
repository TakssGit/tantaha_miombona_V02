import type {
  NextFunction,
  Request,
  Response
} from "express";

export const requireRoles =
  (...roles: string[]) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentification requise."
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "Accès non autorisé."
      });
      return;
    }

    next();
  };

// Compatibilité avec les modules P0-P20.
export const allowRoles = requireRoles;
