import type {
  NextFunction,
  Request,
  Response
} from "express";

export const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const message =
    error instanceof Error
      ? error.message
      : "Erreur inconnue";

  console.error(
    `[${new Date().toISOString()}]`,
    req.method,
    req.originalUrl,
    message
  );

  if (res.headersSent) {
    return;
  }

  res.status(500).json({
    success: false,
    message:
      "Une erreur interne est survenue."
  });
};
