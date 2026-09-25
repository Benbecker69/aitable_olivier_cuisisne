# Base de données Airtable

L'application utilise [Airtable](https://airtable.com) comme base de données, via son **API REST directe** (aucun SDK npm côté projet — voir [`03-architecture.md`](03-architecture.md)).

## Accéder à la base

Pour des raisons de sécurité, le Personal Access Token de l'auteur du projet n'est ni commité ni partagé. Pour obtenir ton propre accès, complet et indépendant :

1. **Ouvrir le lien d'invitation** vers la base du projet :
   https://airtable.com/invite/l?inviteId=invdmnPZe8epK7Rsg&inviteToken=7bf1be837023fa0998fc5890fd57ed650e4548b19d3f1ef0604ba7b09d028805&utm_medium=email&utm_source=product_team&utm_content=transactional-alerts
2. Se connecter (ou créer un compte Airtable gratuit).
3. En haut à gauche du nom de la base, ouvrir le menu et choisir **« Dupliquer la base »** (*Duplicate base*) pour en obtenir une copie complète (tables, champs, relations et données) dans son propre espace Airtable. Chacun travaille ensuite sur sa **propre copie**, indépendante de celle de l'auteur.
4. Récupérer l'**ID de la base** dans l'URL de la copie : `https://airtable.com/appXXXXXXXXXXXXXX/...` → l'ID est la partie qui commence par `app`.
5. Générer un **Personal Access Token** personnel sur [airtable.com/create/tokens](https://airtable.com/create/tokens) :
   - Scopes à cocher : `data.records:read`, `data.records:write`, `schema.bases:write`
   - Accès : limité à sa copie de la base
   - Copier le token généré (il ne sera plus jamais affiché en entier) dans `.env.local` (voir [`01-demarrage.md`](01-demarrage.md))

**Pourquoi dupliquer plutôt que de partager un seul token :** un Personal Access Token donne un accès complet en lecture/écriture à la base. Le laisser en clair dans un repo ou le faire circuler serait une faille de sécurité — chacun doit avoir son propre token, sur sa propre copie des données.

## Schéma de la base

4 tables, dont une table de liaison pour gérer les quantités d'ingrédients par recette.

```
Categories ──┐
             │ (1 catégorie → plusieurs recettes)
             ▼
          Recettes ──┐
                      │ (1 recette → plusieurs lignes d'ingrédients)
                      ▼
          RecetteIngredients ──┐
                                 │ (1 ligne → 1 ingrédient)
                                 ▼
                            Ingredients
```

### `Categories`

| Champ | Type Airtable | Rôle |
|---|---|---|
| `Nom` | Texte sur une ligne (champ primaire) | Nom de la catégorie (Entrée, Plat, Dessert...) |

### `Ingredients`

| Champ | Type Airtable | Rôle |
|---|---|---|
| `Nom` | Texte sur une ligne (champ primaire) | Nom de l'ingrédient (réutilisable entre plusieurs recettes) |

### `Recettes`

| Champ | Type Airtable | Rôle |
|---|---|---|
| `Nom` | Texte sur une ligne (champ primaire) | Titre de la recette |
| `Photo` | Pièce jointe | Photo du plat |
| `Categorie` | Lien vers `Categories` | Catégorie de la recette |
| `Description` | Texte multiligne | Courte accroche affichée sous le titre |
| `TempsPreparation` | Nombre | Temps de préparation en minutes |
| `TempsCuisson` | Nombre | Temps de cuisson en minutes |
| `Portions` | Nombre | Nombre de personnes |
| `Difficulte` | Sélection unique (`Facile`, `Moyen`, `Difficile`) | Niveau de difficulté |
| `Instructions` | Texte multiligne | Une étape par ligne |

### `RecetteIngredients` (table de liaison)

Airtable ne permet pas d'attacher un attribut (une quantité, une unité) directement à un lien entre deux tables. Le pattern standard pour un many-to-many avec attributs est une **table de liaison** intermédiaire :

| Champ | Type Airtable | Rôle |
|---|---|---|
| `ID` | Numérotation automatique (champ primaire) | Identifiant technique, sans usage dans l'app |
| `Recette` | Lien vers `Recettes` | La recette concernée |
| `Ingredient` | Lien vers `Ingredients` | L'ingrédient concerné |
| `Quantite` | Nombre | Quantité (ex : `200`) |
| `Unite` | Sélection unique (`g`, `kg`, `ml`, `cl`, `L`, `pièce`, `c. à soupe`, `c. à café`, `pincée`, `au goût`) | Unité de la quantité |

*Une recette a donc plusieurs lignes dans `RecetteIngredients` (une par ingrédient), chacune pointant vers un ingrédient de la table `Ingredients`.*

## Convention de nommage

Les noms de tables et de champs sont volontairement **sans accents ni espaces** (`Categorie`, `TempsPreparation`...) même si Airtable les tolère techniquement. Cette convention a été adoptée après un bug d'encodage rencontré pendant le développement (un accent envoyé via un payload en ligne de commande a été corrompu) — éviter accents/espaces dans les noms techniques (tables, champs) supprime ce risque. Les **valeurs des données** (le contenu réel des recettes, en français avec accents) n'ont aucune restriction.

## Recréer le schéma sans dupliquer la base

Si besoin de recréer les tables à la main (ou via un script/agent) plutôt que de dupliquer la base, l'ordre à respecter est : `Categories`, `Ingredients`, `Recettes` (le champ `Categorie` a besoin que `Categories` existe déjà), puis `RecetteIngredients` (a besoin de `Recettes` et `Ingredients`). Les noms et types de champs exacts sont ceux listés ci-dessus.
