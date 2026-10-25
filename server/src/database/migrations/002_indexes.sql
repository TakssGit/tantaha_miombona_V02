CREATE INDEX IF NOT EXISTS idx_producers_code
ON producers(code);

CREATE INDEX IF NOT EXISTS idx_parcels_producer
ON parcels(producer_id);

CREATE INDEX IF NOT EXISTS idx_lots_code
ON harvest_lots(code);

CREATE INDEX IF NOT EXISTS idx_lots_producer
ON harvest_lots(producer_id);

CREATE INDEX IF NOT EXISTS idx_lots_date
ON harvest_lots(harvest_date);

CREATE INDEX IF NOT EXISTS idx_quality_lot
ON quality_checks(lot_id);

CREATE INDEX IF NOT EXISTS idx_collections_lot
ON collections(lot_id);

CREATE INDEX IF NOT EXISTS idx_transport_date
ON transports(transport_date);

CREATE INDEX IF NOT EXISTS idx_receptions_lot
ON receptions(lot_id);

CREATE INDEX IF NOT EXISTS idx_receptions_transport
ON receptions(transport_id);

CREATE INDEX IF NOT EXISTS idx_production_date
ON productions(production_date);

CREATE INDEX IF NOT EXISTS idx_production_product
ON productions(product_id);

CREATE INDEX IF NOT EXISTS idx_finished_product
ON finished_batches(product_id);

CREATE INDEX IF NOT EXISTS idx_stock_batch
ON stock_movements(finished_batch_id);

CREATE INDEX IF NOT EXISTS idx_sales_date
ON sales(sale_date);

CREATE INDEX IF NOT EXISTS idx_sale_customer
ON sales(customer_id);

CREATE INDEX IF NOT EXISTS idx_nc_lot
ON non_conformities(lot_id);

CREATE INDEX IF NOT EXISTS idx_nc_status
ON non_conformities(status);
