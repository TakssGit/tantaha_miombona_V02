CREATE TABLE IF NOT EXISTS account_audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_user_id INTEGER,
  target_user_id INTEGER,
  action TEXT NOT NULL,
  details TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (actor_user_id)
    REFERENCES users(id)
    ON DELETE SET NULL,
  FOREIGN KEY (target_user_id)
    REFERENCES users(id)
    ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS
idx_account_audit_target
ON account_audit_logs(target_user_id);

CREATE INDEX IF NOT EXISTS
idx_account_audit_created
ON account_audit_logs(created_at);
