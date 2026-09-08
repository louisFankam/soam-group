import Link from "next/link";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function ListeArticlesPage() {
  const lignes = await db.select().from(posts);

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-headings font-bold text-xl text-foreground">Articles</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/superadmin/blog/categories"
            className="border border-border hover:bg-secondary transition-colors text-sm font-medium text-foreground px-3 py-2 rounded-xl"
          >
            Catégories
          </Link>
          <Link
            href="/superadmin/blog/tags"
            className="border border-border hover:bg-secondary transition-colors text-sm font-medium text-foreground px-3 py-2 rounded-xl"
          >
            Tags
          </Link>
          <Link
            href="/superadmin/blog/articles/nouveau"
            className="bg-primary hover:bg-primary-deep transition-colors text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl"
          >
            + Nouvel article
          </Link>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
        <ul className="divide-y divide-card-border">
          {lignes.map((ligne) => {
            const d = ligne as Record<string, unknown>;
            return (
              <li key={String(d.id)} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{String(d.title)}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    /{String(d.slug)} — {d.isPublished ? "Publié" : "Brouillon"}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link href={`/superadmin/blog/articles/${d.id}`} className="text-sm text-primary hover:underline">Éditer</Link>
                  <form action="/api/superadmin" method="post">
                    <input type="hidden" name="__action" value="post-supprimer" />
                    <input type="hidden" name="__id" value={String(d.id)} />
                    <button type="submit" className="text-sm text-red-600 hover:underline">Supprimer</button>
                  </form>
                </div>
              </li>
            );
          })}
          {lignes.length === 0 && (
            <li className="px-5 py-8 text-sm text-muted-foreground">Aucun article.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
