export type Categorie = { id: string; nom: string };
export type Ingredient = { id: string; nom: string };

export type Difficulte = "Facile" | "Moyen" | "Difficile";

export type RecetteResume = {
  id: string;
  nom: string;
  photoUrl: string | null;
  categorieId: string | null;
  categorieNom: string | null;
  tempsPreparation: number | null;
  tempsCuisson: number | null;
  portions: number | null;
  difficulte: Difficulte | null;
};

export type IngredientLigne = {
  nom: string;
  quantite: number | null;
  unite: string | null;
};

export type RecetteDetail = RecetteResume & {
  description: string;
  instructions: string[];
  ingredients: IngredientLigne[];
};

export type RecetteInput = {
  nom: string;
  categorieId: string | null;
  description: string;
  tempsPreparation: number | null;
  tempsCuisson: number | null;
  portions: number | null;
  difficulte: Difficulte | null;
  instructions: string;
  ingredients: IngredientLigne[];
};

export const UNITES = [
  "g",
  "kg",
  "ml",
  "cl",
  "L",
  "pièce",
  "c. à soupe",
  "c. à café",
  "pincée",
  "au goût",
] as const;
