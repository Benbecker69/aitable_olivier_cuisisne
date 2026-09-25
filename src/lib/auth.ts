import { createHash } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "recettes_auth";

function expectedValue() {
  return createHash("sha256").update(process.env.APP_PASSWORD!).digest("hex");
}

export function checkPassword(password: string): boolean {
  return password === process.env.APP_PASSWORD;
}

export async function setAuthCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, expectedValue(), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAuthCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === expectedValue();
}
