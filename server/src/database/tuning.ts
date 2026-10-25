import db
  from "./database.js";

db.pragma(
  "foreign_keys = ON"
);

db.pragma(
  "journal_mode = WAL"
);

db.pragma(
  "synchronous = NORMAL"
);

db.pragma(
  "busy_timeout = 5000"
);

export default db;
