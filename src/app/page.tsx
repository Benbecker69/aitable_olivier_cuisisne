import RecipeGrid from "@/components/RecipeGrid";
import { getCategories, getRecettes } from "@/lib/airtable";

export default async function HomePage() {
  const [recettes, categories] = await Promise.all([getRecettes(), getCategories()]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl mb-2">Bienvenue dans le carnet</h1>
        <p className="text-muted">
          {recettes.length} recette{recettes.length > 1 ? "s" : ""} à explorer, filtrer et cuisiner.
        </p>
      </div>
      <RecipeGrid recettes={recettes} categories={categories} />
    </div>
  );
}
