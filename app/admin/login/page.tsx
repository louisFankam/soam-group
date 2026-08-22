import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import { connexion } from "../actions-auth";
import { sessionActive } from "@/lib/auth";

export const metadata: Metadata = { title: "Connexion admin — SOAM GROUP" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; email?: string }>;
}) {
  if (await sessionActive()) redirect("/admin");
  const { erreur, email: emailSaisi } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center bg-hero-dark px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Image src="/logo.jpeg" alt="" width={48} height={48} className="rounded-xl" />
          <div>
            <div className="font-headings font-bold text-lg text-white leading-none">
              SOAM <span className="text-accent-green">GROUP</span>
            </div>
            <div className="text-xs text-white/50 mt-1">Administration</div>
          </div>
        </div>

        <form
          action={connexion}
          className="bg-white rounded-2xl shadow-2xl p-7 space-y-4"
        >
          {erreur && (
            <p className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
              {erreur === "2"
                ? "Trop de tentatives. Réessayez dans 15 minutes."
                : "Identifiants incorrects."}
            </p>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              defaultValue={emailSaisi ?? ""}
              placeholder="admin@soamgroup.net"
              className="w-full bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none rounded-xl px-4 py-3 text-sm transition-all"
            />
          </div>
          <div>
            <label htmlFor="motDePasse" className="block text-sm font-medium text-foreground mb-1.5">
              Mot de passe
            </label>
            <input
              id="motDePasse"
              name="motDePasse"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none rounded-xl px-4 py-3 text-sm transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-deep active:scale-[0.99] transition-all text-primary-foreground font-semibold py-3 rounded-xl"
          >
            Se connecter
          </button>
        </form>
      </div>
    </main>
  );
}
