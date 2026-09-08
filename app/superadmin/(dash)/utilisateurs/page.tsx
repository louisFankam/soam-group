import Link from "next/link";
import { db } from "@/lib/db";
import { utilisateurs } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function SuperAdminUtilisateursPage() {
  const lignes = await db.select().from(utilisateurs);

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-headings font-bold text-xl text-foreground">Utilisateurs</h1>
        <Link
          href="/superadmin/utilisateurs/nouveau"
          className="bg-primary hover:bg-primary-deep transition-colors text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl"
        >
          + Nouveau
        </Link>
      </div>

      <p className="text-sm text-muted-foreground -mt-3">
        {lignes.length} utilisateur(s)
      </p>

      <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
        <ul className="divide-y divide-card-border">
          {lignes.map((ligne) => (
            <li key={ligne.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {ligne.nom || "(sans nom)"}
                </p>
                <p className="text-xs text-muted-foreground truncate">{ligne.email}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                  ligne.role === "superadmin"
                    ? "bg-red-100 text-red-700"
                    : ligne.role === "editor"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {ligne.role}
                </span>
                <span className={`text-xs ${ligne.actif ? "text-green-600" : "text-red-500"}`}>
                  {ligne.actif ? "Actif" : "Inactif"}
                </span>
                <Link
                  href={`/superadmin/utilisateurs/${ligne.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  Éditer
                </Link>
                <form action="/api/superadmin" method="post">
                  <input type="hidden" name="__action" value="utilisateur-supprimer" />
                  <input type="hidden" name="__id" value={String(ligne.id)} />
                  <button type="submit" className="text-sm text-red-600 hover:underline">
                    Supprimer
                  </button>
                </form>
              </div>
            </li>
          ))}
          {lignes.length === 0 && (
            <li className="px-5 py-8 text-sm text-muted-foreground">Aucun utilisateur.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
