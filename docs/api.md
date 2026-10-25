# API — points d'entrée principaux

Base : `http://127.0.0.1:3000/api`

## Public

- `GET /health`
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/forgot-password`
- `GET /public/catalog`

## Authentifié

- `GET /auth/me`
- `POST /auth/change-password`
- modules métier P20 : dashboard, producteurs, lots, qualité, collectes, transports, réceptions, productions, produits, stocks, clients, ventes, traçabilité, non-conformités

## Producteur / Point focal

- `/producer/me`
- `/producer/forecasts`
- `/point-focal/producers`
- `/point-focal/forecasts`

## Commercial

- `/my-orders`
- `/orders`

## Administration

- `/admin/registrations`
- `/admin/password-resets`
- `/admin/users`
- `/admin/producer-access`
- `/admin/system/diagnostics`
