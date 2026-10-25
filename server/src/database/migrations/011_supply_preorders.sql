CREATE TABLE IF NOT EXISTS supply_preorders (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 code TEXT NOT NULL UNIQUE,
 producer_id INTEGER NOT NULL REFERENCES producers(id),
 created_by_user_id INTEGER NOT NULL REFERENCES users(id),
 product TEXT NOT NULL,
 quantity_kg REAL NOT NULL CHECK(quantity_kg > 0),
 available_from TEXT NOT NULL,
 available_until TEXT NOT NULL,
 technical_notes TEXT NOT NULL DEFAULT '',
 sanitary_notes TEXT NOT NULL DEFAULT '',
 status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING','VALIDATED','REJECTED','CANCELLED')),
 review_notes TEXT,
 reviewed_by_user_id INTEGER REFERENCES users(id),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CHECK(available_until >= available_from)
);
CREATE INDEX IF NOT EXISTS idx_supply_preorders_user ON supply_preorders(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_supply_preorders_status ON supply_preorders(status);
