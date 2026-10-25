# MATRICE DES ACCÈS — TANSAHA MIOMBONA V02

Les chemins indiqués reflètent les contrôles de navigation frontend observés dans le projet et les ajouts des patchs. Ils doivent être vérifiés sur l’instance réelle, ainsi que côté API.

**Pages publiques sans connexion :** `/`, `/catalogue`, `/producteurs` (guide), `/login`, `/register`, `/forgot-password`.

## Pages attendues par rôle

### ADMIN
`/dashboard`, `/producteurs`, `/lots`, `/qualite`, `/collecte`, `/transports`, `/receptions`, `/transformations`, `/produits`, `/stocks`, `/clients`, `/commandes`, `/ventes`, `/tracabilite`, `/non-conformites`, `/administration`, `/admin/registrations`, `/admin/password-resets`, `/admin/users`, `/admin/producer-access`, `/previsions`, `/precommandes-approvisionnement`, `/admin/configuration-v02`

### GESTIONNAIRE
`/dashboard`, `/producteurs`, `/previsions`, `/lots`, `/qualite`, `/collecte`, `/transports`, `/receptions`, `/transformations`, `/produits`, `/stocks`, `/clients`, `/ventes`, `/tracabilite`, `/non-conformites`, `/precommandes-approvisionnement`

### QUALITE
`/dashboard`, `/lots`, `/qualite`, `/receptions`, `/tracabilite`, `/non-conformites`

### PRODUCTION
`/dashboard`, `/lots`, `/receptions`, `/transformations`, `/produits`, `/stocks`, `/tracabilite`

### COMMERCIAL
`/dashboard`, `/produits`, `/stocks`, `/clients`, `/commandes`, `/ventes`, `/tracabilite`

### PRODUCTEUR
`/espace-producteur`, `/precommandes-approvisionnement`

### POINT_FOCAL
`/point-focal`, `/precommandes-approvisionnement`

### DISTRIBUTEUR
`/espace-commercial`, `/catalogue`


## Protocole de test des permissions

1. Créer ou utiliser un compte de test autorisé pour chaque rôle (ADMIN crée/active les comptes internes).
2. Tester la connexion et l’affichage des menus.
3. Ouvrir chaque URL permise depuis le tableau ci-dessus.
4. Ouvrir une URL réservée à un autre rôle : le client doit rediriger ou interdire l’accès.
5. Tester la même action directement sur l’API : le backend doit lui aussi refuser une action non autorisée.
6. Vérifier l’accès à `/change-password` pour les comptes concernés, puis la déconnexion.
7. Vérifier que l’inscription publique ne permet que PRODUCTEUR ou DISTRIBUTEUR.

**Sécurité :** aucun identifiant ni mot de passe de test n’est inclus, et aucun droit n’est créé par ce patch.