import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ENTITES_SUPERADMIN } from "@/lib/superadmin-entites";

export const dynamic = "force-dynamic";

export default async function ListeTagPage() {
  const nomModule = "blog/tags";
  const spec = ENTITES_SUPERADMIN[nomModule];
  if (!spec) notFound();

  const lignes = await db.select().from(spec.table);

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link href="/superadmin/blog/articles" className="text-sm text-primary hover:underline mb-1 inline-block">
            ← Articles
          </Link>
          <h1 className="font-headings font-bold text-xl text-foreground">{spec.titre}</h1>
        </div>
        <Link
          href="/superadmin/blog/tags/nouveau"
          className="bg-primary hover:bg-primary-deep transition-colors text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl"
        >
          + Nouveau tag
        </Link>
      </div>

      <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
        <ul className="divide-y divide-card-border">
          {lignes.map((ligne) => {
            const donnees = ligne as Record<string, unknown>;
            return (
              <li key={String(donnees.id)} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{String(donnees.name)}</p>
                  <p className="text-xs text-muted-foreground truncate">#{String(donnees.slug)}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link href={`/superadmin/blog/tags/${donnees.id}`} className="text-sm text-primary hover:underline">Éditer</Link>
                  <form action="/api/superadmin" method="post">
                    <input type="hidden" name="__action" value="entite-supprimer" />
                    <input type="hidden" name="__module" value={nomModule} />
                    <input type="hidden" name="__id" value={String(donnees.id)} />
                    <button type="submit" className="text-sm text-red-600 hover:underline">Supprimer</button>
                  </form>
                </div>
              </li>
            );
          })}
          {lignes.length === 0 && (
            <li className="px-5 py-8 text-sm text-muted-foreground">Aucun tag.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
