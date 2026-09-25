import Image from "next/image";
import Link from "next/link";
import type { RecetteResume } from "@/lib/types";

export default function RecipeCard({ recette }: { recette: RecetteResume }) {
  const duree = (recette.tempsPreparation ?? 0) + (recette.tempsCuisson ?? 0);

  return (
    <Link
      href={`/recettes/${recette.id}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] bg-border">
        {recette.photoUrl ? (
          <Image
            src={recette.photoUrl}
            alt={recette.nom}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">🍽️</div>
        )}
        {recette.categorieNom && (
          <span className="absolute top-3 left-3 rounded-full bg-accent text-accent-foreground text-xs font-medium px-3 py-1">
            {recette.categorieNom}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-xl leading-tight">{recette.nom}</h3>
        <div className="mt-2 flex items-center gap-3 text-sm text-muted">
          {duree > 0 && <span>⏱ {duree} min</span>}
          {recette.portions && <span>🍽 {recette.portions} pers.</span>}
          {recette.difficulte && <span>{recette.difficulte}</span>}
        </div>
      </div>
    </Link>
  );
}
