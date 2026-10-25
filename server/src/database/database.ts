import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

import { env } from "../config/env.js";

const databasePath =
  path.resolve(
    process.cwd(),
    env.databasePath
  );

const databaseDirectory =
  path.dirname(databasePath);

if (
  !fs.existsSync(
    databaseDirectory
  )
) {
  fs.mkdirSync(
    databaseDirectory,
    {
      recursive: true
    }
  );
}

export const db =
  new Database(databasePath);

db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

export default db;
