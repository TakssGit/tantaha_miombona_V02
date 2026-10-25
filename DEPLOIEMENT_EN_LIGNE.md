# Tantsaha Miombona — déploiement et aperçu en ligne

## Pourquoi Render plutôt que GitHub Pages ?

Ce projet est une application complète React/Vite + Express/Node.js + SQLite. GitHub Pages publie des fichiers statiques et ne fait pas fonctionner le serveur Express. Pour un aperçu qui utilise les routes `/api`, ce patch prépare Render. Documentation GitHub Pages : https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages

## 1. Préparer et pousser depuis Windows

Dans le dossier `Tantsaha_miombona\patch`, lancez `LANCER_PATCH_33.bat`. Le patch :
- recherche la racine Git du projet ;
- remplace les URL API codées en dur par `/api` ;
- ajoute un proxy Vite vers `http://127.0.0.1:3000` pour les tests locaux ;
- ajoute `render.yaml`, un contrôle de build GitHub Actions et ce guide ;
- renforce `.gitignore` pour les secrets et bases locales ;
- bloque si des fichiers secrets ou bases sont déjà suivis par Git.

Ensuite, examinez les changements et lancez `PUSH_GIT_COMPLET.bat`. Le script affiche le dépôt distant, la branche et les fichiers à envoyer, puis demande explicitement de taper `OUI`.

Commandes Git équivalentes, depuis la racine `Tantsaha_miombona` :

```powershell
git status
git remote -v
git branch --show-current
git add -A
git diff --cached --name-only
git commit -m "Prepare Tantsaha Miombona online preview"
git push -u origin main
```

Si la branche active n'est pas `main`, remplacez `main` par le résultat de `git branch --show-current`. Ne poussez jamais de `.env`, secret JWT, mot de passe, base SQLite réelle ou sauvegarde de base. Si aucun remote n'est configuré, ajoutez l'URL réelle du dépôt :

```powershell
git remote add origin https://github.com/VOTRE_COMPTE/VOTRE_DEPOT.git
git push -u origin main
```

Remplacez les valeurs fictives par votre URL réelle. Le script de push refuse les fichiers sensibles déjà suivis par Git.

## 2. Déployer le site complet sur Render

1. Poussez d'abord les changements sur GitHub.
2. Ouvrez https://dashboard.render.com/ et connectez votre compte GitHub.
3. Choisissez **New + → Blueprint**.
4. Sélectionnez le dépôt qui contient `render.yaml`.
5. Vérifiez le service `tantsaha-miombona-preview`, puis lancez le déploiement.
6. Render lit `render.yaml`, construit le frontend et le backend, puis fournit une URL HTTPS en `onrender.com`.
7. Ouvrez l'URL publique après un statut de déploiement réussi. Consultez les logs si le build échoue.

Un seul service Express sert le build `client/dist` et l'API `/api`. Les appels API sont relatifs et ne dépendent plus de `localhost`. Les pushes sur la branche connectée peuvent déclencher un déploiement automatique. Documentation : https://render.com/docs/web-services et https://render.com/docs/deploys

## 3. Limites de l'aperçu gratuit

- Cette configuration vise une **prévisualisation**, pas la production avec de vraies données.
- Le build exécute les migrations mais ne charge volontairement pas les comptes de démonstration : cela évite d’exposer un compte administrateur connu (`admin/admin123`) sur un site public. Le catalogue peut être vide jusqu’à ce qu’un jeu de données de démonstration sûr soit préparé.
- Le service gratuit Render utilise un système de fichiers éphémère : les changements de la base SQLite peuvent être perdus lors d'un redéploiement, redémarrage ou mise en veille. N'utilisez pas de données réelles ni de données personnelles.
- Pour conserver les données, il faudra ajouter un stockage persistant sur un plan admissible ou migrer SQLite vers une base gérée. Limites : https://render.com/docs/free
- Le site sera public : ne laissez pas de comptes de démonstration avec des mots de passe faibles ni de données confidentielles.
- `JWT_SECRET` est généré par Render via `generateValue`; ne le commitez pas dans Git.
- GitHub Actions vérifie types et builds. Si le code échoue au typecheck/build, corrigez les erreurs avant de considérer le site comme publié.

## 4. Vérifier après publication

- L'URL publique affiche la page d'accueil.
- `https://VOTRE-SERVICE.onrender.com/api/health` répond avec succès.
- Les appels du navigateur vont vers `/api`, et non `http://127.0.0.1:3000/api`.
- Les pages publiques, le catalogue et les images sont visibles.
