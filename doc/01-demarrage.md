# Démarrage

Comment installer et lancer le projet en local.

## Prérequis

- [Node.js](https://nodejs.org) version 20.9 ou plus récente
- npm (installé avec Node.js)
- Un compte Airtable (gratuit) — voir [`02-airtable.md`](02-airtable.md) pour obtenir un accès à la base

## 1. Récupérer le projet

```bash
git clone https://github.com/Benbecker69/aitable_olivier_cuisisne.git
cd aitable_olivier_cuisisne
npm install
```

## 2. Configurer l'accès à Airtable

Suivre **[`02-airtable.md`](02-airtable.md)** pour :
1. accéder à une copie de la base Airtable du projet,
2. générer un Personal Access Token,
3. récupérer l'ID de la base.

Créer ensuite un fichier `.env.local` à la racine du projet (jamais commité, il contient des secrets) :

```bash
AIRTABLE_TOKEN=patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
APP_PASSWORD=recettes2026
```

- `AIRTABLE_TOKEN` et `AIRTABLE_BASE_ID` : obtenus à l'étape précédente (propres à chacun, jamais partagés).
- `APP_PASSWORD` : le mot de passe demandé dans l'application pour créer, modifier ou supprimer une recette. Sa valeur peut rester **`recettes2026`** (mot de passe utilisé pour ce projet, sans enjeu de sécurité réel) ou être changée librement.

## 3. Lancer le projet

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000). L'accueil doit afficher les recettes de démonstration de la base Airtable.

Pour créer/modifier/supprimer une recette : cliquer sur **Connexion** en haut à droite et entrer le mot de passe (`recettes2026` par défaut).

## Autres scripts disponibles

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement (rechargement automatique) |
| `npm run build` | Build de production, vérifie aussi le typage TypeScript |
| `npm run lint` | Vérification ESLint |

## En cas de problème

- **La page d'accueil est vide / erreur au chargement** : vérifier que `.env.local` existe bien à la racine avec les 3 variables, et que le token a les bons droits (voir [`02-airtable.md`](02-airtable.md)).
- **Le port 3000 est déjà utilisé** : Next.js choisit automatiquement un port libre (3001, 3002…) et l'affiche dans le terminal au lancement de `npm run dev`.
