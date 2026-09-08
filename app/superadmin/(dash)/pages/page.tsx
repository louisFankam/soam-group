import Link from "next/link";
import { db } from "@/lib/db";
import { pages, sections } from "@/lib/schema";
import { TYPES_SECTIONS } from "@/lib/section-types";

export default async function PagesAdminPage() {
  const list = await db.select().from(pages).orderBy(pages.menuOrder);
  const toutesSections = await db.select().from(sections);
  const compte = new Map<number, number>();
  for (const s of toutesSections) compte.set(s.pageId, (compte.get(s.pageId) ?? 0) + 1);

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-headings font-bold text-xl text-foreground">Pages</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Créez des pages CMS et assemblez-les à partir de {TYPES_SECTIONS.length} types de sections.
          </p>
        </div>
        <Link
          href="/superadmin/pages/nouveau"
          className="bg-primary hover:bg-primary-deep transition-colors text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl"
        >
          + Nouvelle page
        </Link>
      </div>

      <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
        <ul className="divide-y divide-card-border">
          {list.map((p) => {
            const d = p as Record<string, unknown>;
            return (
              <li key={String(p.id)} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {String(p.title)}
                    {p.isHomepage && <span className="ml-2 text-[10px] font-bold uppercase bg-accent-green/15 text-accent-green px-2 py-0.5 rounded-full">Accueil</span>}
                    {!p.isPublished && <span className="ml-2 text-[10px] font-bold uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Brouillon</span>}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    /{String(p.slug)} — {(compte.get(p.id) ?? 0)} section(s)
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link href={`/superadmin/pages/${p.id}`} className="text-sm text-primary hover:underline">
                    Sections & édition
                  </Link>
                  <form action="/api/superadmin" method="post">
                    <input type="hidden" name="__action" value="page-supprimer" />
                    <input type="hidden" name="__id" value={String(p.id)} />
                    <button type="submit" className="text-sm text-red-600 hover:underline">Supprimer</button>
                  </form>
                </div>
              </li>
            );
          })}
          {list.length === 0 && (
            <li className="px-5 py-8 text-sm text-muted-foreground">Aucune page. Créez-en une pour commencer.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
