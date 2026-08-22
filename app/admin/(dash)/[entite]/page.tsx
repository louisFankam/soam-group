import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ENTITES } from "@/lib/admin-entites";

export default async function ListeEntitePage({
  params,
}: {
  params: Promise<{ entite: string }>;
}) {
  const { entite: nomEntite } = await params;
  const spec = ENTITES[nomEntite];
  if (!spec) notFound();

  const lignes = await db.select().from(spec.table);

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-headings font-bold text-xl text-foreground">{spec.titre}</h1>
        <Link
          href={`/admin/${nomEntite}/nouveau`}
          className="bg-primary hover:bg-primary-deep transition-colors text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl"
        >
          + Nouveau
        </Link>
      </div>

      <p className="text-sm text-muted-foreground -mt-3">
        {lignes.length} élément(s){spec.routePublic && (
          <> — <a href={spec.routePublic} target="_blank" className="text-primary hover:underline">voir sur le site</a></>
        )}
      </p>

      <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
        <ul className="divide-y divide-card-border">
          {lignes.map((ligne) => {
            const donnees = ligne as Record<string, unknown>;
            return (
              <li key={String(donnees.id)} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {String(donnees[spec.colonneTitre] ?? "(sans titre)")}
                  </p>
                  {"slug" in donnees && (
                    <p className="text-xs text-muted-foreground truncate">/{String(donnees.slug)}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={`/admin/${nomEntite}/${donnees.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Éditer
                  </Link>
                  <form action="/api/admin" method="post">
                    <input type="hidden" name="__action" value="supprimer" />
                    <input type="hidden" name="__entite" value={nomEntite} />
                    <input type="hidden" name="__id" value={String(donnees.id)} />
                    <button type="submit" className="text-sm text-red-600 hover:underline">
                      Supprimer
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
          {lignes.length === 0 && (
            <li className="px-5 py-8 text-sm text-muted-foreground">Aucun élément.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
