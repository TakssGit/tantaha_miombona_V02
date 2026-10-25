PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role_id INTEGER NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id)
        REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS producers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    commune TEXT DEFAULT '',
    fokontany TEXT DEFAULT '',
    cooperative TEXT DEFAULT '',
    total_delivered_kg REAL NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Actif',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS parcels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producer_id INTEGER NOT NULL,
    code TEXT NOT NULL UNIQUE,
    location TEXT NOT NULL,
    area_ha REAL NOT NULL DEFAULT 0,
    crop TEXT NOT NULL DEFAULT 'Tomate',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producer_id)
        REFERENCES producers(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS harvest_lots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    producer_id INTEGER NOT NULL,
    parcel_id INTEGER,
    product TEXT NOT NULL DEFAULT 'Tomate',
    harvest_date TEXT NOT NULL,
    harvest_time TEXT DEFAULT '',
    quantity_kg REAL NOT NULL DEFAULT 0,
    crates INTEGER NOT NULL DEFAULT 0,
    quality_class TEXT NOT NULL DEFAULT 'NON_CLASSE',
    status TEXT NOT NULL DEFAULT 'En attente',
    notes TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producer_id)
        REFERENCES producers(id),
    FOREIGN KEY (parcel_id)
        REFERENCES parcels(id)
);

CREATE TABLE IF NOT EXISTS quality_checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lot_id INTEGER NOT NULL,
    maturity INTEGER NOT NULL DEFAULT 0,
    color INTEGER NOT NULL DEFAULT 0,
    firmness INTEGER NOT NULL DEFAULT 0,
    injuries INTEGER NOT NULL DEFAULT 0,
    health INTEGER NOT NULL DEFAULT 0,
    cleanliness INTEGER NOT NULL DEFAULT 0,
    score INTEGER NOT NULL DEFAULT 0,
    quality_class TEXT NOT NULL,
    decision TEXT NOT NULL,
    controller TEXT NOT NULL DEFAULT '',
    checked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lot_id)
        REFERENCES harvest_lots(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    lot_id INTEGER NOT NULL,
    center TEXT NOT NULL,
    gross_weight_kg REAL NOT NULL,
    accepted_weight_kg REAL NOT NULL,
    collection_date TEXT NOT NULL,
    collection_time TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Conforme',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lot_id)
        REFERENCES harvest_lots(id)
);

CREATE TABLE IF NOT EXISTS transports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    driver TEXT NOT NULL,
    vehicle TEXT NOT NULL,
    registration TEXT DEFAULT '',
    transport_date TEXT NOT NULL,
    departure TEXT NOT NULL,
    arrival TEXT NOT NULL,
    duration_hours REAL NOT NULL DEFAULT 0,
    quantity_kg REAL NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Terminé',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transport_lots (
    transport_id INTEGER NOT NULL,
    lot_id INTEGER NOT NULL,
    PRIMARY KEY (
        transport_id,
        lot_id
    ),
    FOREIGN KEY (transport_id)
        REFERENCES transports(id)
        ON DELETE CASCADE,
    FOREIGN KEY (lot_id)
        REFERENCES harvest_lots(id)
);

CREATE TABLE IF NOT EXISTS receptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    lot_id INTEGER NOT NULL,
    transport_id INTEGER,
    announced_weight_kg REAL NOT NULL,
    received_weight_kg REAL NOT NULL,
    loss_kg REAL NOT NULL DEFAULT 0,
    loss_rate REAL NOT NULL DEFAULT 0,
    decision TEXT NOT NULL,
    reception_date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lot_id)
        REFERENCES harvest_lots(id),
    FOREIGN KEY (transport_id)
        REFERENCES transports(id)
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT DEFAULT '',
    unit TEXT NOT NULL DEFAULT 'Unité',
    selling_price_ar REAL NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    product_id INTEGER NOT NULL,
    input_kg REAL NOT NULL,
    output_kg REAL NOT NULL,
    loss_kg REAL NOT NULL DEFAULT 0,
    yield_rate REAL NOT NULL DEFAULT 0,
    production_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Terminée',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id)
        REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS production_inputs (
    production_id INTEGER NOT NULL,
    lot_id INTEGER NOT NULL,
    quantity_kg REAL NOT NULL DEFAULT 0,
    PRIMARY KEY (
        production_id,
        lot_id
    ),
    FOREIGN KEY (production_id)
        REFERENCES productions(id)
        ON DELETE CASCADE,
    FOREIGN KEY (lot_id)
        REFERENCES harvest_lots(id)
);

CREATE TABLE IF NOT EXISTS finished_batches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    production_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    manufacturing_date TEXT NOT NULL,
    quantity REAL NOT NULL,
    unit TEXT NOT NULL DEFAULT 'kg',
    packaging TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Conforme',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (production_id)
        REFERENCES productions(id),
    FOREIGN KEY (product_id)
        REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS stock_movements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    finished_batch_id INTEGER NOT NULL,
    movement_type TEXT NOT NULL CHECK (
        movement_type IN (
            'Entrée',
            'Sortie'
        )
    ),
    quantity REAL NOT NULL,
    unit TEXT NOT NULL DEFAULT 'kg',
    reason TEXT DEFAULT '',
    movement_date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (finished_batch_id)
        REFERENCES finished_batches(id)
);

CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    location TEXT DEFAULT '',
    customer_type TEXT NOT NULL DEFAULT 'Détaillant',
    status TEXT NOT NULL DEFAULT 'Actif',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    sale_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Payée',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id)
        REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS sale_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    finished_batch_id INTEGER,
    quantity REAL NOT NULL,
    unit_price_ar REAL NOT NULL,
    total_ar REAL NOT NULL,
    FOREIGN KEY (sale_id)
        REFERENCES sales(id)
        ON DELETE CASCADE,
    FOREIGN KEY (product_id)
        REFERENCES products(id),
    FOREIGN KEY (finished_batch_id)
        REFERENCES finished_batches(id)
);

CREATE TABLE IF NOT EXISTS non_conformities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    lot_id INTEGER,
    category TEXT NOT NULL,
    cause TEXT NOT NULL,
    corrective_action TEXT DEFAULT '',
    responsible TEXT DEFAULT '',
    nc_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Ouvert',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lot_id)
        REFERENCES harvest_lots(id)
);

CREATE TABLE IF NOT EXISTS settings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    entity TEXT DEFAULT '',
    entity_id TEXT DEFAULT '',
    details TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)
        REFERENCES users(id)
);
