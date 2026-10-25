import fs from "node:fs";
import path from "node:path";
import {
  execSync
} from "node:child_process";

import { env } from "../src/config/env.js";

const databasePath =
  path.resolve(
    process.cwd(),
    env.databasePath
  );

const files = [
  databasePath,
  `${databasePath}-wal`,
  `${databasePath}-shm`
];

for (const file of files) {
  if (
    fs.existsSync(file)
  ) {
    fs.unlinkSync(file);
  }
}

console.log(
  "Ancienne base supprimée."
);

execSync(
  "npm run db:migrate",
  {
    stdio: "inherit"
  }
);

execSync(
  "npm run db:seed",
  {
    stdio: "inherit"
  }
);

console.log(
  "Base réinitialisée."
);
