# Changelog — mise à niveau P20 → P28

## P21
- Page d’accueil publique activée sur `/`.
- Navigation vers connexion et création de compte.
- Sections établissement, circuit court, acteurs, produits, qualité et contact.
- Emplacements d’images locaux préparés.

## P22
- Ajout des rôles POINT_FOCAL, PRODUCTEUR et DISTRIBUTEUR.
- RBAC backend et frontend.
- Menus filtrés selon le rôle.

## P23
- Inscription publique Producteur/Distributeur.
- Validation ADMIN obligatoire.
- Contrôles identifiant et mot de passe.

## P24
- Espace Producteur.
- Espace Point focal.
- Prévisions de récolte.
- Liaison compte Producteur ↔ fiche producteur.
- Affectation Point focal ↔ producteurs.

## P25
- Catalogue public relié à SQLite.
- Commandes distributeurs.
- Gestion des statuts de commande par ADMIN/COMMERCIAL.

## P26
- Mot de passe oublié en mode local.
- Réinitialisation par ADMIN.
- Mot de passe temporaire et changement obligatoire.
- Verrouillage après échecs et journal sécurité.

## P27
- Administration avancée des utilisateurs.
- Protection du dernier ADMIN actif.
- Création de comptes internes, reset, déverrouillage et audit.

## P28
- Durcissement SQLite et HTTP.
- Diagnostic système.
- Responsive final.
- Test final API.
- Lancement local via Express + frontend compilé.

## Correctifs d’intégration supplémentaires
- Migration P23 adaptée au schéma P20 : `created_at` n’est plus ajouté deux fois.
- Nouveau suivi `schema_migrations` pour éviter de rejouer les migrations ALTER TABLE.
- Ancienne route de bascule utilisateur sécurisée pour empêcher la désactivation accidentelle de l’ADMIN courant / dernier ADMIN.
- Ancien écran Administration simplifié : la gestion sensible des comptes renvoie vers les modules P23-P27 sécurisés.
- Base fournie migrée jusqu’à `010_final_indexes.sql` avec `integrity_check = ok`.
- Ancien build frontend P20 retiré : le premier lancement doit reconstruire le client P28 sur le PC Windows cible.
