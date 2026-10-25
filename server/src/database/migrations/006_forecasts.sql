CREATE TABLE IF NOT EXISTS producer_user_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  producer_id INTEGER NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (producer_id) REFERENCES producers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS point_focal_producers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  point_focal_user_id INTEGER NOT NULL,
  producer_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (point_focal_user_id, producer_id),
  FOREIGN KEY (point_focal_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (producer_id) REFERENCES producers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS harvest_forecasts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  producer_id INTEGER NOT NULL,
  parcel_id INTEGER,
  created_by_user_id INTEGER NOT NULL,
  product TEXT NOT NULL DEFAULT 'Tomate',
  estimated_quantity_kg REAL NOT NULL,
  expected_harvest_date TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (producer_id) REFERENCES producers(id),
  FOREIGN KEY (parcel_id) REFERENCES parcels(id),
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_forecasts_producer
ON harvest_forecasts(producer_id);

CREATE INDEX IF NOT EXISTS idx_forecasts_date
ON harvest_forecasts(expected_harvest_date);
