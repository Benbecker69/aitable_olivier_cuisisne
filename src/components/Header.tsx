import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { logoutAction } from "@/actions/auth";

export default async function Header() {
  const authed = await isAuthenticated();

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="font-display text-2xl text-accent">
          🍳 Mon carnet de recettes
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {authed ? (
            <>
              <Link
                href="/recettes/nouvelle"
                className="rounded-full bg-accent text-accent-foreground px-4 py-2 font-medium hover:opacity-90"
              >
                + Nouvelle recette
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="text-muted hover:text-foreground">
                  Déconnexion
                </button>
              </form>
            </>
          ) : (
            <Link href="/connexion" className="text-muted hover:text-foreground">
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
