# Validation de la mise à niveau P20 → P28

## Contrôles réalisés sur la copie mise à jour

| Contrôle | Résultat |
|---|---|
| Extraction et audit de l'archive utilisateur | ☑ OK |
| Intégration P21 — accueil public | ☑ Code intégré |
| Intégration P22 — RBAC | ☑ Code intégré |
| Intégration P23 — inscription / validation | ☑ Code intégré |
| Intégration P24 — Producteur / Point focal / prévisions | ☑ Code intégré |
| Intégration P25 — catalogue / commandes | ☑ Code intégré |
| Intégration P26 — mot de passe / sécurité | ☑ Code intégré |
| Intégration P27 — administration avancée | ☑ Code intégré |
| Intégration P28 — sécurité / responsive / diagnostic | ☑ Code intégré |
| TypeScript serveur `tsc --noEmit` | ☑ OK |
| TypeScript client `tsc --noEmit` | ☑ OK |
| Build TypeScript serveur | ☑ OK |
| Migrations 001 à 010 sur la base fournie | ☑ OK |
| `PRAGMA integrity_check` SQLite | ☑ OK |
| Rôles P22 présents dans SQLite | ☑ OK |
| Sauvegarde DB avant migration P21–P28 | ☑ Créée |
| Images/icônes placeholders | ☑ Créés |
| Build Vite final dans l'environnement Linux d'intégration | ⚠ Non exécutable ici car le `node_modules` fourni contient le binaire Rollup Windows |
| Build Vite final sur le PC Windows cible | ☐ À exécuter via `TESTER_TANTSAHA.bat` |
| Tests UI manuels / responsive / rôles | ☐ À exécuter sur le PC Windows cible |

## Point important

Le code TypeScript client et serveur est valide. Le build Vite doit être reconstruit sur Windows parce que l'archive utilisateur embarque des dépendances natives Rollup prévues pour Windows. Le dossier `client/dist` ancien a volontairement été vidé afin d'éviter de servir l'ancienne interface P20. Au premier lancement via `DEMARRER_TANTSAHA.bat`, le frontend P28 sera reconstruit sur le PC Windows.

## Base de données

La base utilisateur a été conservée et migrée. Une sauvegarde de sécurité est disponible dans `server/data/backups/tantsaha_avant_P21_P28.db`.
