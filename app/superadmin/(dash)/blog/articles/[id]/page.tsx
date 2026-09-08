import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { posts, categories, tags, postTag } from "@/lib/schema";

const inputCls =
  "w-full bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none rounded-xl px-3.5 py-2.5 text-sm transition-all";

export default async function FormulaireArticlePage({
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
    const trouve = await db.select().from(posts).where(eq(posts.id, num)).get();
    if (!trouve) notFound();
    ligne = trouve as Record<string, unknown>;
  }

  const categoriesBloc = await db.select().from(categories).where(eq(categories.group, "blog"));
  const tagsBloc = await db.select().from(tags);
  let tagsSelectionnes: string[] = [];
  if (!nouveau && ligne.id) {
    const lies = await db
      .select({ tagId: postTag.tagId })
      .from(postTag)
      .where(eq(postTag.postId, Number(ligne.id)));
    tagsSelectionnes = lies.map((l) => String(l.tagId));
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <Link href="/superadmin/blog/articles" className="text-sm text-primary hover:underline">← Articles</Link>
        <h1 className="font-headings font-bold text-xl text-foreground mt-1">
          {nouveau ? "Nouvel article" : `Modifier — ${String(ligne.title ?? "")}`}
        </h1>
      </div>

      {erreur === "slug" && (
        <p className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          Ce slug existe déjà.
        </p>
      )}

      <form action="/api/superadmin" method="post" encType="multipart/form-data" className="bg-card border border-card-border rounded-2xl p-6 space-y-5">
        <input type="hidden" name="__action" value="post-enregistrer" />
        <input type="hidden" name="__id" value={brutId} />

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Titre <span className="text-red-500">*</span></label>
          <input name="title" type="text" required defaultValue={String(ligne.title ?? "")} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Slug <span className="text-red-500">*</span></label>
          <input name="slug" type="text" required defaultValue={String(ligne.slug ?? "")} className={inputCls} />
          <p className="text-xs text-muted-foreground mt-1">Identifiant de l&apos;URL (ex: mon-premier-article)</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Catégorie</label>
          <select name="categoryId" className={inputCls} defaultValue={String(ligne.categoryId ?? "")}>
            <option value="">Aucune</option>
            {categoriesBloc.map((c) => (
              <option key={c.id} value={String(c.id)}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Chapeau (résumé)</label>
          <textarea name="excerpt" rows={2} defaultValue={String(ligne.excerpt ?? "")} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Corps de l&apos;article (un paragraphe par ligne)</label>
          <textarea
            name="body"
            rows={8}
            defaultValue={Array.isArray(ligne.body) ? (ligne.body as string[]).join("\n\n") : String(ligne.body ?? "")}
            className={inputCls}
          />
        </div>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {Boolean(ligne.imageUrl) && <img src={String(ligne.imageUrl)} alt="" className="h-20 rounded-lg mb-2 object-cover" />}
          <label className="block text-sm font-medium text-foreground mb-1.5">Image de couverture</label>
          <input type="file" name="imageUrl_fichier" accept="image/*" className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:bg-secondary/70" />
          <input name="imageUrl_url" defaultValue={String(ligne.imageUrl ?? "")} placeholder="Ou coller une URL https://…" className={`${inputCls} mt-2`} />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tagsBloc.map((t) => (
              <label key={t.id} className="inline-flex items-center gap-1.5 text-sm border border-border rounded-lg px-3 py-1.5">
                <input
                  type="checkbox"
                  name="tags"
                  value={String(t.id)}
                  defaultChecked={tagsSelectionnes.includes(String(t.id))}
                  className="w-4 h-4 accent-[#1a4fbd]"
                />
                {t.name}
              </label>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="isPublished" id="isPublished" defaultChecked={ligne.isPublished !== false} className="w-5 h-5 accent-[#1a4fbd]" />
          <label htmlFor="isPublished" className="text-sm font-medium text-foreground">Publié</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="bg-primary hover:bg-primary-deep transition-all text-primary-foreground font-semibold text-sm px-6 py-3 rounded-xl">Enregistrer</button>
          <Link href="/superadmin/blog/articles" className="border border-border hover:bg-secondary transition-colors text-sm font-medium text-foreground px-6 py-3 rounded-xl">Annuler</Link>
        </div>
      </form>
    </div>
  );
}
