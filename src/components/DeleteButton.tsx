"use client";

import { useState } from "react";

export default function DeleteButton({ action }: { action: () => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-full border border-red-300 text-red-600 px-4 py-2 text-sm font-medium hover:bg-red-50"
      >
        Supprimer
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted">Confirmer ?</span>
      <form action={action}>
        <button type="submit" className="rounded-full bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700">
          Oui, supprimer
        </button>
      </form>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-full border border-border px-4 py-2 text-sm"
      >
        Annuler
      </button>
    </div>
  );
}
