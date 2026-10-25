# Architecture P28

## Frontend

React + Vite + TypeScript + React Router + Lucide + Recharts.

## Backend

Node.js + Express + TypeScript.

## Données

SQLite via `better-sqlite3`, base : `server/data/tantsaha_miombona.db`.

## Authentification

JWT + bcryptjs + contrôle RBAC + verrouillage temporaire + changement obligatoire après mot de passe temporaire.

## Chaîne métier

Producteur → prévision → lot → qualité → collecte → transport → réception → transformation → produit fini → stock → commande/vente → traçabilité.

## P21-P28

- P21 : accueil public
- P22 : rôles et permissions
- P23 : inscription et validation
- P24 : Producteur / Point focal / prévisions
- P25 : catalogue / commandes
- P26 : mots de passe et sécurité
- P27 : administration avancée
- P28 : finalisation, diagnostic, responsive, mode local final
