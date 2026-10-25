# LISTE DES ACCÈS ET AUTORISATIONS V03

> Document de test fonctionnel. Les mots de passe et comptes exacts restent ceux de votre installation.

## 1. Comptes publics
- **Visiteur** : accueil, catalogue public, guide producteurs, page de création de compte, page login.
- **Demande d’inscription** : peut soumettre une demande **PRODUCTEUR** ou **DISTRIBUTEUR**.

## 2. Comptes métiers et accès attendus

### ADMIN
- Tableau de bord général
- Utilisateurs / validations / réinitialisation mot de passe
- Paramètres application
- Produits, lots, stocks, réceptions, collectes, transports, ventes
- Précommandes d’approvisionnement
- Non-conformités et traçabilité
- Pages de configuration et gestion globale

### GESTIONNAIRE
- Tableau de bord
- Prévisions / collecte / transport / stocks / approvisionnement
- Consultation et validation opérationnelle suivant la politique de votre installation

### QUALITE
- Réceptions
- Non-conformités
- Traçabilité
- Lots / historique qualité
- Consultation des stocks et productions si autorisé

### PRODUCTION
- Productions
- Produits
- Lots
- Stocks
- Traçabilité de transformation
- Consultation des réceptions nécessaires à la production

### COMMERCIAL / DISTRIBUTEUR INTERNE
- Clients
- Commandes / ventes
- Catalogue
- Suivi du stock vendable

### PRODUCTEUR
- Portail producteur
- Consultation de son espace et saisie des données de précommande d’approvisionnement
- Consultation des consignes / historique selon configuration

### POINT_FOCAL
- Portail point focal
- Précommandes de groupe / suivi terrain / coordination des envois

### DISTRIBUTEUR
- Portail commercial / catalogue public renforcé
- Demandes de commande ou accès à l’espace commercial suivant activation

## 3. Pages à ouvrir pour les tests
- `/` Accueil
- `/catalogue` Catalogue public
- `/producteurs` Guide producteurs
- `/register` Inscription
- `/login` Connexion
- `/dashboard` Tableau de bord
- `/admin` Administration
- `/admin/users` Gestion utilisateurs
- `/admin/registrations` Validation des demandes
- `/admin/password-reset` Réinitialisation mot de passe
- `/admin/config` Paramètres dynamiques
- `/forecast-admin` Prévisions
- `/collections` Collectes
- `/receptions` Réceptions
- `/transports` Transports
- `/productions` Productions
- `/products` Produits
- `/lots` Lots
- `/stock` Stock
- `/sales` Ventes
- `/customers` Clients
- `/orders-admin` Commandes
- `/quality` Qualité
- `/non-conformities` Non-conformités
- `/traceability` Traçabilité
- `/supply-preorders` Précommandes d’approvisionnement
- `/producer-portal` Portail producteur
- `/point-focal` Portail point focal
- `/commercial-portal` Portail commercial
- `/role-home` Redirection par rôle

## 4. Vérifications de test recommandées
1. Un visiteur ne doit pas ouvrir les pages protégées.
2. Un producteur ne doit pas accéder à l’administration.
3. Un distributeur ne doit pas accéder à la production ni à la qualité.
4. Un administrateur doit accéder à toutes les pages de configuration.
5. Vérifier qu’après connexion, la redirection mène vers la bonne page d’accueil métier.
6. Vérifier le comportement des boutons, tableaux, formulaires et messages de succès / erreur.
