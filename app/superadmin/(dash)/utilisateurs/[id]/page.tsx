import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { utilisateurs } from "@/lib/schema";
import { ROLES } from "@/lib/permissions";

const inputCls =
  "w-full bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none rounded-xl px-3.5 py-2.5 text-sm transition-all";

export default async function SuperAdminUtilisateurPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { id: brutId } = await params;
  const { erreur } = await searchParams;
  const nouveau = brutId === "nouveau";
  let ligne: Record<string, unknown> = {};
  if (!nouveau) {
    const num = Number(brutId);
    if (!Number.isFinite(num)) notFound();
    const trouve = await db.select().from(utilisateurs).where(eq(utilisateurs.id, num)).get();
    if (!trouve) notFound();
    ligne = trouve as Record<string, unknown>;
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <Link href="/superadmin/utilisateurs" className="text-sm text-primary hover:underline">
          ← Utilisateurs
        </Link>
        <h1 className="font-headings font-bold text-xl text-foreground mt-1">
          {nouveau ? "Nouvel utilisateur" : `Modifier — ${String(ligne.nom ?? ligne.email ?? "")}`}
        </h1>
      </div>

      {erreur === "email" && (
        <p className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          Cet email est déjà utilisé, choisissez-en un autre.
        </p>
      )}

      <form action="/api/superadmin" method="post" className="bg-card border border-card-border rounded-2xl p-6 space-y-5">
        <input type="hidden" name="__action" value="utilisateur-enregistrer" />
        <input type="hidden" name="__id" value={brutId} />

        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-foreground mb-1.5">
            Nom complet
          </label>
          <input
            id="nom"
            name="nom"
            type="text"
            required
            defaultValue={String(ligne.nom ?? "")}
            placeholder="Jean Dupont"
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={String(ligne.email ?? "")}
            placeholder="jean@example.com"
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-foreground mb-1.5">
            Rôle
          </label>
          <select id="role" name="role" defaultValue={String(ligne.role ?? "editor")} className={inputCls}>
            {ROLES.map((r) => (
              <option key={r.valeur} value={r.valeur}>
                {r.label} — {r.description}
              </option>
            ))}
          </select>
        </div>

        {!nouveau && (
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="actif"
              id="actif"
              defaultChecked={ligne.actif !== false}
              className="w-5 h-5 accent-[#1a4fbd]"
            />
            <label htmlFor="actif" className="text-sm font-medium text-foreground">
              Compte actif
            </label>
          </div>
        )}

        <div>
          <label htmlFor="motDePasse" className="block text-sm font-medium text-foreground mb-1.5">
            Mot de passe {nouveau && <span className="text-red-500">*</span>}
            {!nouveau && <span className="text-muted-foreground font-normal">(laisser vide pour garder l&apos;actuel)</span>}
          </label>
          <input
            id="motDePasse"
            name="motDePasse"
            type="password"
            required={nouveau}
            autoComplete="new-password"
            placeholder={nouveau ? "••••••••" : "••••••••"}
            className={inputCls}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-primary hover:bg-primary-deep active:scale-[0.99] transition-all text-primary-foreground font-semibold text-sm px-6 py-3 rounded-xl"
          >
            Enregistrer
          </button>
          <Link
            href="/superadmin/utilisateurs"
            className="border border-border hover:bg-secondary transition-colors text-sm font-medium text-foreground px-6 py-3 rounded-xl"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
