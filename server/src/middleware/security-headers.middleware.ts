import type {
  NextFunction,
  Request,
  Response
} from "express";

export const securityHeadersMiddleware =
  (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.setHeader(
      "X-Content-Type-Options",
      "nosniff"
    );

    res.setHeader(
      "X-Frame-Options",
      "DENY"
    );

    res.setHeader(
      "Referrer-Policy",
      "no-referrer"
    );

    res.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
    );

    res.setHeader(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
        "font-src 'self' data:",
        "connect-src 'self' http://127.0.0.1:3000 http://localhost:3000",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join("; ")
    );

    next();
  };
