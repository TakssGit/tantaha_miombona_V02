# Suivi global des tests — Tantsaha_miombona P20 à P28

> Légende : **☑** vérifié techniquement dans la copie mise à niveau ; **☐** à tester sur le PC Windows cible.

| Paquet | Check | Test | Résultat attendu | État / remarque |
|---|:---:|---|---|---|
| P20 / socle | ☑ | Typecheck serveur | 0 erreur | Validé après intégration P21-P28 |
| P20 / socle | ☑ | Typecheck client | 0 erreur | Validé après intégration P21-P28 |
| P20 / socle | ☑ | Base SQLite existante conservée | Données P20 présentes | Sauvegarde créée avant migration |
| P20 / socle | ☑ | Migration 001 à 010 | Toutes les migrations appliquées | Contrôlé sur copie et base fournie |
| P20 / socle | ☑ | PRAGMA integrity_check | ok | Contrôlé après migration |
| P20 / socle | ☑ | Compte admin actif | active = 1 | Base fournie vérifiée |
| P20 / socle | ☐ | Smoke test historique P0-P20 | TOUS LES TESTS API : OK | À relancer sur Windows après démarrage backend |
| P21 | ☐ | Accueil public sur / | La page publique s’ouvre avant le login | Code intégré |
| P21 | ☐ | Header public | Logo/nom, navigation et CTA visibles | Code intégré |
| P21 | ☐ | Section établissement | Présentation claire de la transformation | Code intégré |
| P21 | ☐ | Section circuit court | Producteur → point focal → collecte → transformation | Code intégré |
| P21 | ☐ | Section acteurs | Admin, point focal, producteur, distributeur | Code intégré |
| P21 | ☐ | Section qualité | Qualité et traçabilité visibles | Code intégré |
| P21 | ☐ | Bouton Se connecter | Ouvre /login | Code intégré |
| P21 | ☐ | Bouton Créer un compte | Ouvre /register | Code intégré |
| P21 | ☐ | Responsive accueil | Aucun débordement 320 px → desktop | Code intégré |
| P21 | ☐ | Images placeholder | Fond de secours visible même avec fichiers vides | Code intégré |
| P22 | ☐ | Rôles supplémentaires | POINT_FOCAL, PRODUCTEUR, DISTRIBUTEUR en base | Code et migration intégrés |
| P22 | ☐ | RBAC backend | Routes internes filtrées par rôle | Code et migration intégrés |
| P22 | ☐ | RBAC frontend | Menus et pages filtrés par rôle | Code et migration intégrés |
| P22 | ☐ | Route sans token | 401 | Code et migration intégrés |
| P22 | ☐ | Route avec rôle interdit | 403 | Code et migration intégrés |
| P22 | ☐ | ADMIN | Accès complet | Code et migration intégrés |
| P22 | ☐ | GESTIONNAIRE | Accès métier sans administration sensible | Code et migration intégrés |
| P22 | ☐ | QUALITE | Qualité, réception, lots et NC selon droits | Code et migration intégrés |
| P22 | ☐ | PRODUCTION | Réception, production, produits, stock | Code et migration intégrés |
| P22 | ☐ | COMMERCIAL | Produits, stock, clients, ventes, commandes | Code et migration intégrés |
| P23 | ☐ | Inscription PRODUCTEUR | Demande créée en PENDING / inactive | Code intégré |
| P23 | ☐ | Inscription DISTRIBUTEUR | Demande créée en PENDING / inactive | Code intégré |
| P23 | ☐ | Rôle public interdit | Impossible de demander ADMIN/POINT_FOCAL/etc. | Code intégré |
| P23 | ☐ | Identifiant unique | Doublon refusé | Code intégré |
| P23 | ☐ | Validation mot de passe | >=10 caractères + majuscule + minuscule + chiffre | Code intégré |
| P23 | ☐ | Mot de passe hashé | Aucun mot de passe clair en base | Code intégré |
| P23 | ☐ | ADMIN voit demandes | Liste /admin/registrations | Code intégré |
| P23 | ☐ | ADMIN approuve | Compte devient APPROVED + active | Code intégré |
| P23 | ☐ | ADMIN rejette | Compte reste inactif et REJECTED | Code intégré |
| P23 | ☐ | Login avant approbation | Refusé | Code intégré |
| P23 | ☐ | Login après approbation | Accepté | Code intégré |
| P24 | ☐ | Lier compte Producteur | Compte relié à une fiche producteur | Code intégré |
| P24 | ☐ | Producteur voit son profil | Pas les autres producteurs | Code intégré |
| P24 | ☐ | Producteur ajoute prévision | Prévision PENDING | Code intégré |
| P24 | ☐ | Point focal voit ses producteurs | Seulement affectés | Code intégré |
| P24 | ☐ | Point focal crée producteur | Producteur créé et automatiquement rattaché | Code intégré |
| P24 | ☐ | Point focal crée prévision | Seulement pour producteur affecté | Code intégré |
| P24 | ☐ | Prévision hors périmètre | 403/refus | Code intégré |
| P24 | ☐ | ADMIN/GESTIONNAIRE liste prévisions | Toutes les prévisions visibles | Code intégré |
| P24 | ☐ | Validation prévision | PENDING → VALIDATED | Code intégré |
| P24 | ☐ | Rejet prévision | PENDING → REJECTED | Code intégré |
| P25 | ☐ | Catalogue public SQLite | Produits actifs visibles sans login | Code intégré |
| P25 | ☐ | Prix et unité | Valeurs produits visibles | Code intégré |
| P25 | ☐ | Stock disponible | Calculé depuis mouvements de stock | Code intégré |
| P25 | ☐ | Produit inactif | Non affiché publiquement | Code intégré |
| P25 | ☐ | DISTRIBUTEUR commande | Commande créée EN_ATTENTE | Code intégré |
| P25 | ☐ | Commande > stock | Refusée | Code intégré |
| P25 | ☐ | COMMERCIAL voit commandes | Liste complète | Code intégré |
| P25 | ☐ | ADMIN voit commandes | Liste complète | Code intégré |
| P25 | ☐ | Statut CONFIRMEE | Mise à jour possible | Code intégré |
| P25 | ☐ | Statut PREPAREE | Mise à jour possible | Code intégré |
| P25 | ☐ | Statut LIVREE | Mise à jour possible | Code intégré |
| P25 | ☐ | Statut ANNULEE | Mise à jour possible | Code intégré |
| P25 | ☐ | Commande simple et stock | La commande seule ne décrémente pas le stock physique | Code intégré |
| P26 | ☐ | Mot de passe oublié | Message public générique | Code intégré |
| P26 | ☐ | Demande reset | PENDING côté ADMIN | Code intégré |
| P26 | ☐ | ADMIN génère MDP temporaire | MDP temporaire retourné une seule fois | Code intégré |
| P26 | ☐ | MDP temporaire hashé | Hash en base | Code intégré |
| P26 | ☐ | must_change_password | Activé après reset | Code intégré |
| P26 | ☐ | Redirection changement MDP | Accès métier bloqué tant que non changé | Code intégré |
| P26 | ☐ | Nouveau MDP différent | Ancien et nouveau identiques refusés | Code intégré |
| P26 | ☐ | Verrouillage après erreurs | Compte test bloqué après 5 mauvais mots de passe | Code intégré |
| P26 | ☐ | Rate limit auth | 429 après seuil IP/route | Code intégré |
| P26 | ☐ | Événements sécurité | LOGIN_FAILED/LOCKED/RESET/CHANGE journalisés | Code intégré |
| P27 | ☐ | Liste utilisateurs sécurisée | Aucun hash/mot de passe exposé | Code intégré |
| P27 | ☐ | Recherche utilisateur | Nom/identifiant/téléphone | Code intégré |
| P27 | ☐ | Filtre rôle | Filtrage correct | Code intégré |
| P27 | ☐ | Filtre actif/inactif | Filtrage correct | Code intégré |
| P27 | ☐ | Création utilisateur interne | Mot de passe temporaire + changement obligatoire | Code intégré |
| P27 | ☐ | Modification rôle | Droits effectifs après reconnexion | Code intégré |
| P27 | ☐ | Désactivation compte test | Login refusé | Code intégré |
| P27 | ☐ | Réactivation compte test | Login accepté | Code intégré |
| P27 | ☐ | Auto-désactivation ADMIN | Refusée | Code intégré |
| P27 | ☐ | Auto-changement de rôle ADMIN | Refusé | Code intégré |
| P27 | ☐ | Dernier ADMIN actif | Impossible à désactiver/rétrograder | Code intégré |
| P27 | ☐ | Reset direct utilisateur | MDP temporaire + must_change_password | Code intégré |
| P27 | ☐ | Déverrouillage | Compteur et locked_until remis à zéro | Code intégré |
| P27 | ☐ | Journal audit | Actions sensibles visibles | Code intégré |
| P28 | ☐ | Index finaux | 010_final_indexes.sql appliquée | Code intégré ; à exécuter sur Windows |
| P28 | ☐ | SQLite WAL | journal_mode WAL | Code intégré ; à exécuter sur Windows |
| P28 | ☐ | busy_timeout | 5000 ms | Code intégré ; à exécuter sur Windows |
| P28 | ☐ | En-têtes sécurité | nosniff, frame deny, referrer, permissions, CSP | Code intégré ; à exécuter sur Windows |
| P28 | ☐ | Serve frontend compilé par Express | URL unique http://127.0.0.1:3000 | Code intégré ; à exécuter sur Windows |
| P28 | ☐ | Diagnostic système ADMIN | integrity ok, missingTables [], admin >=1 | Code intégré ; à exécuter sur Windows |
| P28 | ☐ | Test final API | TEST FINAL TANTSAHA : TOUS OK | Code intégré ; à exécuter sur Windows |
| P28 | ☐ | Responsive 1440x900 | Aucun débordement | Code intégré ; à exécuter sur Windows |
| P28 | ☐ | Responsive 1366x768 | Aucun débordement | Code intégré ; à exécuter sur Windows |
| P28 | ☐ | Responsive 1024x768 | Interface utilisable | Code intégré ; à exécuter sur Windows |
| P28 | ☐ | Responsive 768x1024 | Interface utilisable | Code intégré ; à exécuter sur Windows |
| P28 | ☐ | Responsive 430x932 | Interface utilisable | Code intégré ; à exécuter sur Windows |
| P28 | ☐ | Responsive 390x844 | Interface utilisable | Code intégré ; à exécuter sur Windows |
| P28 | ☐ | Responsive 360x800 | Interface utilisable | Code intégré ; à exécuter sur Windows |
| P28 | ☐ | Responsive 320x568 | Interface utilisable | Code intégré ; à exécuter sur Windows |
| P28 | ☐ | Démarrage offline | DEMARRER_TANTSAHA.bat | Code intégré ; à exécuter sur Windows |
| P28 | ☐ | Prévisualisation données | PREVIEW_TANTSAHA.bat | Code intégré ; à exécuter sur Windows |
| FINAL | ☐ | Scénario complet Producteur | Prévision → lot réel → qualité → collecte → transport | Recette utilisateur |
| FINAL | ☐ | Scénario transformation | Réception → transformation → produit fini → stock | Recette utilisateur |
| FINAL | ☐ | Scénario commercial | Catalogue → commande → vente/livraison | Recette utilisateur |
| FINAL | ☐ | Traçabilité complète | Produit fini → production → lot → producteur/parcelle | Recette utilisateur |
| FINAL | ☐ | Persistance F5 | Données conservées | Recette utilisateur |
| FINAL | ☐ | Persistance redémarrage PC | Données conservées | Recette utilisateur |
| FINAL | ☐ | Sauvegarde/restauration SQLite | Base récupérable | Recette utilisateur |
| FINAL | ☐ | Console frontend | Aucune erreur bloquante | Recette utilisateur |
| FINAL | ☐ | Console backend | Aucune exception non gérée | Recette utilisateur |
| FINAL | ☐ | Mode hors Internet | Fonctionnalités locales opérationnelles | Recette utilisateur |
