"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { RecetteFormState } from "@/actions/recettes";
import type { Categorie, Ingredient, IngredientLigne, RecetteDetail } from "@/lib/types";
import { UNITES } from "@/lib/types";

const inputClass = "w-full rounded-lg border border-border bg-card px-4 py-2";
const rowInputClass = "rounded-lg border border-border bg-card px-4 py-2 min-w-0";
const labelClass = "block text-sm font-medium mb-1";

export default function RecetteForm({
  categories,
  ingredients,
  recette,
  action,
}: {
  categories: Categorie[];
  ingredients: Ingredient[];
  recette?: RecetteDetail;
  action: (state: RecetteFormState, formData: FormData) => Promise<RecetteFormState>;
}) {
  const [state, formAction] = useActionState<RecetteFormState, FormData>(action, undefined);
  const [lignes, setLignes] = useState<IngredientLigne[]>(
    recette?.ingredients.length ? recette.ingredients : [{ nom: "", quantite: null, unite: null }],
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {state?.error && <p className="text-red-600">{state.error}</p>}

      <div>
        <label className={labelClass}>Nom de la recette</label>
        <input name="nom" defaultValue={recette?.nom} required className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Photo {recette && "(laisser vide pour garder l'actuelle)"}</label>
        <input type="file" name="photo" accept="image/*" className="block" />
      </div>

      <div>
        <label className={labelClass}>Catégorie</label>
        <select name="categorieId" defaultValue={recette?.categorieId ?? ""} className={inputClass}>
          <option value="">—</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Description courte</label>
        <textarea name="description" defaultValue={recette?.description} rows={2} className={inputClass} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Préparation (min)</label>
          <input type="number" name="tempsPreparation" defaultValue={recette?.tempsPreparation ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Cuisson (min)</label>
          <input type="number" name="tempsCuisson" defaultValue={recette?.tempsCuisson ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Portions</label>
          <input type="number" name="portions" defaultValue={recette?.portions ?? ""} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Difficulté</label>
        <select name="difficulte" defaultValue={recette?.difficulte ?? ""} className={inputClass}>
          <option value="">—</option>
          <option value="Facile">Facile</option>
          <option value="Moyen">Moyen</option>
          <option value="Difficile">Difficile</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Ingrédients</label>
        <datalist id="liste-ingredients">
          {ingredients.map((i) => (
            <option key={i.id} value={i.nom} />
          ))}
        </datalist>
        <div className="space-y-2">
          {lignes.map((ligne, i) => (
            <div key={i} className="flex gap-2">
              <input
                list="liste-ingredients"
                name="ingredient_nom"
                defaultValue={ligne.nom}
                placeholder="Ingrédient"
                className={`${rowInputClass} flex-1`}
              />
              <input
                type="number"
                step="0.01"
                name="ingredient_quantite"
                defaultValue={ligne.quantite ?? ""}
                placeholder="Qté"
                className={`${rowInputClass} w-24`}
              />
              <select name="ingredient_unite" defaultValue={ligne.unite ?? ""} className={`${rowInputClass} w-32`}>
                <option value="">—</option>
                {UNITES.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setLignes(lignes.filter((_, idx) => idx !== i))}
                className="px-3 text-muted hover:text-red-600"
                aria-label="Retirer cet ingrédient"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setLignes([...lignes, { nom: "", quantite: null, unite: null }])}
          className="mt-2 text-sm text-accent font-medium"
        >
          + Ajouter un ingrédient
        </button>
      </div>

      <div>
        <label className={labelClass}>Instructions (une étape par ligne)</label>
        <textarea
          name="instructions"
          defaultValue={recette?.instructions.join("\n")}
          rows={8}
          className={inputClass}
        />
      </div>

      <SubmitButton isEdit={!!recette} />
    </form>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-accent text-accent-foreground px-6 py-2.5 font-medium hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Enregistrement…" : isEdit ? "Enregistrer les modifications" : "Créer la recette"}
    </button>
  );
}
