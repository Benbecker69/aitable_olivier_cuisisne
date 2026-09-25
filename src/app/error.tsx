"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="text-center py-24">
      <p className="text-6xl mb-4">😕</p>
      <h1 className="font-display text-3xl mb-2">Une erreur est survenue</h1>
      <p className="text-muted mb-6">Impossible de charger cette page pour le moment.</p>
      <button onClick={reset} className="rounded-full bg-accent text-accent-foreground px-5 py-2.5 font-medium">
        Réessayer
      </button>
    </div>
  );
}
