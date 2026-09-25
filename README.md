# Mon carnet de recettes

Une application web pour parcourir, rechercher et gérer des recettes de cuisine, avec [Airtable](https://airtable.com) comme base de données et [Next.js](https://nextjs.org) comme front-end.

- Accueil avec recherche par nom et filtre par catégorie (Entrée, Plat, Dessert)
- Page détail d'une recette : photo, temps de préparation/cuisson, portions, difficulté, ingrédients avec quantités, instructions étape par étape
- Création, modification et suppression de recettes depuis le site (photo comprise), protégées par un mot de passe

## Documentation

Toute la documentation détaillée du projet est dans le dossier [`doc/`](doc/) :

| Fichier | Contenu |
|---|---|
| [`doc/01-demarrage.md`](doc/01-demarrage.md) | Installer et lancer le projet en local, étape par étape |
| [`doc/02-airtable.md`](doc/02-airtable.md) | Comment accéder à la base Airtable et schéma complet des tables |
| [`doc/03-architecture.md`](doc/03-architecture.md) | Stack technique, arborescence du code, comment l'app est construite |
| [`doc/04-fonctionnalites.md`](doc/04-fonctionnalites.md) | Tour des fonctionnalités avec captures d'écran |

**Pour une correction ou une prise en main rapide, commencer par `doc/01-demarrage.md`.**

## Démarrage express

```bash
npm install
# créer .env.local (voir doc/01-demarrage.md et doc/02-airtable.md)
npm run dev
```

## Stack technique

Next.js (App Router) + TypeScript + Tailwind CSS, connecté directement à l'API REST d'Airtable (sans SDK). Détails complets dans [`doc/03-architecture.md`](doc/03-architecture.md).
