import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import db from "../src/database/database.js";

const migrationsDirectory =
  path.resolve(
    process.cwd(),
    "src/database/migrations"
  );

db.exec(`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    filename TEXT PRIMARY KEY,
    checksum TEXT NOT NULL,
    applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const files =
  fs.readdirSync(migrationsDirectory)
    .filter((file) =>
      file.endsWith(".sql")
    )
    .sort();

const getChecksum = (sql: string) =>
  crypto
    .createHash("sha256")
    .update(sql)
    .digest("hex");

const isInitialSafeMigration =
  (file: string) =>
    [
      "001_initial.sql",
      "002_indexes.sql",
      "003_seed_settings.sql"
    ].includes(file);

for (const file of files) {
  const filePath =
    path.join(
      migrationsDirectory,
      file
    );

  const sql =
    fs.readFileSync(
      filePath,
      "utf8"
    );

  const checksum =
    getChecksum(sql);

  const applied =
    db.prepare(`
      SELECT filename, checksum
      FROM schema_migrations
      WHERE filename = ?
    `).get(file) as
      | {
          filename: string;
          checksum: string;
        }
      | undefined;

  if (applied) {
    console.log(
      `Déjà appliquée : ${file}`
    );
    continue;
  }

  console.log(
    `Migration : ${file}`
  );

  try {
    const transaction =
      db.transaction(() => {
        db.exec(sql);

        db.prepare(`
          INSERT INTO schema_migrations (
            filename,
            checksum
          )
          VALUES (?, ?)
        `).run(
          file,
          checksum
        );
      });

    transaction();
  } catch (error) {
    // Une ancienne installation P0-P20 peut déjà posséder 001-003
    // sans table de suivi. Ces migrations sont idempotentes et sont
    // normalement rejouables. Toute autre erreur reste bloquante.
    if (isInitialSafeMigration(file)) {
      console.error(error);
    }

    throw error;
  }
}

console.log(
  "Migrations terminées."
);

db.close();
