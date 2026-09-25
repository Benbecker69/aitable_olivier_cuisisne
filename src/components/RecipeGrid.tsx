"use client";

import { useMemo, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import type { Categorie, RecetteResume } from "@/lib/types";

export default function RecipeGrid({
  recettes,
  categories,
}: {
  recettes: RecetteResume[];
  categories: Categorie[];
}) {
  const [recherche, setRecherche] = useState("");
  const [categorieId, setCategorieId] = useState<string | null>(null);

  const filtrees = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return recettes.filter((r) => {
      const matchRecherche = !q || r.nom.toLowerCase().includes(q);
      const matchCategorie = !categorieId || r.categorieId === categorieId;
      return matchRecherche && matchCategorie;
    });
  }, [recettes, recherche, categorieId]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher une recette…"
          className="flex-1 rounded-full border border-border bg-card px-5 py-2.5"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategorieId(null)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              categorieId === null ? "bg-accent text-accent-foreground" : "bg-card border border-border"
            }`}
          >
            Toutes
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategorieId(c.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                categorieId === c.id ? "bg-accent text-accent-foreground" : "bg-card border border-border"
              }`}
            >
              {c.nom}
            </button>
          ))}
        </div>
      </div>

      {filtrees.length === 0 ? (
        <p className="text-muted py-12 text-center">Aucune recette ne correspond à ta recherche.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrees.map((r) => (
            <RecipeCard key={r.id} recette={r} />
          ))}
        </div>
      )}
    </div>
  );
}
