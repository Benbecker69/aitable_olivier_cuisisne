# Mon carnet de recettes

Une application web simple pour parcourir, rechercher et gérer des recettes de cuisine, avec [Airtable](https://airtable.com) comme base de données.

## Fonctionnalités

- Liste des recettes avec recherche par nom et filtre par catégorie (Entrée, Plat, Dessert)
- Page détail : photo, temps de préparation/cuisson, portions, difficulté, liste d'ingrédients avec quantités, instructions étape par étape
- Création, modification et suppression de recettes depuis le site (photo comprise), protégées par un mot de passe simple

## Stack technique

- [Next.js](https://nextjs.org) (App Router) + TypeScript + [Tailwind CSS](https://tailwindcss.com)
- [Airtable](https://airtable.com) comme base de données, via son API REST (pas de SDK)

## Démarrer le projet

1. Installer les dépendances :

   ```bash
   npm install
   ```

2. Créer un fichier `.env.local` à la racine avec :

   ```bash
   AIRTABLE_TOKEN=          # Personal Access Token Airtable (scopes data.records:read/write, schema.bases:write)
   AIRTABLE_BASE_ID=        # ID de la base Airtable (commence par "app")
   APP_PASSWORD=            # mot de passe pour protéger la création/modification/suppression
   ```

3. Lancer le serveur de développement :

   ```bash
   npm run dev
   ```

   L'application est disponible sur [http://localhost:3000](http://localhost:3000).

## Structure de la base Airtable

- **Categories** : `Nom`
- **Ingredients** : `Nom`
- **Recettes** : `Nom`, `Photo`, `Categorie` (lien), `Description`, `TempsPreparation`, `TempsCuisson`, `Portions`, `Difficulte`, `Instructions`
- **RecetteIngredients** (table de liaison) : `Recette` (lien), `Ingredient` (lien), `Quantite`, `Unite`

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build de production
- `npm run lint` — vérification ESLint
