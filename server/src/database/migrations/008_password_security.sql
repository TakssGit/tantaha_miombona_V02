ALTER TABLE users
ADD COLUMN failed_login_attempts INTEGER NOT NULL DEFAULT 0;

ALTER TABLE users
ADD COLUMN locked_until TEXT;

ALTER TABLE users
ADD COLUMN must_change_password INTEGER NOT NULL DEFAULT 0;

ALTER TABLE users
ADD COLUMN last_login_at TEXT;

ALTER TABLE users
ADD COLUMN password_changed_at TEXT;

CREATE TABLE IF NOT EXISTS password_reset_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  requested_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'PENDING',
  processed_at TEXT,
  processed_by INTEGER,
  FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  FOREIGN KEY (processed_by)
    REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS security_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  username TEXT,
  event_type TEXT NOT NULL,
  details TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS
idx_password_reset_status
ON password_reset_requests(status);

CREATE INDEX IF NOT EXISTS
idx_security_events_user
ON security_events(user_id);
