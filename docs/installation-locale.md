# Installation et démarrage local

## PC déjà préparé / hors connexion

1. Copier le dossier complet `Tantsaha_miombona` sur le PC Windows.
2. Vérifier `node -v` et `npm -v`.
3. Double-cliquer sur `DEMARRER_TANTSAHA.bat`.
4. L'application finale s'ouvre sur `http://127.0.0.1:3000/`.

Le script applique automatiquement les migrations existantes et construit le frontend si `client/dist/index.html` n'existe pas.

## Mode développement

Double-cliquer sur `start-local.bat` ou lancer :

```powershell
npm run dev:server
npm run dev:client
```

Frontend développement : `http://127.0.0.1:5173/`  
API : `http://127.0.0.1:3000/api`

## Données de démonstration

Double-cliquer sur `PREVIEW_TANTSAHA.bat`. Une sauvegarde SQLite est réalisée avant insertion.

## Test technique

Double-cliquer sur `TESTER_TANTSAHA.bat`.
