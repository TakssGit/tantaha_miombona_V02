import type {
  NextFunction,
  Request,
  Response
} from "express";

type Entry = {
  count: number;
  resetAt: number;
};

const attempts =
  new Map<string, Entry>();

const WINDOW_MS =
  15 * 60 * 1000;

const MAX_ATTEMPTS = 15;

export const authRateLimitMiddleware =
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const now = Date.now();
    const key =
      `${req.ip}:${req.path}`;

    const current =
      attempts.get(key);

    if (
      !current ||
      current.resetAt <= now
    ) {
      attempts.set(key, {
        count: 1,
        resetAt:
          now + WINDOW_MS
      });

      next();
      return;
    }

    if (
      current.count >=
      MAX_ATTEMPTS
    ) {
      res.status(429).json({
        success: false,
        message:
          "Trop de tentatives. Réessayez plus tard."
      });
      return;
    }

    current.count += 1;
    attempts.set(key, current);

    next();
  };
