TANTSAHA MIOMBONA — PREVISUALISATION LOCALE

Fichiers :
1) PREVIEW_TANTSAHA.bat
   -> à placer à la racine du projet Tantsaha_miombona

2) server/scripts/seed-preview.ts
   -> à placer dans server/scripts/

Utilisation :
- Fermer l'application si vous voulez une démonstration propre.
- Double-cliquer sur PREVIEW_TANTSAHA.bat.
- Le script sauvegarde automatiquement la base existante.
- Il applique les migrations.
- Il ajoute des données de démonstration de manière idempotente.
- Il lance l'API et le frontend.
- Le navigateur s'ouvre sur http://127.0.0.1:5173/

Important :
- Le script NE SUPPRIME PAS les données existantes.
- Une sauvegarde est créée dans server/data/backups/ avant insertion.
- Les données couvrent P0-P20 et ajoutent aussi les tables P22-P27 lorsqu'elles existent.
- P21 et P28 n'ajoutent pas de données métier propres ; P28 ajoute surtout des index/contrôles.
- Le rapport final affiche le nombre de lignes de toutes les tables SQLite.
