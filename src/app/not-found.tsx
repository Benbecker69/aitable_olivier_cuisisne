import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <p className="text-6xl mb-4">🔍</p>
      <h1 className="font-display text-3xl mb-2">Recette introuvable</h1>
      <p className="text-muted mb-6">Cette page ou cette recette n&apos;existe pas (ou plus).</p>
      <Link href="/" className="rounded-full bg-accent text-accent-foreground px-5 py-2.5 font-medium">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
