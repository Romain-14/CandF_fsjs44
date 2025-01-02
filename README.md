# Instructions du Projet

## **Étape 1 : Organisation et Authentification**

### 1. Organisation du code

1. **Créer un dossier pour gérer les routes**
   - Les routes doivent être bien organisées dans un dossier dédié, comme `routes`.
   - Par exemple, vous pouvez avoir des fichiers comme `auth.routes.js` (pour l'authentification) ou `user.routes.js` (pour les utilisateurs).

2. **Séparer les responsabilités**
   - **Controllers** : Créez un dossier `controllers` pour gérer la logique des fonctionnalités. Un contrôleur doit contenir les fonctions nécessaires pour répondre aux requêtes (GET, POST, etc.).
     - Exemple : un `auth.controller.js` pour gérer l’inscription, la connexion, et la déconnexion.
   - **Models** : Créez un dossier `models` pour interagir avec la base de données. Chaque modèle représente une table ou une entité de la base de données.

### 2. Système d’authentification

- **Connexion et interface dynamique**

  - Si un utilisateur est connecté, l’interface doit afficher une option comme "Dashboard".
  - Si aucun utilisateur n’est connecté, l’interface doit afficher "Sign In".
- **Déconnexion propre**
  - Lorsqu’un utilisateur se déconnecte, la session doit être détruite et le cookie lié à la session supprimé du navigateur.

🎯 **Objectif pour passer à l'étape 2**
Votre structure doit être complète selon le modèle MVC (Modèle - Vue - Contrôleur), et les fonctionnalités d’authentification doivent être fonctionnelles.

---

## **Étape 2 : Panneau d’administration**

### 1. Routes et interface

- Ajoutez une route spécifique pour accéder au panneau d'administration (exemple : `/admin`).
- L'interface doit inclure un menu ou un lien permettant d'accéder à cette section.

### 2. Formulaire d’ajout de données

- Dans le panneau d’administration, ajoutez un formulaire permettant de sauvegarder des données (comme `country` ou `recipe`) en base de données.  
Les données peuvent inclure des informations comme :
  - Pour `country` : nom, url wiki, etc.
  - Pour `recipe` : nom, ingrédients, etc.

🎯 **Objectif**
Le panneau d'administration doit être opérationnel avec une interface et un formulaire fonctionnels qui envoient des données à la base.

---

## **Étape 3 : Gestion des fichiers avec Formidable**

### 1. Ajouter des images aux données

- Utilisez la librairie `Formidable` (voir le cours correspondant) pour permettre l’upload d’images.
- Les étapes pour intégrer cette fonctionnalité :
  1. Configurez `Formidable` dans votre application pour gérer les fichiers envoyés via un formulaire.
  2. Ajoutez une option dans le formulaire d’ajout de données pour permettre l’ajout d'une image.
  3. Sauvegardez l’image dans un dossier `public` sur le serveur.
  4. Enregistrez le chemin ou le nom du fichier dans la table correspondante de la base de données.

🎯 **Objectif**
Chaque élément de données peut avoir une image associée, visible sur l'interface utilisateur.

---

## **Étape 4**

Restez attentifs, cette étape sera ajoutée plus tard ! 😊

Optimisation :
Ajouter un middleware pour protéger les routes de l'utilisateur.
(s'aider du middleware en place `admin`)

Validation des données en entrée : `express-validator`
Ajouter des blocs try/catch sur tous bloc d'instruction asynchrone (async/await)
Structurer le dossier de routes pour avoir des routes dédiés.
Améliorer l'accessibilité de l'application.

---

### **Conseils généraux**

- Travaillez par étapes et testez régulièrement votre code.
- Utilisez des commentaires pour expliquer ce que fait chaque partie du code.
- Demandez de l'aide si vous rencontrez des difficultés.
