CREATE INDEX IF NOT EXISTS
idx_users_active_role
ON users(active, role_id);

CREATE INDEX IF NOT EXISTS
idx_users_last_login
ON users(last_login_at);

CREATE INDEX IF NOT EXISTS
idx_orders_created_at
ON orders(created_at);

CREATE INDEX IF NOT EXISTS
idx_forecasts_status_date
ON harvest_forecasts(
  status,
  expected_harvest_date
);
