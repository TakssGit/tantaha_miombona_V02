-- P23 - inscription sécurisée.
-- created_at existe déjà depuis 001_initial.sql.
ALTER TABLE users ADD COLUMN phone TEXT;
ALTER TABLE users ADD COLUMN approval_status TEXT NOT NULL DEFAULT 'APPROVED';
ALTER TABLE users ADD COLUMN requested_role TEXT;
ALTER TABLE users ADD COLUMN approved_at TEXT;
ALTER TABLE users ADD COLUMN approved_by INTEGER;

CREATE UNIQUE INDEX IF NOT EXISTS ux_users_username_nocase
ON users(username COLLATE NOCASE);

UPDATE users
SET approval_status = 'APPROVED'
WHERE approval_status IS NULL OR approval_status = '';
