import app from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(
  env.port,
  process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1",
  () => {
    console.log("");
    console.log(
      "=========================================="
    );

    console.log(
      ` ${env.appName}`
    );

    console.log(
      " API LOCALE OPERATIONNELLE"
    );

    console.log(
      "=========================================="
    );

    console.log("");

    console.log(
      `Serveur : http://127.0.0.1:${env.port}`
    );

    console.log(
      `API     : http://127.0.0.1:${env.port}/api`
    );

    console.log(
      `Health  : http://127.0.0.1:${env.port}/api/health`
    );

    console.log("");
  }
);

const shutdown = (): void => {
  console.log(
    "\nArrêt du serveur..."
  );

  server.close(() => {
    process.exit(0);
  });
};

process.on(
  "SIGINT",
  shutdown
);

process.on(
  "SIGTERM",
  shutdown
);