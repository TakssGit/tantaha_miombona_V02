import {
  existsSync
} from "node:fs";

import {
  resolve
} from "node:path";

import cors from "cors";
import express from "express";

import "./database/tuning.js";

import apiRouter
  from "./routes/index.js";
import platformRouter
  from "./routes/platform.routes.js";

import {
  env
} from "./config/env.js";

import {
  securityHeadersMiddleware
} from "./middleware/security-headers.middleware.js";
import {
  passwordChangeGuardMiddleware
} from "./middleware/password-change-guard.middleware.js";
import {
  rbacGatewayMiddleware
} from "./middleware/rbac-gateway.middleware.js";
import {
  notFoundMiddleware
} from "./middleware/notfound.middleware.js";
import {
  errorMiddleware
} from "./middleware/error.middleware.js";

const app = express();

// Le backend est lancé normalement depuis le dossier server.
// Ce calcul fonctionne aussi lorsque l'application est lancée depuis la racine.
const clientDist =
  process.cwd().endsWith("server")
    ? resolve(
        process.cwd(),
        "../client/dist"
      )
    : resolve(
        process.cwd(),
        "client/dist"
      );

const clientIndex =
  resolve(
    clientDist,
    "index.html"
  );

app.disable("x-powered-by");

app.use(
  securityHeadersMiddleware
);

app.use(
  cors({
    origin: [
      env.clientUrl,
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ],
    credentials: true
  })
);

app.use(
  express.json({
    limit: "1mb"
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb"
  })
);

app.use(
  "/api",
  passwordChangeGuardMiddleware
);

// P21-P28 : endpoints publics et endpoints qui possèdent
// leur propre auth/contrôle de rôle.
app.use(
  "/api",
  platformRouter
);

// P0-P20 : API métier historique avec protection RBAC additionnelle.
app.use(
  "/api",
  rbacGatewayMiddleware,
  apiRouter
);

app.use(
  "/api",
  notFoundMiddleware
);

if (existsSync(clientIndex)) {
  app.use(
    express.static(clientDist)
  );

  app.get(
    "*",
    (req, res, next) => {
      if (
        req.path.startsWith(
          "/api"
        )
      ) {
        next();
        return;
      }

      res.sendFile(clientIndex);
    }
  );
} else {
  app.get(
    "/",
    (_req, res) => {
      res.json({
        application:
          env.appName,
        status:
          "Serveur local actif",
        api: "/api",
        client:
          "Build client absent. Lancez npm run build --prefix client."
      });
    }
  );
}

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
