# Architecture

## Stack technique

- **[Next.js](https://nextjs.org) 16** (App Router) + **TypeScript**
- **[Tailwind CSS](https://tailwindcss.com)** pour le style
- **Airtable** comme base de données, via son **API REST directe** (`fetch` natif) — pas de SDK `airtable.js`, pour garder le code minimal et éviter une dépendance supplémentaire
- Aucune bibliothèque de gestion d'état ni d'authentification tierce : l'app reste volontairement simple

## Arborescence

```
src/
  app/                          # Pages (routing par dossiers, Next.js App Router)
    layout.tsx                   # Layout racine : polices, header, footer
    page.tsx                     # Page d'accueil (liste des recettes)
    globals.css                  # Thème Tailwind (couleurs, polices)
    not-found.tsx                # Page 404
    error.tsx                    # Page d'erreur générique
    connexion/
      page.tsx                    # Formulaire de connexion (mot de passe)
    recettes/
      nouvelle/page.tsx            # Formulaire de création de recette
      [id]/page.tsx                 # Page détail d'une recette
      [id]/modifier/page.tsx        # Formulaire de modification (réutilise RecetteForm)
  components/
    Header.tsx                    # Barre de navigation (adaptée si connecté ou non)
    RecipeGrid.tsx                 # Grille de recettes + recherche + filtre par catégorie
    RecipeCard.tsx                 # Carte d'une recette (utilisée dans la grille)
    RecetteForm.tsx                # Formulaire partagé création/modification
    DeleteButton.tsx               # Bouton de suppression avec confirmation
  lib/
    airtable.ts                   # Toute la logique d'accès à l'API Airtable (lecture + écriture)
    auth.ts                       # Vérification du mot de passe et gestion du cookie de connexion
    types.ts                      # Types TypeScript partagés (Recette, Ingrédient, Catégorie...)
  actions/
    recettes.ts                   # Server Actions : créer / modifier / supprimer une recette
    auth.ts                       # Server Actions : connexion / déconnexion
```

## Comment l'app est construite

### Server Components par défaut

Les pages (`page.tsx`) sont des **Server Components** : elles s'exécutent côté serveur, peuvent appeler `await` directement (ex : `getRecettes()`) sans `useEffect`, et n'envoient au navigateur que le HTML déjà généré. Seuls les composants qui ont vraiment besoin d'interactivité (`RecipeGrid` pour la recherche/filtre, `RecetteForm` pour le formulaire) sont des **Client Components** (`"use client"`).

### Server Actions pour les écritures

Créer, modifier et supprimer une recette passent par des **Server Actions** (`src/actions/`), pas par des routes API séparées. Une Server Action est une fonction serveur appelée directement depuis un formulaire HTML (`<form action={maFonction}>`), sans écrire de route `/api/...` ni de `fetch` côté client.

### Accès à Airtable sans cache

Toute la lecture/écriture Airtable passe par `src/lib/airtable.ts`, avec systématiquement `cache: "no-store"` (jamais de cache). Ce choix a été fait après un bug rencontré en cours de développement : avec un cache de courte durée, un ingrédient tout juste créé pouvait apparaître sans nom sur la page suivante (jointure faite avec une liste d'ingrédients encore en cache, donc périmée). Vu la taille du projet (carnet personnel, peu de trafic, très en dessous des limites de l'API Airtable), la fraîcheur des données a été jugée plus importante que la performance d'un cache.

### Photos des recettes

L'upload d'une photo se fait en convertissant le fichier choisi en base64 côté serveur (dans la Server Action), puis en l'envoyant à l'endpoint dédié d'Airtable : `POST https://content.airtable.com/v0/{baseId}/{recordId}/Photo/uploadAttachment` (limite de 5 Mo par fichier). Les URLs de photos renvoyées par Airtable expirent après un certain temps (non permanentes) — c'est une raison supplémentaire de ne jamais les mettre en cache longtemps côté app.

### Connexion / protection par mot de passe

Pas de vrai système de comptes : un unique mot de passe (`APP_PASSWORD`, dans `.env.local`) protège la création/modification/suppression. À la connexion, un cookie (haché, jamais le mot de passe en clair) est posé dans le navigateur ; chaque Server Action d'écriture vérifie ce cookie avant d'agir. Volontairement simple, adapté à un projet personnel/pédagogique plutôt qu'à une vraie mise en production publique.

### Design

Palette chaleureuse (orange/terracotta sur fond neutre, y compris en mode sombre), une police à empattements (`Playfair Display`) pour les titres de recettes et une police sans empattements (`Inter`) pour le reste, via `next/font/google`. Mise en page responsive (grille de 1 à 3 colonnes selon la largeur d'écran) avec Tailwind CSS, sans bibliothèque de composants supplémentaire.
