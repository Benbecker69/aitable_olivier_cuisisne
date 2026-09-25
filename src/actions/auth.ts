"use server";

import { redirect } from "next/navigation";
import { checkPassword, setAuthCookie, clearAuthCookie } from "@/lib/auth";

export type AuthState = { error?: string } | undefined;

export async function loginAction(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) return { error: "Mot de passe incorrect." };
  await setAuthCookie();
  redirect("/");
}

export async function logoutAction() {
  await clearAuthCookie();
  redirect("/");
}
