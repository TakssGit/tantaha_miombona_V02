# Schéma logique — principales tables

## Socle P20

`roles`, `users`, `settings`, `producers`, `parcels`, `harvest_lots`, `quality_checks`, `collections`, `transports`, `transport_lots`, `receptions`, `products`, `productions`, `production_inputs`, `finished_batches`, `stock_movements`, `customers`, `sales`, `sale_items`, `non_conformities`.

## P23-P27

- `producer_user_links` : compte Producteur ↔ fiche Producteur
- `point_focal_producers` : Point focal ↔ producteurs affectés
- `harvest_forecasts` : prévisions de récolte
- `orders`, `order_items` : commandes commerciales
- `password_reset_requests` : demandes de réinitialisation
- `security_events` : journal sécurité
- `account_audit_logs` : journal administration
- `schema_migrations` : suivi des migrations appliquées
