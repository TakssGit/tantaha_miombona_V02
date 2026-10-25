# Tantsaha_miombona — version P28

Application web locale/offline de gestion d'un circuit court agroalimentaire autour de la tomate : producteurs, points focaux, prévisions, lots, qualité, collecte, transport, réception, transformation, produits finis, stock, commandes, ventes et traçabilité.

## Architecture

- Client : React + Vite + TypeScript
- Serveur : Node.js + Express + TypeScript
- Base : SQLite via better-sqlite3
- Authentification : JWT + bcryptjs
- Mode d'utilisation : local/offline après installation des dépendances

## Démarrage recommandé

Double-cliquer sur `DEMARRER_TANTSAHA.bat`.

Le script :
1. applique les migrations SQLite,
2. construit le frontend s'il n'est pas encore construit,
3. lance le serveur local,
4. ouvre `http://127.0.0.1:3000/`.

Pour développer : `start-local.bat` ouvre Vite sur `http://127.0.0.1:5173/`.

## Tests

Double-cliquer sur `TESTER_TANTSAHA.bat` puis terminer la checklist manuelle :
`docs/SUIVI_TESTS_P20_P28.md`.

## Prévisualisation / captures

`PREVIEW_TANTSAHA.bat` ajoute des données de démonstration après sauvegarde automatique de la base.

## Documentation utile

- `docs/CHANGELOG_P20_P28.md`
- `docs/SUIVI_TESTS_P20_P28.md`
- `docs/RENSEIGNEMENTS_CONTENUS_A_METTRE_A_JOUR.md`
- `docs/ASSETS_A_REMPLACER.md`
- `docs/VALIDATION_MISE_A_NIVEAU.md`

## Données

La base principale est :
`server/data/tantsaha_miombona.db`

Ne pas utiliser `db:reset` sur une base réelle sans sauvegarde préalable.
