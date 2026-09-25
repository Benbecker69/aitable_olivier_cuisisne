import { notFound, redirect } from "next/navigation";
import { updateRecetteAction } from "@/actions/recettes";
import RecetteForm from "@/components/RecetteForm";
import { isAuthenticated } from "@/lib/auth";
import { getCategories, getIngredients, getRecette } from "@/lib/airtable";

export default async function ModifierRecettePage({ params }: PageProps<"/recettes/[id]/modifier">) {
  if (!(await isAuthenticated())) redirect("/connexion");
  const { id } = await params;

  const [recette, categories, ingredients] = await Promise.all([
    getRecette(id),
    getCategories(),
    getIngredients(),
  ]);
  if (!recette) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Modifier « {recette.nom} »</h1>
      <RecetteForm
        categories={categories}
        ingredients={ingredients}
        recette={recette}
        action={updateRecetteAction.bind(null, id)}
      />
    </div>
  );
}
