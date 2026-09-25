"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { createRecette, deleteRecette, updateRecette, uploadPhoto } from "@/lib/airtable";
import type { Difficulte, RecetteInput } from "@/lib/types";

export type RecetteFormState = { error?: string } | undefined;

function parseIngredients(formData: FormData): RecetteInput["ingredients"] {
  const noms = formData.getAll("ingredient_nom") as string[];
  const quantites = formData.getAll("ingredient_quantite") as string[];
  const unites = formData.getAll("ingredient_unite") as string[];
  return noms
    .map((nom, i) => ({
      nom: nom.trim(),
      quantite: quantites[i] ? Number(quantites[i]) : null,
      unite: unites[i] || null,
    }))
    .filter((ligne) => ligne.nom);
}

function parseRecetteInput(formData: FormData): RecetteInput {
  const num = (key: string) => {
    const value = formData.get(key);
    return value ? Number(value) : null;
  };
  return {
    nom: String(formData.get("nom") ?? "").trim(),
    categorieId: (formData.get("categorieId") as string) || null,
    description: String(formData.get("description") ?? "").trim(),
    tempsPreparation: num("tempsPreparation"),
    tempsCuisson: num("tempsCuisson"),
    portions: num("portions"),
    difficulte: ((formData.get("difficulte") as string) || null) as Difficulte | null,
    instructions: String(formData.get("instructions") ?? "").trim(),
    ingredients: parseIngredients(formData),
  };
}

async function handlePhoto(recetteId: string, formData: FormData) {
  const file = formData.get("photo") as File | null;
  if (!file || file.size === 0) return;
  const buffer = Buffer.from(await file.arrayBuffer());
  await uploadPhoto(recetteId, buffer.toString("base64"), file.name, file.type);
}

export async function createRecetteAction(
  _prevState: RecetteFormState,
  formData: FormData,
): Promise<RecetteFormState> {
  if (!(await isAuthenticated())) return { error: "Mot de passe requis." };
  const input = parseRecetteInput(formData);
  if (!input.nom) return { error: "Le nom de la recette est obligatoire." };

  const id = await createRecette(input);
  await handlePhoto(id, formData);
  revalidatePath("/");
  redirect(`/recettes/${id}`);
}

export async function updateRecetteAction(
  id: string,
  _prevState: RecetteFormState,
  formData: FormData,
): Promise<RecetteFormState> {
  if (!(await isAuthenticated())) return { error: "Mot de passe requis." };
  const input = parseRecetteInput(formData);
  if (!input.nom) return { error: "Le nom de la recette est obligatoire." };

  await updateRecette(id, input);
  await handlePhoto(id, formData);
  revalidatePath("/");
  revalidatePath(`/recettes/${id}`);
  redirect(`/recettes/${id}`);
}

export async function deleteRecetteAction(id: string) {
  if (!(await isAuthenticated())) return;
  await deleteRecette(id);
  revalidatePath("/");
  redirect("/");
}
