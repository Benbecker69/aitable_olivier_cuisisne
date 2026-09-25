import { redirect } from "next/navigation";
import { createRecetteAction } from "@/actions/recettes";
import RecetteForm from "@/components/RecetteForm";
import { isAuthenticated } from "@/lib/auth";
import { getCategories, getIngredients } from "@/lib/airtable";

export default async function NouvelleRecettePage() {
  if (!(await isAuthenticated())) redirect("/connexion");
  const [categories, ingredients] = await Promise.all([getCategories(), getIngredients()]);

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Nouvelle recette</h1>
      <RecetteForm categories={categories} ingredients={ingredients} action={createRecetteAction} />
    </div>
  );
}
