import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteRecetteAction } from "@/actions/recettes";
import DeleteButton from "@/components/DeleteButton";
import { isAuthenticated } from "@/lib/auth";
import { getRecette } from "@/lib/airtable";

export default async function RecetteDetailPage({ params }: PageProps<"/recettes/[id]">) {
  const { id } = await params;
  const [recette, authed] = await Promise.all([getRecette(id), isAuthenticated()]);
  if (!recette) notFound();

  const duree = (recette.tempsPreparation ?? 0) + (recette.tempsCuisson ?? 0);

  return (
    <article className="max-w-3xl mx-auto">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-border mb-6">
        {recette.photoUrl ? (
          <Image src={recette.photoUrl} alt={recette.nom} fill sizes="100vw" className="object-cover" priority />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl">🍽️</div>
        )}
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          {recette.categorieNom && (
            <span className="inline-block rounded-full bg-accent text-accent-foreground text-xs font-medium px-3 py-1 mb-2">
              {recette.categorieNom}
            </span>
          )}
          <h1 className="font-display text-4xl">{recette.nom}</h1>
        </div>
        {authed && (
          <div className="flex items-center gap-2">
            <Link
              href={`/recettes/${recette.id}/modifier`}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-background"
            >
              Modifier
            </Link>
            <DeleteButton action={deleteRecetteAction.bind(null, recette.id)} />
          </div>
        )}
      </div>

      {recette.description && <p className="mt-4 text-lg text-muted">{recette.description}</p>}

      <div className="mt-6 flex flex-wrap gap-6 text-sm border-y border-border py-4">
        {duree > 0 && (
          <div>
            <div className="text-muted">Temps total</div>
            <div className="font-medium">⏱ {duree} min</div>
          </div>
        )}
        {recette.portions && (
          <div>
            <div className="text-muted">Portions</div>
            <div className="font-medium">🍽 {recette.portions} pers.</div>
          </div>
        )}
        {recette.difficulte && (
          <div>
            <div className="text-muted">Difficulté</div>
            <div className="font-medium">{recette.difficulte}</div>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h2 className="font-display text-2xl mb-3">Ingrédients</h2>
          {recette.ingredients.length === 0 ? (
            <p className="text-muted text-sm">Aucun ingrédient renseigné.</p>
          ) : (
            <ul className="space-y-2">
              {recette.ingredients.map((ligne, i) => (
                <li key={i} className="text-sm">
                  <span className="font-medium">
                    {ligne.quantite ?? ""} {ligne.unite ?? ""}
                  </span>{" "}
                  {ligne.nom}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="sm:col-span-2">
          <h2 className="font-display text-2xl mb-3">Instructions</h2>
          {recette.instructions.length === 0 ? (
            <p className="text-muted text-sm">Aucune instruction renseignée.</p>
          ) : (
            <ol className="space-y-4">
              {recette.instructions.map((etape, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-none w-7 h-7 rounded-full bg-accent text-accent-foreground text-sm font-medium flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span>{etape}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </article>
  );
}
