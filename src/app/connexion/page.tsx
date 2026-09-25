"use client";

import { useActionState } from "react";
import { loginAction, type AuthState } from "@/actions/auth";

export default function ConnexionPage() {
  const [state, formAction] = useActionState<AuthState, FormData>(loginAction, undefined);

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="font-display text-3xl mb-6">Connexion</h1>
      <p className="text-muted mb-6">
        Entre le mot de passe pour ajouter, modifier ou supprimer des recettes.
      </p>
      <form action={formAction} className="space-y-4">
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          required
          className="w-full rounded-lg border border-border bg-card px-4 py-2"
        />
        {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
        <button
          type="submit"
          className="w-full rounded-full bg-accent text-accent-foreground px-4 py-2 font-medium hover:opacity-90"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
