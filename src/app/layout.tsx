import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mon carnet de recettes",
  description: "Un carnet de recettes de cuisine simple et gourmand.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-border py-6 text-center text-sm text-muted">
          Mon carnet de recettes — fait avec Next.js et Airtable
        </footer>
      </body>
    </html>
  );
}
